import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Checkbox } from '@/components/ui/Checkbox';
import type { RegisterFormValues } from '../schema';

/** Step 1 — four confirmations gate the whole wizard. */
export function EligibilityStep() {
  const { t } = useTranslation('register');
  const {
    register,
    formState: { errors },
  } = useFormContext<RegisterFormValues>();

  const confirmations = [
    { key: 'enrolled', path: 'eligibility.enrolled' },
    { key: 'recognized', path: 'eligibility.recognized' },
    { key: 'singleApplication', path: 'eligibility.singleApplication' },
    { key: 'accurateInfo', path: 'eligibility.accurateInfo' },
  ] as const;

  return (
    <div className="space-y-4">
      <p className="text-ink-muted">{t('eligibility.intro')}</p>
      {confirmations.map(({ key, path }) => {
        const error = errors.eligibility?.[key];
        return (
          <div key={key}>
            <Checkbox
              {...register(path)}
              label={t(`eligibility.${key}.label`)}
              description={t(`eligibility.${key}.description`)}
              aria-invalid={error ? true : undefined}
            />
            {error && (
              <p role="alert" className="text-danger-700 mt-1.5 ml-10 text-sm">
                {error.message}
              </p>
            )}
          </div>
        );
      })}
      <p className="pt-2">
        <Link
          to="/eligibility"
          className="text-navy-800 text-sm font-semibold underline-offset-4 hover:underline"
        >
          {t('eligibility.link')} →
        </Link>
      </p>
    </div>
  );
}
