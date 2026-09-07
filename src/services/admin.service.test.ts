import { describe, expect, it } from 'vitest';
import {
  getApplication,
  getAuditLog,
  listApplications,
  requestCorrection,
  updateApplicationStatus,
} from './admin.service';
import { login } from './auth.service';
import { submitApplication } from './applications.service';
import { ApiError } from '@/lib/api/types';
import { getMockDb } from '@/mock-api';
import type { ApplicationInput } from '@/types/applicationSchema';

const ADMIN = { email: 'admin@scholarsphere.test', password: 'demo-admin-2026' };
const AYESHA = { email: 'ayesha@scholarsphere.test', password: 'demo-applicant-2026' };

async function adminLogin() {
  await login(ADMIN.email, ADMIN.password);
}

function makeInput(transactionId: string): ApplicationInput {
  return {
    student: {
      fullName: 'Nusrat Jahan',
      dateOfBirth: '2011-03-12',
      gender: 'female',
      email: 'nusrat@example.test',
      phone: '01712345678',
    },
    guardian: { fullName: 'Kamrul Jahan', relation: 'father', phone: '01812345678' },
    academic: { gradeId: 'g6', schoolName: 'Chattogram Model High School' },
    payment: { transactionId },
  };
}

describe('admin authorization (enforced by the API, not the UI)', () => {
  it('rejects anonymous access with 401', async () => {
    const error = await listApplications().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 401, code: 'UNAUTHORIZED' });
  });

  it('rejects non-admin roles with 403', async () => {
    await login(AYESHA.email, AYESHA.password);
    for (const attempt of [
      () => listApplications(),
      () => getApplication('SS26-100001'),
      () => updateApplicationStatus('SS26-100001', { status: 'approved' }),
      () => requestCorrection('SS26-100001', 'Please fix the name.'),
      () => getAuditLog(),
    ]) {
      const error = await attempt().catch((e: unknown) => e);
      expect(error).toMatchObject({ status: 403, code: 'FORBIDDEN' });
    }
  });
});

describe('admin applications list', () => {
  it('lists all applications newest-first with pagination metadata', async () => {
    await adminLogin();
    const page = await listApplications();
    expect(page.total).toBe(2); // the two seeded demo applications
    expect(page.items.map((a) => a.id)).toEqual(['SS26-100001', 'SS26-100002']);
    expect(page).toMatchObject({ page: 1, pageCount: 1 });
  });

  it('filters by status, grade, and free-text query', async () => {
    await adminLogin();

    const byStatus = await listApplications({ status: 'needs_correction' });
    expect(byStatus.items.map((a) => a.id)).toEqual(['SS26-100002']);

    const byGrade = await listApplications({ grade: 'g9' });
    expect(byGrade.items.map((a) => a.id)).toEqual(['SS26-100002']);

    const byQuery = await listApplications({ q: 'ayesha' });
    expect(byQuery.items.map((a) => a.id)).toEqual(['SS26-100001']);

    const bySchool = await listApplications({ q: 'agrabad' });
    expect(bySchool.items.map((a) => a.id)).toEqual(['SS26-100002']);

    const combined = await listApplications({ status: 'under_review', grade: 'g7' });
    expect(combined.items.map((a) => a.id)).toEqual(['SS26-100001']);
  });

  it('sorts oldest-first and by status when asked', async () => {
    await adminLogin();
    const oldest = await listApplications({ sort: 'oldest' });
    expect(oldest.items.map((a) => a.id)).toEqual(['SS26-100002', 'SS26-100001']);
  });

  it('rejects invalid filters with 422', async () => {
    await adminLogin();
    for (const [query, key] of [
      [{ status: 'frozen' as never }, 'status'],
      [{ grade: 'g99' }, 'grade'],
      [{ sort: 'random' as never }, 'sort'],
      [{ page: 0 }, 'page'],
    ] as const) {
      const error = await listApplications(query).catch((e: unknown) => e);
      expect(error).toMatchObject({ status: 422, code: 'VALIDATION' });
      expect(Object.keys((error as ApiError).details ?? {})).toContain(key);
    }
  });

  it('paginates: page 1 full, page 2 empty', async () => {
    await submitApplication(makeInput('PAGINAT01')); // submitted anonymously
    await adminLogin();

    const page1 = await listApplications({ page: 1 });
    expect(page1.items).toHaveLength(3);
    expect(page1).toMatchObject({ total: 3, page: 1, pageCount: 1 });

    const page9 = await listApplications({ page: 9 });
    expect(page9.items).toHaveLength(0);
    expect(page9).toMatchObject({ total: 3, page: 9, pageCount: 1 });
  });

  it('returns the full record for a known id and 404 for unknown', async () => {
    await adminLogin();
    const record = await getApplication('SS26-100001');
    expect(record).toMatchObject({ id: 'SS26-100001', status: 'under_review' });
    expect(record.student.fullName).toBe('Ayesha Rahman');

    const error = await getApplication('SS26-999999').catch((e: unknown) => e);
    expect(error).toMatchObject({ status: 404, code: 'NOT_FOUND' });
  });
});

