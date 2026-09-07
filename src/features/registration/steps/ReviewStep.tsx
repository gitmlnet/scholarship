import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { useGrades } from '@/hooks/useGrades';
import { useSettings } from '@/hooks/useSettings';
import { useLocalized } from '@/hooks/useLocalized';
import { formatDate, formatNumber } from '@/utils/format';
import { CheckIcon } from '@/components/ui/icons';
import type { WizardStepId } from '../schema';

interface ReviewSectionProps {
  title: string;
  /** Step to jump to when "Edit" is pressed. */
  editStep: WizardStepId;
  onEdit: (step: WizardStepId) => void;
  rows: Array<{ label: string; value: string }>;
}

function ReviewSection({ title, editStep, onEdit, rows }: ReviewSectionProps) {
  const { t } = useTranslation('register');
  return (
    <Card padding="sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-navy-950 font-semibold">{title}</h3>
        <button
          type="button"
          onClick={() => onEdit(editStep)}
          aria-label={`${t('actions.edit')} — ${title}`}
          className="text-navy-800 rounded-sm text-sm font-semibold underline-offset-4 hover:underline"
        >
          {t('actions.edit')}
        </button>
      </div>
      <dl className="mt-3 space-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-wrap justify-between gap-x-6 gap-y-0.5">
            <dt className="text-ink-muted text-sm">{row.label}</dt>
            <dd className="text-navy-900 min-w-0 text-right text-sm font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

/** Step 6 — full summary with edit shortcuts, submit happens from here. */
export function ReviewStep({ onEdit }: { onEdit: (step: WizardStepId) => void }) {
  const { t } = useTranslation('register');
  const { lang, pick } = useLocalized();
  const { data: grades } = useGrades();
  const { data: settings } = useSettings();
  const { getValues } = useFormContext();

  const values = getValues();
  const gradeLabel = pick(
    grades?.find((grade) => grade.id === values.academic.gradeId)?.label ?? {
      en: values.academic.gradeId,
      bn: values.academic.gradeId,
    },
  );
  const fee = settings?.applicationFee.byGrade.find(
    (entry) => entry.gradeId === values.academic.gradeId,
  );

  const genderLabel =
    values.student.gender === 'male'
      ? t('student.genderOptions.male')
      : values.student.gender === 'female'
        ? t('student.genderOptions.female')
        : values.student.gender === 'other'
          ? t('student.genderOptions.other')
          : t('student.genderOptions.prefer_not_to_say');

  const relationLabel =
    values.guardian.relation === 'father'
      ? t('guardian.relationOptions.father')
      : values.guardian.relation === 'mother'
        ? t('guardian.relationOptions.mother')
        : values.guardian.relation === 'legal_guardian'
          ? t('guardian.relationOptions.legal_guardian')
          : t('guardian.relationOptions.other');

  return (
    <div className="space-y-5">
      <p className="text-ink-muted">{t('review.intro')}</p>

      <div className="grid gap-5 lg:grid-cols-2">
        <ReviewSection
          title={t('review.eligibility')}
          editStep="eligibility"
          onEdit={onEdit}
          rows={[{ label: t('review.confirmed'), value: '✓' }]}
        />
        <ReviewSection
          title={t('review.student')}
          editStep="student"
          onEdit={onEdit}
          rows={[
            { label: t('student.fullName'), value: values.student.fullName },
            {
              label: t('student.dateOfBirth'),
              value: formatDate(values.student.dateOfBirth, lang),
            },
            { label: t('student.gender'), value: genderLabel },
            { label: t('student.email'), value: values.student.email },
            { label: t('student.phone'), value: values.student.phone },
          ]}
        />
        <ReviewSection
          title={t('review.guardian')}
          editStep="guardian"
          onEdit={onEdit}
          rows={[
            { label: t('guardian.fullName'), value: values.guardian.fullName },
            { label: t('guardian.relation'), value: relationLabel },
            { label: t('guardian.phone'), value: values.guardian.phone },
            ...(values.guardian.email
              ? [{ label: t('guardian.email'), value: values.guardian.email }]
              : []),
            ...(values.guardian.occupation
              ? [{ label: t('guardian.occupation'), value: values.guardian.occupation }]
              : []),
          ]}
        />
        <ReviewSection
          title={t('review.academic')}
          editStep="academic"
          onEdit={onEdit}
          rows={[
            { label: t('review.gradeLabel'), value: gradeLabel },
            { label: t('academic.school'), value: values.academic.schoolName },
            ...(values.academic.schoolAddress
              ? [
                  { label: t('academic.schoolAddress'), value: values.academic.schoolAddress },
                ]
              : []),
          ]}
        />
        <ReviewSection
          title={t('review.payment')}
          editStep="payment"
          onEdit={onEdit}
          rows={[
            { label: t('payment.transactionId'), value: values.payment.transactionId },
            ...(fee
              ? [
                  {
                    label: t('review.feeLabel'),
                    value: `${settings?.applicationFee.symbol ?? '৳'}${formatNumber(fee.amount, lang)}`,
                  },
                ]
              : []),
          ]}
        />
      </div>

      <p className="text-ink-muted text-sm leading-relaxed">
        <CheckIcon className="text-success-700 mr-1.5 inline size-4 align-[-2px]" />
        {t('review.submitNote')}
      </p>
    </div>
  );
}
