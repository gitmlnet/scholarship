import type { Application } from '@/types';
import type { Db } from './db/db';
import { saveUserTable } from './db/persistence';
import { writeAudit } from './audit';

/**
 * DemoPay payment verification — SIMULATED, deterministic, and documented
 * (README + the wizard's payment step). No real provider is contacted.
 *
 * Rule: roughly 2 s after submission the payment "verifies":
 *   - transaction IDs ending in "00" are flagged for admin attention
 *     (payment → needs_review, application stays payment_pending)
 *   - everything else verifies (payment → verified, application →
 *     under_review)
 *
 * Settlement runs lazily whenever the affected records are read (tracking,
 * /me, admin list/detail) and once via a timer after creation, so it works
 * across reloads and stays truthful in storage. Both paths are idempotent.
 */

/** How long after submission the simulated verification completes. */
export const PAYMENT_VERIFICATION_DELAY_MS = 2000;

/** DemoPay IDs ending with this are flagged instead of verified. */
export const FLAGGED_TRANSACTION_SUFFIX = '00';

export function isFlaggedTransaction(transactionId: string): boolean {
  return transactionId.toLowerCase().endsWith(FLAGGED_TRANSACTION_SUFFIX);
}

function applySettlement(db: Db, application: Application, now: number): void {
  const at = new Date(now).toISOString();

  if (isFlaggedTransaction(application.payment.transactionId)) {
    application.payment.status = 'needs_review';
    application.updatedAt = at;
    writeAudit(db, {
      actor: 'system',
      action: 'payment.flagged',
      recordType: 'application',
      recordId: application.id,
      result: 'success',
      details: { reason: 'demo-flagged-pattern' },
    });
    return;
  }

  application.payment.status = 'verified';
  application.payment.verifiedAt = at;
  application.status = 'under_review';
  application.statusHistory.push({
    status: 'under_review',
    at,
    actor: 'system',
    note: 'DemoPay payment verified (simulated).',
  });
  application.updatedAt = at;
  writeAudit(db, {
    actor: 'system',
    action: 'payment.verified',
    recordType: 'application',
    recordId: application.id,
    result: 'success',
  });
  writeAudit(db, {
    actor: 'system',
    action: 'application.status_changed',
    recordType: 'application',
    recordId: application.id,
    result: 'success',
    details: { from: 'payment_pending', to: 'under_review' },
  });
}

/**
 * Settle every due pending payment (read-time path). Safe to call on any
 * request — already-settled or not-yet-due payments are left untouched.
 */
export function settleDuePayments(db: Db, now = Date.now()): void {
  let changed = false;
  for (const application of db.applications) {
    if (application.status !== 'payment_pending') continue;
    if (application.payment.status !== 'pending') continue;
    if (now - Date.parse(application.payment.submittedAt) < PAYMENT_VERIFICATION_DELAY_MS) continue;

    applySettlement(db, application, now);
    changed = true;
  }
  if (changed) saveUserTable('applications', db.applications);
}

/**
 * Timer path: runs the settlement shortly after the delay elapses so the
 * state flips in storage even if nobody re-reads the record. No-ops after
 * a reset (the record is gone) and is idempotent with the read path.
 */
export function schedulePaymentSettlement(getDb: () => Db): void {
  setTimeout(() => {
    try {
      settleDuePayments(getDb());
    } catch {
      // A background job failing silently must never break the UI.
    }
  }, PAYMENT_VERIFICATION_DELAY_MS);
}
