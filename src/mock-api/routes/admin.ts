import { ApiError } from '@/lib/api/types';
import {
  APPLICATION_TRANSITIONS,
  canTransition,
  type Application,
  type ApplicationStatus,
  type AuditEntry,
  type Paginated,
  type User,
} from '@/types';
import type { Db } from '../db/db';
import { saveUserTable } from '../db/persistence';
import { resolveSession } from '../auth';
import { settleDuePayments } from '../payments';
import { writeAudit } from '../audit';
import type { MockRoute } from '../server';

const APPLICATION_PAGE_SIZE = 10;
const AUDIT_PAGE_SIZE = 20;

const SORT_OPTIONS = ['newest', 'oldest', 'status'] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

const STATUS_VALUES = Object.keys(APPLICATION_TRANSITIONS) as ApplicationStatus[];

/** Admin-only guard: 401 anonymous, 403 for non-admin roles. */
function requireAdmin(db: Db, authToken: string | null): User {
  const user = resolveSession(db, authToken);
  if (!user) throw new ApiError(401, 'UNAUTHORIZED', 'Not signed in');
  if (user.role !== 'admin') throw new ApiError(403, 'FORBIDDEN', 'Admin access required');
  return user;
}

function adminActor(user: User): string {
  return `admin:${user.email}`;
}

function parsePage(value: string | null): number {
  const page = Number(value ?? '1');
  if (!Number.isInteger(page) || page < 1) {
    throw new ApiError(422, 'VALIDATION', 'Invalid page', { page: ['Must be a positive integer.'] });
  }
  return page;
}

function paginate<T>(items: T[], page: number, pageSize: number): Paginated<T> {
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    total,
    page,
    pageCount,
  };
}

function findApplication(db: Db, id: string): Application {
  const application = db.applications.find((entry) => entry.id === id);
  if (!application) throw new ApiError(404, 'NOT_FOUND', 'Application not found');
  return application;
}

interface StatusBody {
  status?: unknown;
  note?: unknown;
}

interface CorrectionBody {
  note?: unknown;
}

/**
 * Admin routes — role `admin` enforced on every handler (never UI-only,
 * docs/ARCHITECTURE.md §9). List/detail read through the same settlement
 * pass as tracking so admin views agree with applicant views.
 */
