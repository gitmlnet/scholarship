import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

/** Friendly, non-blank error state for failed data loads. */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useTranslation('common');
  return (
    <div
      role="alert"
      className="border-danger-100 bg-danger-50 rounded-xl border px-6 py-8 text-center"
    >
      <p className="text-danger-800 font-medium">{message ?? t('state.error')}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          {t('actions.retry')}
        </Button>
      )}
    </div>
  );
}
