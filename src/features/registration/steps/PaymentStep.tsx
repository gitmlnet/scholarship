import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { TextInput } from '@/components/ui/TextInput';
import { useSettings } from '@/hooks/useSettings';
import { useLocalized } from '@/hooks/useLocalized';
import { formatNumber } from '@/utils/format';
import type { RegisterFormValues } from '../schema';

/** Step 5 — DemoPay reference: fee shown for the selected grade. */
export function PaymentStep() {
  const { t } = useTranslation('register');
  const { lang } = useLocalized();
  const { data: settings } = useSettings();
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<RegisterFormValues>();

  const gradeId = watch('academic.gradeId');
  const fee = settings?.applicationFee.byGrade.find((entry) => entry.gradeId === gradeId);

  return (
    <div className="space-y-6">
      <Alert variant="info" title={t('payment.intro')} />

      <Card padding="sm">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-ink-muted text-xs font-semibold tracking-wider uppercase">
              {t('payment.amountLabel')}
            </dt>
            <dd className="text-navy-950 mt-1 text-lg font-bold">
              {fee ? (
                <>
                  {settings?.applicationFee.symbol ?? '৳'}
                  {formatNumber(fee.amount, lang)}
                </>
              ) : (
                t('payment.selectGradeFirst')
              )}
            </dd>
          </div>
          <div>
            <dt className="text-ink-muted text-xs font-semibold tracking-wider uppercase">
              {t('payment.merchantLabel')}
            </dt>
            <dd className="text-navy-950 mt-1 font-mono text-sm font-semibold">
              {settings?.paymentMethod.merchantAccount ?? 'SCHOLARSPHERE-DEMO'}
            </dd>
          </div>
        </dl>
      </Card>

      <Field
        label={t('payment.transactionId')}
        hint={t('payment.transactionIdHint')}
        isRequired
        error={errors.payment?.transactionId?.message}
      >
        <TextInput {...register('payment.transactionId')} maxLength={20} autoComplete="off" />
      </Field>
    </div>
  );
}
