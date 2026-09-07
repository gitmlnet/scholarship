import type { AuditEntry } from '@/types';
import type { Db } from './db/db';
import { saveUserTable } from './db/persistence';

/** Keep the demo audit trail bounded (log rotation, oldest dropped first). */
const MAX_AUDIT_ENTRIES = 500;

let counter = 0;

/** Opaque audit id — timestamp + process-lifetime counter + random suffix. */
function nextAuditId(): string {
  const random = Math.random().toString(36).slice(2, 6);
  counter += 1;
  return `audit-${Date.now().toString(36)}-${counter.toString(36)}-${random}`;
}

/**
 * Append an audit entry and persist the log. NEVER store passwords, tokens,
 * or credentials here — only who did what, to which record, when, and the
 * result (docs/ARCHITECTURE.md §6).
 */
export function writeAudit(
  db: Db,
  entry: Omit<AuditEntry, 'id' | 'at'> & { at?: string },
): AuditEntry {
  const record: AuditEntry = {
    id: nextAuditId(),
    at: entry.at ?? new Date().toISOString(),
    actor: entry.actor,
    action: entry.action,
    recordType: entry.recordType,
    recordId: entry.recordId,
    result: entry.result,
    details: entry.details,
  };
  db.auditLog.push(record);
  if (db.auditLog.length > MAX_AUDIT_ENTRIES) {
    db.auditLog.splice(0, db.auditLog.length - MAX_AUDIT_ENTRIES);
  }
  saveUserTable('auditLog', db.auditLog);
  return record;
}
