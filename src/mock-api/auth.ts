import type { User, UserRecord } from '@/types';
import { SESSIONS_TABLE_KEY } from '@/config/storageKeys';
import type { Db } from './db/db';

/**
 * Demo authentication core (docs/ARCHITECTURE.md §9):
 * - credentials verify via salted SHA-256 digests (crypto.subtle)
 * - login exchanges credentials for an opaque random session token
 * - sessions live in sessionStorage (die with the tab) with enforced expiry
 * This simulates real auth patterns; it is not production security and is
 * documented as such.
 */

const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

export interface SessionRecord {
  token: string;
  userId: string;
  expiresAt: string;
}

export interface LoginSuccess {
  token: string;
  user: User;
}

/** SHA-256 hex digest of `salt + password` via WebCrypto. */
export async function sha256Hex(input: string): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error('WebCrypto unavailable — cannot verify credentials');
  }
  const digest = await subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/** Opaque random token (32 bytes, hex) — never derived from user data. */
function generateToken(): string {
  const bytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/** Length-only comparison that still burns equal time on mismatch. */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/** The user record without its credential — all the UI ever gets. */
export function toPublicUser(record: UserRecord): User {
  return {
    id: record.id,
    email: record.email,
    role: record.role,
    displayName: record.displayName,
  };
}

function loadSessions(): SessionRecord[] {
  try {
    const raw = window.sessionStorage.getItem(SESSIONS_TABLE_KEY);
    if (raw === null) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is SessionRecord =>
        typeof entry === 'object' &&
        entry !== null &&
        typeof (entry as SessionRecord).token === 'string' &&
        typeof (entry as SessionRecord).userId === 'string' &&
        typeof (entry as SessionRecord).expiresAt === 'string',
    );
  } catch {
    return [];
  }
}

function saveSessions(sessions: SessionRecord[]): void {
  try {
    window.sessionStorage.setItem(SESSIONS_TABLE_KEY, JSON.stringify(sessions));
  } catch {
    // ignore — session just won't survive a reload
  }
}

function pruneExpired(sessions: SessionRecord[], now = Date.now()): SessionRecord[] {
  const alive = sessions.filter((session) => Date.parse(session.expiresAt) > now);
  if (alive.length !== sessions.length) saveSessions(alive);
  return alive;
}

/**
 * Verify demo credentials. Returns a fresh session (token + public user) or
 * null — the caller decides how to respond (401) and what to audit.
 */
export async function verifyCredentials(
  db: Db,
  email: string,
  password: string,
): Promise<LoginSuccess | null> {
  const normalized = email.trim().toLowerCase();
  const record = db.users.find((user) => user.email.toLowerCase() === normalized);
  if (!record) return null;

  const digest = await sha256Hex(`${record.credential.salt}${password}`);
  if (!constantTimeEqual(digest, record.credential.hash)) return null;

  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();
  const sessions = pruneExpired(loadSessions());
  sessions.push({ token, userId: record.id, expiresAt });
  saveSessions(sessions);
  return { token, user: toPublicUser(record) };
}

/** Resolve a bearer token to its (unexpired) user, or null. */
export function resolveSession(db: Db, token: string | null): User | null {
  if (!token) return null;
  const sessions = pruneExpired(loadSessions());
  const session = sessions.find((entry) => entry.token === token);
  if (!session) return null;
  const record = db.users.find((user) => user.id === session.userId);
  return record ? toPublicUser(record) : null;
}

/** Revoke a session (logout). Returns true when a session was removed. */
export function revokeSession(token: string | null): boolean {
  if (!token) return false;
  const sessions = pruneExpired(loadSessions());
  const remaining = sessions.filter((entry) => entry.token !== token);
  saveSessions(remaining);
  return remaining.length !== sessions.length;
}

/** Wipe every demo session (used by resetMockApi). */
export function clearSessions(): void {
  try {
    window.sessionStorage.removeItem(SESSIONS_TABLE_KEY);
  } catch {
    // ignore
  }
}
