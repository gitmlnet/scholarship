import { ApiError } from '@/lib/api/types';
import type { User } from '@/types';
import type { Db } from '../db/db';
import { resolveSession, revokeSession, verifyCredentials, type LoginSuccess } from '../auth';
import { writeAudit } from '../audit';
import type { MockRoute } from '../server';

interface LoginBody {
  email?: unknown;
  password?: unknown;
}

/**
 * Demo auth routes (docs/ARCHITECTURE.md §7, §9). Handlers are async where
 * credential hashing is involved; the server core awaits them.
 */
export function createAuthRoutes(getDb: () => Db): MockRoute[] {
  return [
    {
      method: 'POST',
      pattern: '/auth/login',
      handler: async ({ body }): Promise<LoginSuccess> => {
        const { email, password } = (body ?? {}) as LoginBody;
        if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
          throw new ApiError(422, 'VALIDATION', 'Email and password are required', {
            email: typeof email === 'string' && email.trim() ? [] : ['Email is required.'],
            password: typeof password === 'string' && password ? [] : ['Password is required.'],
          });
        }

        const db = getDb();
        const result = await verifyCredentials(db, email, password);
        if (!result) {
          writeAudit(db, {
            actor: 'anonymous',
            action: 'auth.login_failed',
            recordType: 'user',
            recordId: email.trim().toLowerCase(),
            result: 'failure',
          });
          // Deliberately vague — never reveal whether the email exists.
          throw new ApiError(401, 'UNAUTHORIZED', 'Invalid email or password');
        }

        writeAudit(db, {
          actor: `user:${result.user.email}`,
          action: 'auth.login',
          recordType: 'user',
          recordId: result.user.id,
          result: 'success',
        });
        return result;
      },
    },
    {
      method: 'POST',
      pattern: '/auth/logout',
      handler: ({ authToken }): void => {
        const db = getDb();
        const user = resolveSession(db, authToken);
        revokeSession(authToken);
        if (user) {
          writeAudit(db, {
            actor: `user:${user.email}`,
            action: 'auth.logout',
            recordType: 'user',
            recordId: user.id,
            result: 'success',
          });
        }
      },
    },
    {
      method: 'GET',
      pattern: '/auth/me',
      handler: ({ authToken }): { user: User } => {
        const user = resolveSession(getDb(), authToken);
        if (!user) {
          throw new ApiError(401, 'UNAUTHORIZED', 'Not signed in');
        }
        return { user };
      },
    },
  ];
}
