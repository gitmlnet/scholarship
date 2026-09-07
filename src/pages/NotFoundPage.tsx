import { useTranslation } from 'react-i18next';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default function NotFoundPage() {
  const { t } = useTranslation(['pages', 'common']);
  useDocumentMeta(t('notFound.title'), t('notFound.description'));

  return (
    <Container as="section" className="py-24 text-center">
      <p className="text-gold-700 text-sm font-semibold tracking-widest uppercase">404</p>
      <h1 className="text-navy-950 mt-3 text-3xl font-bold md:text-4xl">{t('notFound.title')}</h1>
      <p className="text-ink-muted mx-auto mt-4 max-w-md">{t('notFound.description')}</p>
      <ButtonLink to="/" variant="primary" className="mt-8">
        {t('notFound.backHome')}
      </ButtonLink>
    </Container>
  );
}
