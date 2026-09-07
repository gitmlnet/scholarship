import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Field } from '@/components/ui/Field';
import { Select } from '@/components/ui/Select';
import { TextInput } from '@/components/ui/TextInput';
import { useGrades } from '@/hooks/useGrades';
import { useLocalized } from '@/hooks/useLocalized';
import type { RegisterFormValues } from '../schema';

/** Step 4 — grade selection (from the mock API's grade configs) + school. */
export function AcademicStep() {
  const { t } = useTranslation('register');
  const { pick } = useLocalized();
  const { data: grades } = useGrades();
  const {
    register,
    formState: { errors },
  } = useFormContext<RegisterFormValues>();

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label={t('academic.grade')} isRequired error={errors.academic?.gradeId?.message}>
        <Select {...register('academic.gradeId')}>
          <option value="" disabled>
            {t('academic.gradePlaceholder')}
          </option>
          {grades?.map((grade) => (
            <option key={grade.id} value={grade.id}>
              {pick(grade.label)}
            </option>
          ))}
        </Select>
      </Field>

      <Field label={t('academic.school')} isRequired error={errors.academic?.schoolName?.message}>
        <TextInput {...register('academic.schoolName')} maxLength={120} />
      </Field>

      <Field
        label={t('academic.schoolAddress')}
        hint={t('academic.schoolAddressHint')}
        error={errors.academic?.schoolAddress?.message}
        className="sm:col-span-2"
      >
        <TextInput {...register('academic.schoolAddress')} maxLength={200} />
      </Field>
    </div>
  );
}
