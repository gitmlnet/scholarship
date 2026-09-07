import type { Application } from '@/types';

/**
 * Fictional demo applications owned by the seeded applicant accounts, used
 * to demonstrate data isolation and admin workflows without submitting
 * anything. Both are fully settled (payments long since verified) so the
 * read-time payment simulation never mutates them. IDs sit in a low range
 * the random generator (100000–999999) will not collide with in practice —
 * and the uniqueness check covers them regardless.
 */
export const seedApplications: Application[] = [
  {
    id: 'SS26-100001',
    student: {
      fullName: 'Ayesha Rahman',
      dateOfBirth: '2012-06-18',
      gender: 'female',
      email: 'ayesha@scholarsphere.test',
      phone: '01711000001',
    },
    guardian: {
      fullName: 'Nasir Rahman',
      relation: 'father',
      phone: '01811000001',
      email: 'nasir@scholarsphere.test',
      occupation: 'Schoolteacher',
    },
    academic: {
      gradeId: 'g7',
      schoolName: 'Nasirabad High School',
      schoolAddress: 'Nasirabad, Chattogram',
    },
    payment: {
      method: 'mfs_demo',
      transactionId: 'DEMOA7X41Q',
      amount: 150,
      status: 'verified',
      submittedAt: '2026-09-01T10:12:00.000Z',
      verifiedAt: '2026-09-01T10:12:02.000Z',
    },
    status: 'under_review',
    statusHistory: [
      { status: 'submitted', at: '2026-09-01T10:12:00.000Z', actor: 'applicant' },
      { status: 'payment_pending', at: '2026-09-01T10:12:00.000Z', actor: 'system' },
      {
        status: 'under_review',
        at: '2026-09-01T10:12:02.000Z',
        actor: 'system',
        note: 'DemoPay payment verified (simulated).',
      },
    ],
    correctionNote: null,
    ownerUserId: 'u-ayesha',
    createdAt: '2026-09-01T10:12:00.000Z',
    updatedAt: '2026-09-01T10:12:02.000Z',
  },
  {
    id: 'SS26-100002',
    student: {
      fullName: 'Tanvir Chowdhury',
      dateOfBirth: '2010-02-04',
      gender: 'male',
      email: 'tanvir@scholarsphere.test',
      phone: '01711000002',
    },
    guardian: {
      fullName: 'Rafiq Chowdhury',
      relation: 'father',
      phone: '01811000002',
    },
    academic: {
      gradeId: 'g9',
      schoolName: 'Agrabad Public School',
      schoolAddress: 'Agrabad, Chattogram',
    },
    payment: {
      method: 'mfs_demo',
      transactionId: 'DEMOT9B72K',
      amount: 200,
      status: 'verified',
      submittedAt: '2026-08-30T09:30:00.000Z',
      verifiedAt: '2026-08-30T09:30:02.000Z',
    },
    status: 'needs_correction',
    statusHistory: [
      { status: 'submitted', at: '2026-08-30T09:30:00.000Z', actor: 'applicant' },
      { status: 'payment_pending', at: '2026-08-30T09:30:00.000Z', actor: 'system' },
      { status: 'under_review', at: '2026-08-30T09:30:02.000Z', actor: 'system' },
      {
        status: 'needs_correction',
        at: '2026-09-02T14:05:00.000Z',
        actor: 'admin:admin@scholarsphere.test',
        note: 'Birth certificate name does not match the school record — please resubmit the correct document.',
      },
    ],
    correctionNote:
      'Birth certificate name does not match the school record — please resubmit the correct document.',
    ownerUserId: 'u-rafiq',
    createdAt: '2026-08-30T09:30:00.000Z',
    updatedAt: '2026-09-02T14:05:00.000Z',
  },
];
