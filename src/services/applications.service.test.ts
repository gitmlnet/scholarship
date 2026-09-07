import { describe, expect, it } from 'vitest';
import { submitApplication } from './applications.service';
import { ApiError } from '@/lib/api/types';
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
