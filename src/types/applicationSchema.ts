import { z } from 'zod';

/**
 * Shared validation contracts for scholarship applications — used by the
 * registration wizard (with translated messages) AND by the mock API
 * (with English defaults). This is the "schema doubles as API contract"
 * point from ARCHITECTURE.md §4: a future real backend validates the same
 * shape.
 */

export const GENDER_VALUES = ['male', 'female', 'other', 'prefer_not_to_say'] as const;
export const GUARDIAN_RELATION_VALUES = ['father', 'mother', 'legal_guardian', 'other'] as const;
export const GRADE_ID_VALUES = ['g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10'] as const;

/** 11-digit Bangladeshi mobile number: 01XXXXXXXXX. */
export const PHONE_PATTERN = /^01\d{9}$/;
/** DemoPay transaction reference: 8–20 letters/digits, no spaces. */
export const TRANSACTION_ID_PATTERN = /^[A-Za-z0-9]{8,20}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Age window for Grades 4–10 (fictional program rule). */
export const AGE_MIN = 7;
export const AGE_MAX = 20;

function ageInYears(dobIso: string): number {
  const dob = new Date(`${dobIso}T00:00:00`);
  if (Number.isNaN(dob.getTime())) return -1;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const beforeBirthday =
    now.getMonth() < dob.getMonth() ||
    (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

/**
 * Message strings injected at build time so the UI can localize validation
 * errors (the mock API uses the English defaults below).
 */
export interface ApplicationValidationMessages {
  required: string;
  nameLength: string;
  emailInvalid: string;
  phoneInvalid: string;
  dateInvalid: string;
  ageOutOfRange: string;
  schoolNameLength: string;
  transactionIdInvalid: string;
  mustAccept: string;
}

export const defaultValidationMessages: ApplicationValidationMessages = {
  required: 'This field is required.',
  nameLength: 'Must be 2–80 characters.',
  emailInvalid: 'Enter a valid email address.',
  phoneInvalid: 'Enter a valid 11-digit mobile number starting with 01.',
  dateInvalid: 'Enter a valid date.',
  ageOutOfRange: `The student must be between ${AGE_MIN} and ${AGE_MAX} years old.`,
  schoolNameLength: 'Must be 2–120 characters.',
  transactionIdInvalid: 'Use 8–20 letters or digits (no spaces).',
  mustAccept: 'You must confirm this to continue.',
};

/** What the wizard sends — everything except the wizard-only confirmations. */
export interface ApplicationInput {
  student: {
    fullName: string;
    dateOfBirth: string;
    gender: (typeof GENDER_VALUES)[number];
    email: string;
    phone: string;
  };
  guardian: {
    fullName: string;
    relation: (typeof GUARDIAN_RELATION_VALUES)[number];
    phone: string;
    email?: string;
    occupation?: string;
  };
  academic: {
    gradeId: (typeof GRADE_ID_VALUES)[number];
    schoolName: string;
    schoolAddress?: string;
  };
  payment: {
    transactionId: string;
  };
}

/**
 * Builds all schemas from one message bundle. Sub-schemas are returned
 * individually so the wizard can validate per step (zodResolver on the
 * whole form + `trigger` on the step's fields).
 */
export function buildApplicationSchemas(m: ApplicationValidationMessages) {
  const gender = z.enum(GENDER_VALUES, { errorMap: () => ({ message: m.required }) });
  const relation = z.enum(GUARDIAN_RELATION_VALUES, {
    errorMap: () => ({ message: m.required }),
  });
  const gradeId = z.enum(GRADE_ID_VALUES, { errorMap: () => ({ message: m.required }) });

  const fullName = z.string().trim().min(2, m.nameLength).max(80, m.nameLength);
  const phone = z.string().trim().regex(PHONE_PATTERN, m.phoneInvalid);
  const email = z.string().trim().regex(EMAIL_PATTERN, m.emailInvalid).max(120, m.emailInvalid);
  const optionalEmail = z
    .string()
    .trim()
    .max(120, m.emailInvalid)
    .refine((value) => value === '' || EMAIL_PATTERN.test(value), m.emailInvalid)
    .optional(); // key may be absent entirely
  const optionalShortText = z.string().trim().max(80, m.nameLength).optional();
  const dateOfBirth = z
    .string()
    .regex(ISO_DATE_PATTERN, m.dateInvalid)
    .refine((value) => {
      const age = ageInYears(value);
      return age >= AGE_MIN && age <= AGE_MAX;
    }, m.ageOutOfRange);

  const eligibility = z.object({
    enrolled: z.boolean().refine((value) => value, m.mustAccept),
    recognized: z.boolean().refine((value) => value, m.mustAccept),
    singleApplication: z.boolean().refine((value) => value, m.mustAccept),
    accurateInfo: z.boolean().refine((value) => value, m.mustAccept),
  });

  const student = z.object({
    fullName,
    dateOfBirth,
    gender,
    email,
    phone,
  });

  const guardian = z.object({
    fullName,
    relation,
    phone,
    email: optionalEmail,
    occupation: optionalShortText,
  });

  const academic = z.object({
    gradeId,
    schoolName: z.string().trim().min(2, m.schoolNameLength).max(120, m.schoolNameLength),
    schoolAddress: z
      .string()
      .trim()
      .max(200, m.schoolNameLength)
      .refine((value) => value === '' || value.length >= 2, m.schoolNameLength)
      .optional(), // key may be absent entirely
  });

  const payment = z.object({
    transactionId: z.string().trim().regex(TRANSACTION_ID_PATTERN, m.transactionIdInvalid),
  });

  /** Full wizard form (eligibility confirmations are wizard-only state). */
  const wizard = z.object({ eligibility, student, guardian, academic, payment });

  /** API payload contract — POST /applications body. */
  const input = z.object({ student, guardian, academic, payment });

  return { wizard, input, eligibility, student, guardian, academic, payment };
}
