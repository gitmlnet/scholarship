import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Accordion, type AccordionItem } from '@/components/ui/Accordion';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { CheckIcon } from '@/components/ui/icons';
import { PageShell } from '@/components/common/PageShell';
import { SectionHeading } from '@/components/common/SectionHeading';
import { ErrorState } from '@/components/common/ErrorState';
import { useGrades } from '@/hooks/useGrades';
import { useSettings } from '@/hooks/useSettings';
import { useLocalized } from '@/hooks/useLocalized';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { formatNumber } from '@/utils/format';

/** General requirements + grade-wise exam/eligibility configuration. */
export default function EligibilityPage() {
  const { t } = useTranslation(['pages', 'common', 'home']);
  const { lang, pick } = useLocalized();
  const { data: grades, isPending, isError, refetch } = useGrades();
  const { data: settings } = useSettings();

  useDocumentMeta(t('eligibility.title'), t('eligibility.description'));

  const generalItems = t('eligibility.general.items', { returnObjects: true }) as string[];

  const feeFor = (gradeId: string) =>
    settings?.applicationFee.byGrade.find((entry) => entry.gradeId === gradeId);

  const items: AccordionItem[] =
    grades?.map((grade) => ({
      id: grade.id,
      summary: `${pick(grade.label)} — ${formatNumber(grade.totalMarks, lang)}`,
      content: (
        <div className="space-y-4">
          <p className="text-ink">{pick(grade.eligibility)}</p>

          <div>
            <p className="text-navy-900 mb-2 text-xs font-semibold tracking-wider uppercase">
              {t('common:exam.subjects')}
            </p>
            <ul className="flex flex-wrap gap-2">
              {grade.subjects.map((subject) => (
                <li key={subject.name.en}>
                  <Badge variant="neutral">
                    {pick(subject.name)} · {formatNumber(subject.marks, lang)}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>

          <dl className="grid gap-3 sm:grid-cols-3">
            <div className="border-line rounded-lg border px-4 py-3">
              <dt className="text-ink-muted text-xs">{t('common:exam.totalMarks')}</dt>
              <dd className="text-navy-950 font-semibold">
                {formatNumber(grade.totalMarks, lang)}
              </dd>
            </div>
            <div className="border-line rounded-lg border px-4 py-3">
              <dt className="text-ink-muted text-xs">{t('common:exam.duration')}</dt>
              <dd className="text-navy-950 font-semibold">
                {t('common:exam.minutes', {
                  count: formatNumber(grade.examDurationMinutes, lang),
                })}
              </dd>
            </div>
            <div className="border-line rounded-lg border px-4 py-3">
              <dt className="text-ink-muted text-xs">{t('common:exam.fee')}</dt>
              <dd className="text-navy-950 font-semibold">
                {feeFor(grade.id)
                  ? `${settings?.applicationFee.symbol ?? '৳'}${formatNumber(feeFor(grade.id)?.amount ?? 0, lang)}`
                  : '—'}
              </dd>
            </div>
          </dl>

          <div>
            <p className="text-navy-900 mb-2 text-xs font-semibold tracking-wider uppercase">
              {t('common:exam.instructions')}
            </p>
            <ul className="space-y-1.5">
              {grade.instructions.map((instruction) => (
                <li key={instruction.en} className="text-ink flex gap-2">
                  <CheckIcon className="text-success-700 mt-0.5 size-4 shrink-0" />
                  {pick(instruction)}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-4 pt-1">
            <Link
              to={`/syllabus/${grade.id}`}
              className="text-navy-800 text-sm font-semibold underline-offset-4 hover:underline"
            >
              {t('eligibility.gradeCard.syllabusLink')} →
            </Link>
            <Link
              to="/register"
              className="text-navy-800 text-sm font-semibold underline-offset-4 hover:underline"
            >
              {t('eligibility.gradeCard.applyLink')} →
            </Link>
          </div>
        </div>
      ),
    })) ?? [];

  return (
    <PageShell title={t('eligibility.title')} description={t('eligibility.description')}>
      {/* General requirements */}
      <section aria-labelledby="general-heading">
        <SectionHeading title={t('eligibility.general.heading')} />
        <Card className="max-w-3xl">
          <ul className="space-y-3">
            {generalItems.map((item) => (
              <li key={item} className="text-ink flex gap-3">
                <CheckIcon className="text-success-700 mt-0.5 size-5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Grade-wise configuration */}
      <section aria-labelledby="grade-heading" className="mt-16 scroll-mt-24">
        <h2
          id="grade-heading"
          className="text-navy-950 text-2xl font-bold tracking-tight sm:text-3xl"
        >
          {t('eligibility.gradeCard.heading')}
        </h2>
        <p className="text-ink-muted mt-3 max-w-2xl">{t('eligibility.feeNote')}</p>
        <div className="mt-6 max-w-4xl">
          {isError && <ErrorState onRetry={refetch} />}
          {isPending && (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((index) => (
                <Skeleton key={index} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          )}
          {!isPending && !isError && <Accordion items={items} exclusiveName="eligibility-grades" />}
        </div>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <ButtonLink to="/register" variant="primary" size="lg">
          {t('common:actions.apply')}
        </ButtonLink>
        <ButtonLink to="/syllabus" variant="secondary" size="lg">
          {t('home:syllabusTeaser.cta')}
        </ButtonLink>
      </div>
    </PageShell>
  );
}
