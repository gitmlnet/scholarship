import type { IsoDateTime } from './common';

/**
 * Simple audit trail entry. NEVER stores passwords, tokens, or credentials —
 * only who did what, to which record, when, and with what result.
 */
export interface AuditEntry {
  id: string;
  at: IsoDateTime;
  /** User id/email, or "anonymous" for unauthenticated actions. */
  actor: string;
  /** e.g. "application.created", "application.status_changed", "auth.login_failed" */
  action: string;
  recordType: string;
  recordId: string;
  result: 'success' | 'failure';
  /** Non-sensitive extra context (field names, statuses — never secrets). */
  details?: Record<string, string>;
}
