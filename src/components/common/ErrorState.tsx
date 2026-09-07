import { useTranslation } from 'react-i18next';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

/** Friendly, non-blank error state for failed data loads. */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useTranslation('common');
  return (
    <Alert variant="danger" title={message ?? t('state.error')}>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-3" onClick={onRetry}>
          {t('actions.retry')}
        </Button>
      )}
    </Alert>
  );
}