describe('admin status machine (transitions enforced server-side)', () => {
  it('allows legal transitions and records history + audit', async () => {
    await adminLogin();
    const updated = await updateApplicationStatus('SS26-100001', {
      status: 'approved',
      note: 'Verified against the school records.',
    });

    expect(updated.status).toBe('approved');
    expect(updated.statusHistory.at(-1)).toMatchObject({
      status: 'approved',
      actor: 'admin:admin@scholarsphere.test',
      note: 'Verified against the school records.',
    });
    const entry = getMockDb().auditLog.find(
      (e) =>
        e.action === 'application.status_changed' &&
        e.recordId === 'SS26-100001' &&
        e.details?.to === 'approved',
    );
    expect(entry).toMatchObject({ result: 'success', details: { from: 'under_review', to: 'approved' } });
  });

  it('allows needs_correction → under_review after a correction cycle', async () => {
    await adminLogin();
    const updated = await updateApplicationStatus('SS26-100002', { status: 'under_review' });
    expect(updated.status).toBe('under_review');
  });

  it('rejects illegal transitions with 422 and the allowed set', async () => {
    const { id } = await submitApplication(makeInput('SKIPSTAGE')); // anonymous submit
    await adminLogin();

    await updateApplicationStatus('SS26-100001', { status: 'approved' }); // legal
    const terminal = await updateApplicationStatus('SS26-100001', {
      status: 'under_review',
    }).catch((e: unknown) => e);
    expect(terminal).toBeInstanceOf(ApiError);
    expect(terminal).toMatchObject({ status: 422, code: 'VALIDATION' });
    expect((terminal as ApiError).details?.status?.[0]).toContain('terminal state');

    const skipStages = await updateApplicationStatus(id, { status: 'approved' }).catch(
      (e: unknown) => e,
    );
    expect(skipStages).toMatchObject({ status: 422 });
    expect((skipStages as ApiError).details?.status?.[0]).toContain(
      'Allowed transitions from payment_pending: under_review, rejected.',
    );
  });

  it('rejects no-op transitions to the current status', async () => {
    await adminLogin();
    const error = await updateApplicationStatus('SS26-100002', {
      status: 'needs_correction',
    }).catch((e: unknown) => e);
    expect(error).toMatchObject({ status: 422 });
    expect((error as ApiError).details?.status?.[0]).toContain('Already needs_correction.');
  });

  it('validates the status and note shapes', async () => {
    await adminLogin();
    const badStatus = await updateApplicationStatus('SS26-100001', {
      status: 'frozen' as never,
    }).catch((e: unknown) => e);
    expect(badStatus).toMatchObject({ status: 422 });

    const badNote = await updateApplicationStatus('SS26-100001', {
      status: 'approved',
      note: 'x'.repeat(301),
    }).catch((e: unknown) => e);
    expect(badNote).toMatchObject({ status: 422 });
    expect(Object.keys((badNote as ApiError).details ?? {})).toContain('note');
  });

  it('adjudicates flagged payments: accepting verifies, rejecting refuses', async () => {
    // Flagged DemoPay ids (ending 00) stay payment_pending until the admin acts.
    const acceptedId = (await submitApplication(makeInput('ADJUDOK00'))).id;
    const refusedId = (await submitApplication(makeInput('ADJUDNO00'))).id;
    await adminLogin();

    const accepted = await updateApplicationStatus(acceptedId, {
      status: 'under_review',
      note: 'Payment confirmed manually.',
    });
    expect(accepted.status).toBe('under_review');
    expect(accepted.payment.status).toBe('verified');
    expect(accepted.payment.verifiedAt).toBeTruthy();

    const refused = await updateApplicationStatus(refusedId, {
      status: 'rejected',
      note: 'Payment could not be verified.',
    });
    expect(refused.status).toBe('rejected');
    expect(refused.payment.status).toBe('rejected');
  });
});

describe('admin correction requests', () => {
  it('moves an under_review application to needs_correction with the note', async () => {
    await adminLogin();
    const note = 'Birth certificate name does not match the school record.';
    const updated = await requestCorrection('SS26-100001', note);

    expect(updated.status).toBe('needs_correction');
    expect(updated.correctionNote).toBe(note);
    expect(getMockDb().auditLog.some((e) => e.action === 'application.correction_requested')).toBe(true);
  });

  it('only works on under_review applications', async () => {
    await adminLogin();
    const error = await requestCorrection('SS26-100002', 'Anything.').catch((e: unknown) => e);
    expect(error).toMatchObject({ status: 422 });
    expect((error as ApiError).details?.status?.[0]).toContain('under review');
  });

  it('validates the note length', async () => {
    await adminLogin();
    const tooShort = await requestCorrection('SS26-100001', 'x').catch((e: unknown) => e);
    expect(tooShort).toMatchObject({ status: 422 });
    expect(Object.keys((tooShort as ApiError).details ?? {})).toContain('note');
  });
});

describe('admin audit log', () => {
  it('returns entries newest-first and filters by record', async () => {
    const { id } = await submitApplication(makeInput('AUDITSRC1')); // anonymous submit
    await adminLogin();

    const all = await getAuditLog();
    expect(all.total).toBeGreaterThanOrEqual(2); // login + creation
    const [newest, second] = all.items;
    if (!newest || !second) throw new Error('expected at least two audit entries');
    expect(Date.parse(newest.at) >= Date.parse(second.at)).toBe(true);
    expect(all.items.some((e) => e.action === 'auth.login')).toBe(true);

    const scoped = await getAuditLog({ recordId: id });
    expect(scoped.items.length).toBeGreaterThanOrEqual(1);
    expect(scoped.items.every((e) => e.recordId === id)).toBe(true);
    expect(scoped.items.some((e) => e.action === 'application.created')).toBe(true);
  });

  it('paginates the audit log', async () => {
    await adminLogin();
    const page1 = await getAuditLog({ page: 1 });
    expect(page1.items).toHaveLength(page1.total); // everything fits on page 1
    expect(page1.total).toBeGreaterThanOrEqual(1);

    const page2 = await getAuditLog({ page: 2 });
    expect(page2.items).toHaveLength(0);
    expect(page2).toMatchObject({ page: 2, total: page1.total });
  });
});
