import { useTranslation } from 'react-i18next';
import { useSettings } from '@/hooks/useSettings';
import { useStats } from '@/hooks/useStats';
import { useFaqs } from '@/hooks/useFaqs';
import { useLocalized } from '@/hooks/useLocalized';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { Accordion, type AccordionItem } from '@/components/ui/Accordion';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';
import { LatestNotices } from '@/features/notices/components/LatestNotices';
import { SectionHeading } from '@/components/common/SectionHeading';

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

/** Why students apply — three benefit cards. */
function Benefits() {
  const { t } = useTranslation('home');
  const items = t('benefits.items', { returnObjects: true }) as Array<{
    title: string;
    body: string;
  }>;
  return (
    <Container as="section" className="py-14 md:py-20">
      <SectionHeading title={t('benefits.heading')} />
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <Card key={item.title}>
            <h3 className="text-navy-950 font-semibold">{item.title}</h3>
            <p className="text-ink-muted mt-2 text-sm leading-relaxed">{item.body}</p>
          </Card>
        ))}
      </div>
    </Container>
  );
}

/** Program overview + how it works (numbered steps). */
function Overview() {
  const { t } = useTranslation('home');
  const { lang } = useLocalized();
  const steps = t('howItWorks.steps', { returnObjects: true }) as Array<{
    title: string;
    body: string;
  }>;
  return (
    <Container as="section" className="py-14 md:py-20">
      <SectionHeading title={t('overview.heading')} />
      <p className="text-ink max-w-3xl leading-relaxed">{t('overview.body')}</p>

      <h3 className="text-navy-950 mt-12 text-xl font-bold">{t('howItWorks.heading')}</h3>
      <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title} className="flex flex-col gap-2">
            <span className="bg-navy-800 flex size-9 items-center justify-center rounded-full text-sm font-bold text-white">
              {new Intl.NumberFormat(lang === 'bn' ? 'bn-BD' : 'en').format(index + 1)}
            </span>
            <h4 className="text-navy-950 mt-1 font-semibold">{step.title}</h4>
            <p className="text-ink-muted text-sm leading-relaxed">{step.body}</p>
          </li>
        ))}
      </ol>
    </Container>
  );
}

/** Eligibility + syllabus teasers, side by side. */
function Teasers() {
  const { t } = useTranslation(['home', 'common']);
  return (
    <Container as="section" className="py-14 md:py-20">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-navy-50 flex flex-col">
          <h3 className="text-navy-950 text-xl font-bold">{t('home:eligibilityTeaser.heading')}</h3>
          <p className="text-ink-muted mt-2 flex-1 leading-relaxed">
            {t('home:eligibilityTeaser.body')}
          </p>
          <ButtonLink to="/eligibility" variant="secondary" className="mt-5 self-start">
            {t('home:eligibilityTeaser.cta')}
          </ButtonLink>
        </Card>
        <Card className="bg-gold-50 flex flex-col">
          <h3 className="text-navy-950 text-xl font-bold">{t('home:syllabusTeaser.heading')}</h3>
          <p className="text-ink-muted mt-2 flex-1 leading-relaxed">
            {t('home:syllabusTeaser.body')}
          </p>
          <ButtonLink to="/syllabus" variant="secondary" className="mt-5 self-start">
            {t('home:syllabusTeaser.cta')}
          </ButtonLink>
        </Card>
      </div>
    </Container>
  );
}

/** Fictional scholar testimonials. */
function Stories() {
  const { t } = useTranslation('home');
  const items = t('stories.items', { returnObjects: true }) as Array<{
    quote: string;
    name: string;
    detail: string;
  }>;
  return (
    <Container as="section" className="py-14 md:py-20">
      <SectionHeading title={t('stories.heading')} />
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <figure
            key={item.name}
            className="border-line bg-surface-raised shadow-card flex h-full flex-col rounded-xl border p-6"
          >
            <blockquote className="text-ink flex-1 leading-relaxed">
              <span aria-hidden="true" className="text-gold-500 text-3xl leading-none">
                “
              </span>
              {item.quote}
            </blockquote>
            <figcaption className="border-line mt-5 border-t pt-4">
              <p className="text-navy-950 font-semibold">{item.name}</p>
              <p className="text-ink-muted mt-0.5 text-xs">{item.detail}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </Container>
  );
}

/** Program-director message (fictional). */
function Leadership() {
  const { t } = useTranslation('home');
  return (
    <Container as="section" className="pb-14 md:pb-20">
      <div className="bg-navy-800 rounded-2xl px-6 py-10 sm:px-12 md:py-14">
        <h2 className="text-gold-300 text-xs font-semibold tracking-widest uppercase">
          {t('leadership.heading')}
        </h2>
        <blockquote className="text-display text-navy-50 mt-4 max-w-3xl">
          {t('leadership.quote')}
        </blockquote>
        <p className="text-gold-300 mt-6 font-semibold">{t('leadership.name')}</p>
        <p className="text-navy-200 text-sm">{t('leadership.role')}</p>
      </div>
    </Container>
  );
}

/** Top-3 FAQ preview, straight from the mock API. */
function FaqTeaser() {
  const { t } = useTranslation('home');
  const { pick } = useLocalized();
  const { data } = useFaqs();
  const items: AccordionItem[] =
    data?.slice(0, 3).map((faq) => ({
      id: faq.id,
      summary: pick(faq.question),
      content: pick(faq.answer),
    })) ?? [];
  return (
    <Container as="section" className="pb-14 md:pb-20">
      <SectionHeading
        title={t('faqTeaser.heading')}
        actions={
          <ButtonLink to="/faq" variant="ghost" size="sm">
            {t('faqTeaser.viewAll')} →
          </ButtonLink>
        }
      />
      <div className="max-w-3xl">
        {items.length > 0 ? (
          <Accordion items={items} exclusiveName="home-faq" />
        ) : (
          <div className="space-y-3">
            {[0, 1, 2].map((index) => (
              <Skeleton key={index} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

/** Final call-to-action band. */
function CtaBand() {
  const { t } = useTranslation(['home', 'common']);
  return (
    <section aria-labelledby="cta-heading" className="border-line bg-surface-raised border-t">
      <Container className="py-14 text-center md:py-20">
        <h2 id="cta-heading" className="text-display text-navy-950">
          {t('home:cta.title')}
        </h2>
        <p className="text-ink-muted mx-auto mt-4 max-w-xl">{t('home:cta.body')}</p>
        <ButtonLink to="/register" variant="primary" size="lg" className="mt-8">
          {t('common:actions.apply')}
        </ButtonLink>
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
            <h1 className="text-display text-navy-950 sm:text-display-lg mt-4">
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
      <Overview />
      <Benefits />
      <Teasers />
      <Stories />
      <Leadership />
      <LatestNotices />
      <FaqTeaser />
      <CtaBand />
    </>
  );
}
