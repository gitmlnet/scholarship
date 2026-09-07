import type { Application } from '@/types';
import {
  buildApplicationSchemas,
  defaultValidationMessages,
} from '@/types/applicationSchema';
import { ApiError } from '@/lib/api/types';
import type { Db } from '../db/db';
import { saveUserTable } from '../db/persistence';
import type { MockRoute } from '../server';

const schemas = buildApplicationSchemas(defaultValidationMessages);

/** SS26-XXXXXX: 6 digits, uniqueness-checked against existing records. */
function generateId(db: Db, shortCode: string): string {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const digits = String(Math.floor(100000 + Math.random() * 900000));
    const id = `${shortCode}-${digits}`;
    if (!db.applications.some((application) => application.id === id)) return id;
  }
  throw new ApiError(500, 'INTERNAL', 'Could not generate a unique application id');
}

/**
 * POST /applications — the registration wizard's single submit.
 * Phase 4 scope: validate, prevent duplicate payment references, create the
 * record at `payment_pending`. (Verification simulation, the full status
 * machine, and audit logging are Phase 5 — see ARCHITECTURE.md §18.)
 */
export function createApplicationRoutes(getDb: () => Db): MockRoute[] {
  return [
    {
      method: 'POST',
      pattern: '/applications',
      handler: ({ body }): { id: string } => {
        const parsed = schemas.input.safeParse(body);
        if (!parsed.success) {
          const details: Record<string, string[]> = {};
          for (const issue of parsed.error.issues) {
            const key = issue.path.join('.') || '_';
            details[key] = [...(details[key] ?? []), issue.message];
          }
          throw new ApiError(422, 'VALIDATION', 'Invalid application payload', details);
        }
        const input = parsed.data;

        const db = getDb();

        // Duplicate payment reference within this cycle → friendly 409.
        const duplicate = db.applications.find(
          (application) =>
            application.payment.transactionId.toLowerCase() ===
            input.payment.transactionId.toLowerCase(),
        );
        if (duplicate) {
          throw new ApiError(409, 'CONFLICT', 'Payment reference already used', {
            transactionId: ['This transaction ID was already used in this cycle.'],
          });
        }

        const now = new Date().toISOString();
        const fee = db.settings.applicationFee.byGrade.find(
          (entry) => entry.gradeId === input.academic.gradeId,
        );
        const application: Application = {
          id: generateId(db, db.settings.shortCode),
          student: {
            ...input.student,
            fullName: input.student.fullName.trim(),
          },
          guardian: {
            fullName: input.guardian.fullName.trim(),
            relation: input.guardian.relation,
            phone: input.guardian.phone.trim(),
            email: input.guardian.email?.trim() || undefined,
            occupation: input.guardian.occupation?.trim() || undefined,
          },
          academic: {
            gradeId: input.academic.gradeId,
            schoolName: input.academic.schoolName.trim(),
            schoolAddress: input.academic.schoolAddress?.trim() || undefined,
          },
          payment: {
            method: 'mfs_demo',
            transactionId: input.payment.transactionId.trim(),
            amount: fee?.amount ?? 0,
            status: 'pending',
            submittedAt: now,
            verifiedAt: null,
          },
          status: 'payment_pending',
          statusHistory: [
            { status: 'submitted', at: now, actor: 'applicant' },
            { status: 'payment_pending', at: now, actor: 'system' },
          ],
          ownerUserId: null,
          createdAt: now,
          updatedAt: now,
        };

        db.applications.push(application);
        saveUserTable('applications', db.applications);
        return { id: application.id };
      },
    },
  ];
}
