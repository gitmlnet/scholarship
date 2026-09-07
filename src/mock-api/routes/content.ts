import type {
  ContactMessage,
  Faq,
  GradeConfig,
  GradeId,
  Notice,
  NoticeCategory,
  ProgramSettings,
  ResultYear,
  ResultYearIndexEntry,
  Statistic,
  Syllabus,
} from '@/types';
import { ApiError } from '@/lib/api/types';
import type { Db } from '../db/db';
import { saveUserTable } from '../db/persistence';
import type { MockRoute } from '../server';

const NOTICE_CATEGORIES: readonly NoticeCategory[] = ['registration', 'exam', 'result', 'general'];
const GRADE_IDS: readonly GradeId[] = ['g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Contact-form field constraints (mirrored by the UI form). */
const CONTACT_LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 120 },
  subject: { min: 4, max: 120 },
  message: { min: 10, max: 2000 },
} as const;

function requireGradeId(value: string | null): GradeId {
  if (!value || !GRADE_IDS.includes(value as GradeId)) {
    throw new ApiError(422, 'VALIDATION', `Unknown grade: ${value}`, {
      grade: [`Must be one of: ${GRADE_IDS.join(', ')}`],
    });
  }
  return value as GradeId;
}

/** Public content endpoints (read-only slices of the DB). */
export function createContentRoutes(getDb: () => Db): MockRoute[] {
  return [
    {
      method: 'GET',
      pattern: '/settings',
      handler: (): ProgramSettings => getDb().settings,
    },
    {
      method: 'GET',
      pattern: '/stats',
      handler: (): Statistic[] => [...getDb().stats],
    },
    {
      method: 'GET',
      pattern: '/faqs',
      handler: (): Faq[] => [...getDb().faqs],
    },
    {
      method: 'GET',
      pattern: '/grades',
      handler: (): GradeConfig[] => [...getDb().grades],
    },
    {
      method: 'GET',
      pattern: '/syllabus',
      handler: (): Syllabus[] => [...getDb().syllabus],
    },
    {
      method: 'GET',
      pattern: '/syllabus/:gradeId',
      handler: ({ params }): Syllabus => {
        const gradeId = requireGradeId(params.gradeId ?? null);
        const syllabus = getDb().syllabus.find((item) => item.gradeId === gradeId);
        if (!syllabus) {
          throw new ApiError(404, 'NOT_FOUND', `No syllabus published for grade: ${gradeId}`);
        }
        return syllabus;
      },
    },
    {
      method: 'GET',
      pattern: '/results/years',
      handler: (): ResultYearIndexEntry[] =>
        [...getDb().resultIndex].sort((a, b) => b.year - a.year),
    },
    {
      method: 'GET',
      pattern: '/results',
      handler: ({ query }): ResultYear => {
        const yearParam = query.get('year');
        if (!yearParam || !/^\d{4}$/.test(yearParam)) {
          throw new ApiError(422, 'VALIDATION', 'A four-digit year is required', {
            year: ['Provide a year, e.g. 2025'],
          });
        }
        const gradeId = requireGradeId(query.get('grade'));
        const year = Number(yearParam);

        const result = getDb().results.find(
          (item) => item.year === year && item.gradeId === gradeId,
        );
        if (!result) {
          throw new ApiError(
            404,
            'NOT_FOUND',
            `No published results for ${gradeId.toUpperCase()} in ${year}`,
          );
        }

        const search = query.get('q')?.trim().toLowerCase();
        if (!search) return result;
        return {
          ...result,
          meritList: result.meritList.filter(
            (entry) =>
              entry.studentName.toLowerCase().includes(search) ||
              entry.schoolName.toLowerCase().includes(search),
          ),
        };
      },
    },
    {
      method: 'POST',
      pattern: '/contact',
      handler: ({ body }): { id: string } => {
        const input = (body ?? {}) as Record<string, unknown>;
        const errors: Record<string, string[]> = {};

        const name = typeof input.name === 'string' ? input.name.trim() : '';
        const email = typeof input.email === 'string' ? input.email.trim() : '';
        const subject = typeof input.subject === 'string' ? input.subject.trim() : '';
        const message = typeof input.message === 'string' ? input.message.trim() : '';

        if (name.length < CONTACT_LIMITS.name.min || name.length > CONTACT_LIMITS.name.max) {
          errors.name = [
            `Must be ${CONTACT_LIMITS.name.min}–${CONTACT_LIMITS.name.max} characters`,
          ];
        }
        if (!EMAIL_PATTERN.test(email) || email.length > CONTACT_LIMITS.email.max) {
          errors.email = ['Enter a valid email address'];
        }
        if (
          subject.length < CONTACT_LIMITS.subject.min ||
          subject.length > CONTACT_LIMITS.subject.max
        ) {
          errors.subject = [
            `Must be ${CONTACT_LIMITS.subject.min}–${CONTACT_LIMITS.subject.max} characters`,
          ];
        }
        if (
          message.length < CONTACT_LIMITS.message.min ||
          message.length > CONTACT_LIMITS.message.max
        ) {
          errors.message = [
            `Must be ${CONTACT_LIMITS.message.min}–${CONTACT_LIMITS.message.max} characters`,
          ];
        }
        if (Object.keys(errors).length > 0) {
          throw new ApiError(422, 'VALIDATION', 'Invalid contact message', errors);
        }

        const db = getDb();
        const contactMessage: ContactMessage = {
          id: `cm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
          name,
          email,
          subject,
          message,
          createdAt: new Date().toISOString(),
        };
        db.contactMessages.push(contactMessage);
        saveUserTable('contactMessages', db.contactMessages);
        return { id: contactMessage.id };
      },
    },
    {
      method: 'GET',
      pattern: '/notices',
      handler: ({ query }): Notice[] => {
        let items = [...getDb().notices];

        const category = query.get('category');
        if (category) {
          if (!NOTICE_CATEGORIES.includes(category as NoticeCategory)) {
            throw new ApiError(422, 'VALIDATION', `Unknown notice category: ${category}`, {
              category: [`Must be one of: ${NOTICE_CATEGORIES.join(', ')}`],
            });
          }
          items = items.filter((notice) => notice.category === category);
        }

        // Pinned first, then newest first (stable within equal dates).
        items.sort((a, b) => {
          if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
          return b.date.localeCompare(a.date);
        });

        const limit = query.get('limit');
        if (limit !== null && /^\d+$/.test(limit)) {
          items = items.slice(0, Number(limit));
        }
        return items;
      },
    },
    {
      method: 'GET',
      pattern: '/notices/:id',
      handler: ({ params }): Notice => {
        const notice = getDb().notices.find((item) => item.id === params.id);
        if (!notice) {
          throw new ApiError(404, 'NOT_FOUND', `Notice not found: ${params.id}`);
        }
        return notice;
      },
    },
  ];
}
