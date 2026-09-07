import { createAdminRoutes } from './routes/admin';
import { createApplicationRoutes } from './routes/applications';
import { createAuthRoutes } from './routes/auth';
import { createContentRoutes } from './routes/content';
import { createMeRoutes } from './routes/me';
import { MockServer } from './server';
import { clearSessions } from './auth';
import { SESSION_TOKEN_KEY } from '@/config/storageKeys';
import { createDb, resetDb, type Db } from './db/db';

/**
 * Singleton mock "server" instance used by the default ApiClient.
 * Handlers always read through the `getDb()` accessor so `resetMockApi()`
 * takes effect immediately.
 */
let db: Db = createDb();

const server = new MockServer([
  ...createContentRoutes(() => db),
  ...createApplicationRoutes(() => db),
  ...createAuthRoutes(() => db),
  ...createMeRoutes(() => db),
  ...createAdminRoutes(() => db),
]);

export function getMockDb(): Db {
  return db;
}

export function getMockServer(): MockServer {
  return server;
}

/**
 * Reset persisted demo data back to pristine seed state — user tables,
 * demo sessions, and the client's dangling session token.
 */
export function resetMockApi(): void {
  db = resetDb();
  clearSessions();
  try {
    window.sessionStorage.removeItem(SESSION_TOKEN_KEY);
  } catch {
    // ignore
  }
}

export type { Db } from './db/db';
