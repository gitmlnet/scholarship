import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  buildApplicationSchemas,
  type ApplicationInput,
  type ApplicationValidationMessages,
} from '@/types/applicationSchema';

/** The six form steps; the 7th ("confirm") is the success screen. */
export const STEP_IDS = [
  'eligibility',
  'student',
  'guardian',
  'academic',
  'payment',
  'review',
] as const;
export type WizardStepId = (typeof STEP_IDS)[number];

export const REVIEW_STEP_INDEX = STEP_IDS.length - 1;
export const PAYMENT_STEP_INDEX = STEP_IDS.length - 2;

/** Field paths validated per step (passed to `trigger`). */
export const STEP_FIELD_PATHS: Record<WizardStepId, string[]> = {
  eligibility: [
    'eligibility.enrolled',
    'eligibility.recognized',
    'eligibility.singleApplication',
    'eligibility.accurateInfo',
  ],
  student: [
    'student.fullName',
    'student.dateOfBirth',
    'student.gender',
    'student.email',
    'student.phone',
  ],
  guardian: [
    'guardian.fullName',
    'guardian.relation',
    'guardian.phone',
    'guardian.email',
    'guardian.occupation',
  ],
  academic: ['academic.gradeId', 'academic.schoolName', 'academic.schoolAddress'],
  payment: ['payment.transactionId'],
  review: [],
};

/**
 * Form-level shape. Select fields are plain strings (with an empty default
 * for the placeholder option); the Zod schema enforces the real enums at
 * validation time, and `toApplicationPayload` narrows after validation.
 */
export interface RegisterFormValues {
  eligibility: {
    enrolled: boolean;
    recognized: boolean;
    singleApplication: boolean;
    accurateInfo: boolean;
  };
  student: {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    phone: string;
  };
  guardian: {
    fullName: string;
    relation: string;
    phone: string;
    email: string;
    occupation: string;
  };
  academic: {
    gradeId: string;
    schoolName: string;
    schoolAddress: string;
  };
  payment: {
    transactionId: string;
  };
}

export const DEFAULT_VALUES: RegisterFormValues = {
  eligibility: {
    enrolled: false,
    recognized: false,
    singleApplication: false,
    accurateInfo: false,
  },
  student: { fullName: '', dateOfBirth: '', gender: '', email: '', phone: '' },
  guardian: { fullName: '', relation: '', phone: '', email: '', occupation: '' },
  academic: { gradeId: '', schoolName: '', schoolAddress: '' },
  payment: { transactionId: '' },
};

/**
 * Schemas built from the CURRENT language's validation messages.
 * Rebuilt on language switch so errors re-localize on next validation.
 */
export function useRegisterForm() {
  const { t } = useTranslation('register');
  return useMemo(() => {
    const messages: ApplicationValidationMessages = {
      required: t('validation.required'),
      nameLength: t('validation.nameLength'),
      emailInvalid: t('validation.emailInvalid'),
      phoneInvalid: t('validation.phoneInvalid'),
      dateInvalid: t('validation.dateInvalid'),
      ageOutOfRange: t('validation.ageOutOfRange'),
      schoolNameLength: t('validation.schoolNameLength'),
      transactionIdInvalid: t('validation.transactionIdInvalid'),
      mustAccept: t('validation.mustAccept'),
    };
    const schemas = buildApplicationSchemas(messages);
    return {
      schemas,
      resolver: zodResolver(schemas.wizard) as Resolver<RegisterFormValues>,
    };
  }, [t]);
}

/**
 * Narrow the (already validated) wide form values into the API payload.
 * Enum casts are safe: `handleSubmit` only fires after schema validation.
 */
export function toApplicationPayload(values: RegisterFormValues): ApplicationInput {
  return {
    student: {
      fullName: values.student.fullName,
      dateOfBirth: values.student.dateOfBirth,
      gender: values.student.gender as ApplicationInput['student']['gender'],
      email: values.student.email,
      phone: values.student.phone,
    },
    guardian: {
      fullName: values.guardian.fullName,
      relation: values.guardian.relation as ApplicationInput['guardian']['relation'],
      phone: values.guardian.phone,
      email: values.guardian.email.trim() || undefined,
      occupation: values.guardian.occupation.trim() || undefined,
    },
    academic: {
      gradeId: values.academic.gradeId as ApplicationInput['academic']['gradeId'],
      schoolName: values.academic.schoolName,
      schoolAddress: values.academic.schoolAddress.trim() || undefined,
    },
    payment: { transactionId: values.payment.transactionId },
  };
}