export function createAdminRoutes(getDb: () => Db): MockRoute[] {
  return [
    {
      method: 'GET',
      pattern: '/admin/applications',
      handler: ({ query, authToken }): Paginated<Application> => {
        const db = getDb();
        requireAdmin(db, authToken);
        settleDuePayments(db);

        const status = query.get('status');
        if (status !== null && !STATUS_VALUES.includes(status as ApplicationStatus)) {
          throw new ApiError(422, 'VALIDATION', 'Invalid status filter', {
            status: [`Must be one of: ${STATUS_VALUES.join(', ')}.`],
          });
        }
        const grade = query.get('grade');
        if (grade !== null && !db.grades.some((entry) => entry.id === grade)) {
          throw new ApiError(422, 'VALIDATION', 'Invalid grade filter', {
            grade: ['Unknown grade.'],
          });
        }
        const sort = (query.get('sort') ?? 'newest') as SortOption;
        if (!SORT_OPTIONS.includes(sort)) {
          throw new ApiError(422, 'VALIDATION', 'Invalid sort', {
            sort: [`Must be one of: ${SORT_OPTIONS.join(', ')}.`],
          });
        }
        const page = parsePage(query.get('page'));
        const q = (query.get('q') ?? '').trim().toLowerCase();

        let items = [...db.applications];
        if (status) items = items.filter((application) => application.status === status);
        if (grade) items = items.filter((application) => application.academic.gradeId === grade);
        if (q) {
          items = items.filter((application) => {
            const haystack = [
              application.id,
              application.student.fullName,
              application.student.email,
              application.academic.schoolName,
            ]
              .join(' ')
              .toLowerCase();
            return haystack.includes(q);
          });
        }
        items.sort((a, b) => {
          if (sort === 'status' && a.status !== b.status) {
            return a.status.localeCompare(b.status);
          }
          return sort === 'oldest'
            ? Date.parse(a.createdAt) - Date.parse(b.createdAt)
            : Date.parse(b.createdAt) - Date.parse(a.createdAt);
        });

        const snapshots = items.map((application) => ({ ...application }));
        return paginate(snapshots, page, APPLICATION_PAGE_SIZE);
      },
    },
    {
      method: 'GET',
      pattern: '/admin/applications/:id',
      handler: ({ params, authToken }): Application => {
        const db = getDb();
        requireAdmin(db, authToken);
        settleDuePayments(db);
        return { ...findApplication(db, params.id ?? '') };
      },
    },
    {
      method: 'PATCH',
      pattern: '/admin/applications/:id/status',
      handler: ({ params, body, authToken }): Application => {
        const db = getDb();
        const admin = requireAdmin(db, authToken);
        const application = findApplication(db, params.id ?? '');

        const { status, note } = (body ?? {}) as StatusBody;
        if (typeof status !== 'string' || !STATUS_VALUES.includes(status as ApplicationStatus)) {
          throw new ApiError(422, 'VALIDATION', 'Invalid status', {
            status: [`Must be one of: ${STATUS_VALUES.join(', ')}.`],
          });
        }
        if (note !== undefined && (typeof note !== 'string' || note.length > 300)) {
          throw new ApiError(422, 'VALIDATION', 'Invalid note', {
            note: ['Must be a string of at most 300 characters.'],
          });
        }
        const next = status as ApplicationStatus;
        const from = application.status;
        if (from === next) {
          throw new ApiError(422, 'VALIDATION', 'Application is already in that status', {
            status: [`Already ${from}.`],
          });
        }
        if (!canTransition(from, next)) {
          const allowed = APPLICATION_TRANSITIONS[from].join(', ') || 'nothing (terminal state)';
          throw new ApiError(422, 'VALIDATION', `Cannot move from ${from} to ${next}`, {
            status: [`Allowed transitions from ${from}: ${allowed}.`],
          });
        }

        const now = new Date().toISOString();
        // Adjudicating a payment_pending application also settles the
        // payment record: accepting verifies it, rejecting refuses it.
        if (from === 'payment_pending') {
          application.payment.status = next === 'under_review' ? 'verified' : 'rejected';
          if (next === 'under_review') application.payment.verifiedAt = now;
        }

        application.status = next;
        application.statusHistory.push({
          status: next,
          at: now,
          actor: adminActor(admin),
          note: typeof note === 'string' && note.trim() ? note.trim() : undefined,
        });
        application.updatedAt = now;

        saveUserTable('applications', db.applications);
        writeAudit(db, {
          actor: adminActor(admin),
          action: 'application.status_changed',
          recordType: 'application',
          recordId: application.id,
          result: 'success',
          details: { from, to: next },
        });
        return { ...application };
      },
    },
    {
      method: 'POST',
      pattern: '/admin/applications/:id/correction',
      handler: ({ params, body, authToken }): Application => {
        const db = getDb();
        const admin = requireAdmin(db, authToken);
        const application = findApplication(db, params.id ?? '');

        if (application.status !== 'under_review') {
          throw new ApiError(422, 'VALIDATION', 'Correction request not allowed now', {
            status: ['Corrections can only be requested while the application is under review.'],
          });
        }
        const { note } = (body ?? {}) as CorrectionBody;
        if (typeof note !== 'string' || note.trim().length < 2 || note.trim().length > 500) {
          throw new ApiError(422, 'VALIDATION', 'Invalid note', {
            note: ['Must be between 2 and 500 characters.'],
          });
        }

        const now = new Date().toISOString();
        const trimmed = note.trim();
        application.status = 'needs_correction';
        application.correctionNote = trimmed;
        application.statusHistory.push({
          status: 'needs_correction',
          at: now,
          actor: adminActor(admin),
          note: trimmed,
        });
        application.updatedAt = now;

        saveUserTable('applications', db.applications);
        writeAudit(db, {
          actor: adminActor(admin),
          action: 'application.correction_requested',
          recordType: 'application',
          recordId: application.id,
          result: 'success',
          details: { from: 'under_review', to: 'needs_correction' },
        });
        return { ...application };
      },
    },
    {
      method: 'GET',
      pattern: '/admin/audit',
      handler: ({ query, authToken }): Paginated<AuditEntry> => {
        const db = getDb();
        requireAdmin(db, authToken);

        const page = parsePage(query.get('page'));
        const recordId = query.get('recordId');
        let entries = [...db.auditLog].sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
        if (recordId) {
          entries = entries.filter((entry) => entry.recordId === recordId);
        }
        return paginate(entries, page, AUDIT_PAGE_SIZE);
      },
    },
  ];
}
