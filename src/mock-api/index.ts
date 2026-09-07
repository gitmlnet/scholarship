import { createContentRoutes } from './routes/content';
import { MockServer } from './server';
import { createDb, resetDb, type Db } from './db/db';

/**
 * Singleton mock "server" instance used by the default ApiClient.
 * Handlers always read through the `getDb()` accessor so `resetMockApi()`
 * takes effect immediately.
 */
let db: Db = createDb();

const server = new MockServer([...createContentRoutes(() => db)]);

export function getMockDb(): Db {
  return db;
}

export function getMockServer(): MockServer {
  return server;
}

/** Reset persisted demo data back to pristine seed state. */
export function resetMockApi(): void {
  db = resetDb();
}

export type { Db } from './db/db';
