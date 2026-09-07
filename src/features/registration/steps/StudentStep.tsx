import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Field } from '@/components/ui/Field';
import { Select } from '@/components/ui/Select';
import { TextInput } from '@/components/ui/TextInput';
import type { RegisterFormValues } from '../schema';

/** Step 2 — student identity and contact. */
export function StudentStep() {
  const { t } = useTranslation('register');
  const {
    register,
    formState: { errors },
  } = useFormContext<RegisterFormValues>();

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field
        label={t('student.fullName')}
        hint={t('student.fullNameHint')}
        isRequired
        error={errors.student?.fullName?.message}
        className="sm:col-span-2"
      >
        <TextInput {...register('student.fullName')} autoComplete="name" maxLength={80} />
      </Field>

      <Field label={t('student.dateOfBirth')} isRequired error={errors.student?.dateOfBirth?.message}>
        <TextInput type="date" {...register('student.dateOfBirth')} />
      </Field>

      <Field label={t('student.gender')} isRequired error={errors.student?.gender?.message}>
        <Select {...register('student.gender')}>
          <option value="" disabled>
            —
          </option>
          <option value="male">{t('student.genderOptions.male')}</option>
          <option value="female">{t('student.genderOptions.female')}</option>
          <option value="other">{t('student.genderOptions.other')}</option>
          <option value="prefer_not_to_say">{t('student.genderOptions.prefer_not_to_say')}</option>
        </Select>
      </Field>

      <Field label={t('student.email')} isRequired error={errors.student?.email?.message}>
        <TextInput type="email" {...register('student.email')} autoComplete="email" maxLength={120} />
      </Field>

      <Field
        label={t('student.phone')}
        hint={t('student.phoneHint')}
        isRequired
        error={errors.student?.phone?.message}
      >
        <TextInput type="tel" inputMode="numeric" {...register('student.phone')} maxLength={11} />
      </Field>
    </div>
  );
}
