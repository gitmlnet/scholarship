import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Logo } from './Logo';
import { Container } from '@/components/ui/Container';
import { useSettings } from '@/hooks/useSettings';

const PROGRAM_LINKS = [
  { to: '/scholarship', key: 'header.nav.scholarship' },
  { to: '/eligibility', key: 'header.nav.eligibility' },
  { to: '/syllabus', key: 'header.nav.syllabus' },
  { to: '/results', key: 'header.nav.results' },
] as const;

const SUPPORT_LINKS = [
  { to: '/notices', key: 'header.nav.notices' },
  { to: '/faq', key: 'header.nav.faq' },
  { to: '/contact', key: 'pages:contact.title' },
  { to: '/track', key: 'header.nav.track' },
] as const;

const LEGAL_LINKS = [
  { to: '/privacy', key: 'pages:privacy.title' },
  { to: '/terms', key: 'pages:terms.title' },
] as const;

const linkClass =
  'text-sm text-navy-200 transition-colors hover:text-white focus-visible:outline-white';

export function Footer() {
  const { t } = useTranslation(['layout', 'pages', 'common']);
  const { data: settings } = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-navy-100 mt-auto">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo className="[&_span:last-child]:text-white" />
            <p className="text-navy-200 mt-4 max-w-xs text-sm leading-relaxed">
              {t('footer.blurb')}
            </p>
            {settings && (
              <p className="text-navy-300 mt-4 text-sm">
                {t('footer.contact')}:{' '}
                <a
                  href={`mailto:${settings.contact.email}`}
                  className="text-gold-300 hover:text-gold-200 underline underline-offset-2 focus-visible:outline-white"
                >
                  {settings.contact.email}
                </a>
              </p>
            )}
          </div>

          <nav aria-label={t('footer.columns.program')}>
            <h2 className="text-gold-300 text-xs font-semibold tracking-widest uppercase">
              {t('footer.columns.program')}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {PROGRAM_LINKS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkClass}>
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t('footer.columns.support')}>
            <h2 className="text-gold-300 text-xs font-semibold tracking-widest uppercase">
              {t('footer.columns.support')}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {SUPPORT_LINKS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkClass}>
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t('footer.columns.legal')}>
            <h2 className="text-gold-300 text-xs font-semibold tracking-widest uppercase">
              {t('footer.columns.legal')}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {LEGAL_LINKS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkClass}>
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="border-navy-700 bg-navy-900 text-navy-200 mt-6 rounded-lg border px-3 py-2.5 text-xs leading-relaxed">
              {t('common:demoNotice')}
            </p>
          </nav>
        </div>

        <div className="border-navy-800 text-navy-300 mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs sm:flex-row">
          <p>{t('footer.copyright', { year })}</p>
          <p>{t('footer.disclaimer')}</p>
        </div>
      </Container>
    </footer>
  );
}
