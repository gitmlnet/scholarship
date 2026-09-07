import { ApiError } from '@/lib/api/types';
import type { Application } from '@/types';
import type { Db } from '../db/db';
import { resolveSession } from '../auth';
import { settleDuePayments } from '../payments';
import type { MockRoute } from '../server';

/**
 * `/me/*` — the applicant's own data. Every handler resolves the session
 * FIRST (401 without one) and then filters strictly by ownerUserId: one
 * applicant can never retrieve another's records (data isolation,
 * docs/ARCHITECTURE.md §9 — tested in the service suite).
 */
export function createMeRoutes(getDb: () => Db): MockRoute[] {
  return [
    {
      method: 'GET',
      pattern: '/me/applications',
      handler: ({ authToken }): Application[] => {
        const db = getDb();
        const user = resolveSession(db, authToken);
        if (!user) throw new ApiError(401, 'UNAUTHORIZED', 'Not signed in');

        settleDuePayments(db);
        return db.applications
          .filter((application) => application.ownerUserId === user.id)
          .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
          .map((application) => ({ ...application }));
      },
    },
  ];
}
