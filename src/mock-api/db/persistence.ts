import { DB_NAMESPACE } from '@/config/storageKeys';

/**
 * Browser-local persistence for USER-GENERATED demo data (applications,
 * audit log, …). Seed data lives in code (`src/data/seed`) and is never
 * persisted — the two are strictly separated (docs/ARCHITECTURE.md §8).
 *
 * Keys are namespaced + versioned so future schema changes can migrate
 * or safely discard old data.
 */

function key(tableName: string): string {
  return `${DB_NAMESPACE}.${tableName}`;
}

/** Persist a user-data table. Silently ignores unavailable storage. */
export function saveUserTable(tableName: string, rows: unknown[]): void {
  try {
    window.localStorage.setItem(key(tableName), JSON.stringify(rows));
  } catch {
    // Storage unavailable (private mode/quota) — demo degrades gracefully.
  }
}

/**
 * Load a user-data table. Returns null when nothing valid is stored.
 * Items that fail the shape guard are discarded (corrupt/injected data
 * never enters the in-memory DB).
 */
export function loadUserTable(
  tableName: string,
  isValidItem: (item: unknown) => boolean,
): unknown[] | null {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(key(tableName));
  } catch {
    return null;
  }
  if (raw === null) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const valid = parsed.filter(isValidItem);
    saveUserTable(tableName, valid);
    return valid;
  } catch {
    return null;
  }
}

/** Remove every persisted user-data table (tests + "reset demo data"). */
export function clearUserTables(): void {
  try {
    const toRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const storageKey = window.localStorage.key(i);
      if (storageKey?.startsWith(DB_NAMESPACE)) toRemove.push(storageKey);
    }
    toRemove.forEach((storageKey) => window.localStorage.removeItem(storageKey));
  } catch {
    // ignore
  }
}
