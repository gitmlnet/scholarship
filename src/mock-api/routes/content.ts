import type { Faq, Notice, NoticeCategory, ProgramSettings, Statistic } from '@/types';
import { ApiError } from '@/lib/api/types';
import type { Db } from '../db/db';
import type { MockRoute } from '../server';

const NOTICE_CATEGORIES: readonly NoticeCategory[] = ['registration', 'exam', 'result', 'general'];

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
