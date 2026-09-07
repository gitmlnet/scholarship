import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Field } from '@/components/ui/Field';
import { Select } from '@/components/ui/Select';
import { TextInput } from '@/components/ui/TextInput';
import type { RegisterFormValues } from '../schema';

/** Step 3 — guardian contact (optional extras stay optional). */
export function GuardianStep() {
  const { t } = useTranslation('register');
  const {
    register,
    formState: { errors },
  } = useFormContext<RegisterFormValues>();

  return (
    <div className="space-y-5">
      <p className="text-ink-muted">{t('guardian.intro')}</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t('guardian.fullName')} isRequired error={errors.guardian?.fullName?.message}>
          <TextInput {...register('guardian.fullName')} maxLength={80} />
        </Field>

        <Field label={t('guardian.relation')} isRequired error={errors.guardian?.relation?.message}>
          <Select {...register('guardian.relation')}>
            <option value="" disabled>
              —
            </option>
            <option value="father">{t('guardian.relationOptions.father')}</option>
            <option value="mother">{t('guardian.relationOptions.mother')}</option>
            <option value="legal_guardian">{t('guardian.relationOptions.legal_guardian')}</option>
            <option value="other">{t('guardian.relationOptions.other')}</option>
          </Select>
        </Field>

        <Field label={t('guardian.phone')} isRequired error={errors.guardian?.phone?.message}>
          <TextInput type="tel" inputMode="numeric" {...register('guardian.phone')} maxLength={11} />
        </Field>

        <Field label={t('guardian.email')} error={errors.guardian?.email?.message}>
          <TextInput type="email" {...register('guardian.email')} maxLength={120} />
        </Field>

        <Field label={t('guardian.occupation')} error={errors.guardian?.occupation?.message}>
          <TextInput {...register('guardian.occupation')} maxLength={80} />
        </Field>
      </div>
    </div>
  );
}
