import { useTranslation } from 'react-i18next';
import { isRouteErrorResponse, useRouteError } from 'react-router';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';

/** Route-level error boundary — render crashes never leave a blank screen. */
export function RouterErrorBoundary() {
  const { t } = useTranslation(['pages', 'common']);
  const error = useRouteError();

  const isNotFound = isRouteErrorResponse(error) && error.status === 404;
  const title = isNotFound ? t('notFound.title') : t('common:state.error');
  const description = isNotFound ? t('notFound.description') : t('common:state.error');

  return (
    <Container as="section" className="py-24 text-center">
      <p className="text-gold-700 text-sm font-semibold tracking-widest uppercase">
        {isNotFound ? '404' : '500'}
      </p>
      <h1 className="text-navy-950 mt-3 text-3xl font-bold">{title}</h1>
      <p className="text-ink-muted mx-auto mt-4 max-w-md">{description}</p>
      <ButtonLink to="/" variant="primary" className="mt-8">
        {t('notFound.backHome')}
      </ButtonLink>
    </Container>
  );
}
