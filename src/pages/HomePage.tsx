import { useTranslation } from 'react-i18next';
import { useSettings } from '@/hooks/useSettings';
import { useStats } from '@/hooks/useStats';
import { useLocalized } from '@/hooks/useLocalized';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';
import { LatestNotices } from '@/features/notices/components/LatestNotices';

/** Original decorative hero illustration — abstract book & guiding star. */
function HeroArt() {
  return (
    <svg
      viewBox="0 0 520 420"
      className="h-auto w-full max-w-md justify-self-center lg:justify-self-end"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="8" y="8" width="504" height="404" rx="24" fill="#0b1b31" />
      <circle cx="260" cy="205" r="150" fill="none" stroke="#1f3359" strokeWidth="1.5" />
      <circle
        cx="260"
        cy="205"
        r="188"
        fill="none"
        stroke="#1f3359"
        strokeWidth="1.5"
        strokeDasharray="3 8"
      />
      <path d="M260 92l15 48 48 15-48 15-15 48-15-48-48-15 48-15z" fill="#d6ac3f" />
      <circle cx="380" cy="120" r="5" fill="#e0c164" />
      <circle cx="140" cy="290" r="4" fill="#8fa9d0" />
      <circle cx="405" cy="300" r="3" fill="#ebd897" />
      {/* open book */}
      <path d="M160 258q50-30 100-2v74q-50-28-100-2z" fill="#f5eccb" />
      <path d="M360 258q-50-30-100-2v74q50-28 100-2z" fill="#e0c164" />
      <path d="M260 256v74" stroke="#0b1b31" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M176 274q38-20 72-2M176 294q38-20 72-2M344 274q-38-20-72-2M344 294q-38-20-72-2"
        stroke="#0b1b31"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
      {/* ground arc */}
      <path
        d="M120 366q140-56 280 0"
        fill="none"
        stroke="#5f7fb4"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

function StatsStrip() {
  const { t } = useTranslation('home');
  const { data: stats } = useStats();
  const { pick } = useLocalized();

  return (
    <section aria-labelledby="stats-heading" className="bg-navy-900">
      <Container className="py-12 md:py-14">
        <h2 id="stats-heading" className="sr-only">
          {t('stats.heading')}
        </h2>
        {stats ? (
          <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.id} className="text-center">
                <dd className="text-gold-300 text-3xl font-bold tracking-tight md:text-4xl">
                  {stat.value}
                </dd>
                <dt className="text-navy-200 mt-1.5 text-sm">{pick(stat.label)}</dt>
              </div>
            ))}
          </dl>
        ) : (
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="space-y-2 text-center">
                <Skeleton className="bg-navy-700 mx-auto h-9 w-20" />
                <Skeleton className="bg-navy-700 mx-auto h-4 w-28" />
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

export default function HomePage() {
  const { t } = useTranslation(['home', 'common']);
  const { pick } = useLocalized();
  const { data: settings } = useSettings();

  useDocumentMeta(t('meta.title'), t('meta.description'));

  return (
    <>
      <section className="border-line bg-surface-raised border-b">
        <Container className="grid items-center gap-12 py-14 md:py-20 lg:grid-cols-2 lg:py-24">
          <div>
            {settings ? (
              <p className="text-gold-700 text-xs font-semibold tracking-widest uppercase">
                {pick(settings.programName)} · {settings.cycle}
              </p>
            ) : (
              <Skeleton className="h-4 w-64" />
            )}
            <h1 className="text-navy-950 mt-4 text-4xl font-bold tracking-tight sm:text-5xl sm:leading-[1.15]">
              {t('hero.title')}
            </h1>
            <p className="text-ink-muted mt-6 max-w-xl text-lg">{t('hero.subtitle')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/register" variant="primary" size="lg">
                {t('common:actions.apply')}
              </ButtonLink>
              <ButtonLink to="/scholarship" variant="secondary" size="lg">
                {t('common:actions.exploreProgram')}
              </ButtonLink>
            </div>
          </div>
          <HeroArt />
        </Container>
      </section>

      <StatsStrip />
      <LatestNotices />
    </>
  );
}
