import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';

/** Suspense/query fallback for page-level loading (never a blank screen). */
export function PageLoading() {
  const { t } = useTranslation('common');
  return (
    <Container as="section" className="py-20">
      <div role="status" aria-live="polite" className="max-w-3xl">
        <span className="sr-only">{t('state.loading')}</span>
        <div className="space-y-4">
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-3/6" />
        </div>
      </div>
    </Container>
  );
}
