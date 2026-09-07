import { afterEach, describe, expect, it, vi } from 'vitest';
import { getApplicationStatus, getMyApplications, submitApplication } from './applications.service';
import { login, logout } from './auth.service';
import { ApiError } from '@/lib/api/types';
import { getMockDb } from '@/mock-api';
import type { ApplicationInput } from '@/types/applicationSchema';

const VALID: ApplicationInput = {
  student: {
    fullName: 'Nusrat Jahan',
    dateOfBirth: '2011-03-12',
    gender: 'female',
    email: 'nusrat@example.test',
    phone: '01712345678',
  },
  guardian: {
    fullName: 'Kamrul Jahan',
    relation: 'father',
    phone: '01812345678',
  },
  academic: {
    gradeId: 'g6',
    schoolName: 'Chattogram Model High School',
  },
  payment: { transactionId: 'DEMO8F3K2Q' },
};

/** Valid input with a unique transaction id per test. */
function makeInput(transactionId: string): ApplicationInput {
  return { ...VALID, payment: { transactionId } };
}

describe('applications service (via mock API)', () => {
  it('creates an application and returns a generated SS26 id', async () => {
    const result = await submitApplication(VALID);
    expect(result.id).toMatch(/^SS26-\d{6}$/);
  });

  it('rejects invalid input with 422 and dotted field paths', async () => {
    const error = await submitApplication({
      ...VALID,
      student: { ...VALID.student, fullName: 'x', phone: '123' },
    }).catch((err: unknown) => err);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 422, code: 'VALIDATION' });
    expect(Object.keys((error as ApiError).details ?? {})).toEqual(
      expect.arrayContaining(['student.fullName', 'student.phone']),
    );
  });

  it('rejects a reused transaction id with 409 and a payment-field error', async () => {
    await submitApplication(VALID);

    const error = await submitApplication({
      ...VALID,
      student: { ...VALID.student, email: 'another@example.test' },
    }).catch((err: unknown) => err);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 409, code: 'CONFLICT' });
    expect((error as ApiError).details?.transactionId).toBeInstanceOf(Array);
  });
});

describe('application tracking endpoint (anti-enumeration)', () => {
  it('returns a public-safe status view with no personal data', async () => {
    const { id } = await submitApplication(makeInput('TRACKOK99'));
    const view = await getApplicationStatus(id);

    expect(Object.keys(view).sort()).toEqual([
      'correctionNote',
      'id',
      'paymentStatus',
      'status',
      'submittedAt',
      'updatedAt',
    ]);
    expect(view).toMatchObject({ id, status: 'payment_pending', paymentStatus: 'pending' });
    // Student, guardian, school, and contact data never appear in tracking.
    expect(JSON.stringify(view)).not.toContain('Nusrat');
    expect(JSON.stringify(view)).not.toContain('school');
    expect(view.submittedAt).toBe(getMockDb().applications.find((a) => a.id === id)?.createdAt);
  });

  it('answers unknown ids with an identical 404 (nothing to enumerate)', async () => {
    const error = await getApplicationStatus('SS26-999999').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 404,
      code: 'NOT_FOUND',
      message: 'Application not found',
    });
  });
});

describe('payment verification simulation (DemoPay)', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('verifies a normal reference and moves the application to under_review', async () => {
    const { id } = await submitApplication(makeInput('DEMOOK1234'));
    await expect(getApplicationStatus(id)).resolves.toMatchObject({
      status: 'payment_pending',
      paymentStatus: 'pending',
    });

    const submittedAt = Date.now();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(submittedAt + 3000)); // past the 2s window

    const settled = await getApplicationStatus(id);
    expect(settled).toMatchObject({ status: 'under_review', paymentStatus: 'verified' });

    const audit = getMockDb().auditLog;
    expect(audit.some((e) => e.action === 'payment.verified' && e.recordId === id)).toBe(true);
    expect(
      audit.some(
        (e) =>
          e.action === 'application.status_changed' &&
          e.recordId === id &&
          e.details?.to === 'under_review',
      ),
    ).toBe(true);
  });

  it('flags DemoPay ids ending in 00 for admin attention', async () => {
    const { id } = await submitApplication(makeInput('DEMOFLAG00'));
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.now() + 3000));

    const view = await getApplicationStatus(id);
    expect(view).toMatchObject({ status: 'payment_pending', paymentStatus: 'needs_review' });
    expect(getMockDb().auditLog.some((e) => e.action === 'payment.flagged' && e.recordId === id)).toBe(true);
  });

  it('leaves payments pending until the simulated delay has elapsed', async () => {
    const { id } = await submitApplication(makeInput('DEMOSLOW99'));
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.now() + 1000)); // inside the 2s window

    await expect(getApplicationStatus(id)).resolves.toMatchObject({ paymentStatus: 'pending' });
  });

  it('never touches already-settled seeded applications', async () => {
    const view = await getApplicationStatus('SS26-100001');
    expect(view).toMatchObject({ status: 'under_review', paymentStatus: 'verified' });
  });
});

describe('submission bookkeeping', () => {
  it('persists the record and writes an application.created audit entry', async () => {
    const { id } = await submitApplication(makeInput('AUDITOK77'));

    const record = getMockDb().applications.find((a) => a.id === id);
    expect(record).toMatchObject({ status: 'payment_pending', ownerUserId: null });
    expect(record?.payment.amount).toBe(150); // g6 fee derived server-side

    const entry = getMockDb().auditLog.find(
      (e) => e.action === 'application.created' && e.recordId === id,
    );
    expect(entry).toMatchObject({
      actor: 'anonymous',
      result: 'success',
      details: { gradeId: 'g6' },
    });
  });

  it('attributes the application when submitted while signed in', async () => {
    await login('ayesha@scholarsphere.test', 'demo-applicant-2026');
    const { id } = await submitApplication(makeInput('OWNED0011'));

    const mine = await getMyApplications();
    expect(mine.map((a) => a.id)).toContain(id);
    expect(mine.map((a) => a.id)).toContain('SS26-100001');
    expect(mine.map((a) => a.id)).not.toContain('SS26-100002');

    const record = getMockDb().applications.find((a) => a.id === id);
    expect(record?.ownerUserId).toBe('u-ayesha');
    await logout();
  });
});
