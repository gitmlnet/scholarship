import { useTranslation } from 'react-i18next';
import { Alert } from '@/components/ui/Alert';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Table, TBody, Td, Th, THead, TRow } from '@/components/ui/Table';
import { PageShell } from '@/components/common/PageShell';
import { SectionHeading } from '@/components/common/SectionHeading';
import { ErrorState } from '@/components/common/ErrorState';
import { useSettings } from '@/hooks/useSettings';
import { useGrades } from '@/hooks/useGrades';
import { useLocalized } from '@/hooks/useLocalized';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { formatDate, formatNumber } from '@/utils/format';
import { CheckIcon } from '@/components/ui/icons';

/** Exam-structure table (per-grade configuration from the mock API). */
function ExamStructureTable() {
  const { t } = useTranslation(['pages', 'common']);
  const { lang, pick } = useLocalized();
  const { data: grades, isPending, isError, refetch } = useGrades();
  const { data: settings } = useSettings();

  if (isError) return <ErrorState onRetry={refetch} />;

  const feeFor = (gradeId: string) =>
    settings?.applicationFee.byGrade.find((entry) => entry.gradeId === gradeId);

  if (isPending || !grades) {
    return (
      <div className="space-y-2">
        {[0, 1, 2, 3].map((index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <Table caption={t('scholarship.exam.heading')}>
      <THead>
        <Th scope="col">{t('results.grade')}</Th>
        <Th scope="col">{t('common:exam.subjects')}</Th>
        <Th scope="col">{t('common:exam.totalMarks')}</Th>
        <Th scope="col">{t('common:exam.duration')}</Th>
        <Th scope="col">{t('common:exam.fee')}</Th>
      </THead>
      <TBody>
        {grades.map((grade) => (
          <TRow key={grade.id}>
            <Td className="text-navy-900 font-semibold">{pick(grade.label)}</Td>
            <Td className="text-ink-muted">
              {grade.subjects.map((subject) => pick(subject.name)).join(' · ')}
            </Td>
            <Td>{formatNumber(grade.totalMarks, lang)}</Td>
            <Td>
              {t('common:exam.minutes', { count: formatNumber(grade.examDurationMinutes, lang) })}
            </Td>
            <Td>
              {feeFor(grade.id)
                ? `${settings?.applicationFee.symbol ?? '৳'}${formatNumber(feeFor(grade.id)?.amount ?? 0, lang)}`
                : '—'}
            </Td>
          </TRow>
        ))}
      </TBody>
    </Table>
  );
}

/** The Scholarship page: purpose, benefits, exam structure, dates, process. */
export default function ScholarshipPage() {
  const { t } = useTranslation(['pages', 'common']);
  const { lang, pick } = useLocalized();
  const { data: settings } = useSettings();

  useDocumentMeta(t('scholarship.title'), t('scholarship.description'));

  const benefits = t('scholarship.benefits.items', { returnObjects: true }) as Array<{
    title: string;
    body: string;
  }>;
  const steps = t('scholarship.process.steps', { returnObjects: true }) as Array<{
    title: string;
    body: string;
  }>;

  return (
    <PageShell title={t('scholarship.title')} description={t('scholarship.description')}>
      {/* Purpose */}
      <section aria-labelledby="purpose-heading" className="scroll-mt-24">
        <SectionHeading eyebrow={t('common:siteName')} title={t('scholarship.purpose.heading')} />
        <p className="text-ink max-w-3xl leading-relaxed">{t('scholarship.purpose.body')}</p>
      </section>

      {/* Benefits */}
      <section aria-labelledby="benefits-heading" className="mt-16 scroll-mt-24">
        <h2
          id="benefits-heading"
          className="text-navy-950 text-2xl font-bold tracking-tight sm:text-3xl"
        >
          {t('scholarship.benefits.heading')}
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="flex gap-4">
              <span className="bg-gold-100 text-gold-800 mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full">
                <CheckIcon className="size-5" />
              </span>
              <div>
                <h3 className="text-navy-950 font-semibold">{benefit.title}</h3>
                <p className="text-ink-muted mt-1.5 text-sm leading-relaxed">{benefit.body}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Exam structure */}
      <section aria-labelledby="exam-heading" className="mt-16 scroll-mt-24">
        <h2
          id="exam-heading"
          className="text-navy-950 text-2xl font-bold tracking-tight sm:text-3xl"
        >
          {t('scholarship.exam.heading')}
        </h2>
        <p className="text-ink-muted mt-3 max-w-2xl">{t('scholarship.exam.body')}</p>
        <div className="mt-6">
          <ExamStructureTable />
        </div>
      </section>

      {/* Important dates */}
      <section aria-labelledby="dates-heading" className="mt-16 scroll-mt-24">
        <h2
          id="dates-heading"
          className="text-navy-950 text-2xl font-bold tracking-tight sm:text-3xl"
        >
          {t('scholarship.dates.heading')}
        </h2>
        <p className="text-ink-muted mt-3 max-w-2xl">{t('scholarship.dates.body')}</p>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(settings?.importantDates ?? []).map((entry) => (
            <li
              key={entry.key}
              className="border-line bg-surface-raised rounded-xl border px-5 py-4"
            >
              <p className="text-ink-muted text-xs font-semibold tracking-wider uppercase">
                {formatDate(entry.date, lang)}
              </p>
              <p className="text-navy-950 mt-1 font-semibold">{pick(entry.label)}</p>
            </li>
          ))}
          {!settings &&
            [0, 1, 2].map((index) => <Skeleton key={index} className="h-20 w-full rounded-xl" />)}
        </ol>
      </section>

      {/* Application process */}
      <section aria-labelledby="process-heading" className="mt-16 scroll-mt-24">
        <h2
          id="process-heading"
          className="text-navy-950 text-2xl font-bold tracking-tight sm:text-3xl"
        >
          {t('scholarship.process.heading')}
        </h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-2">
              <span className="bg-navy-800 flex size-9 items-center justify-center rounded-full text-sm font-bold text-white">
                {formatNumber(index + 1, lang)}
              </span>
              <h3 className="text-navy-950 mt-1 font-semibold">{step.title}</h3>
              <p className="text-ink-muted text-sm leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Payment + CTA */}
      <section aria-labelledby="payment-heading" className="mt-16 scroll-mt-24">
        <h2
          id="payment-heading"
          className="text-navy-950 text-2xl font-bold tracking-tight sm:text-3xl"
        >
          {t('scholarship.payment.heading')}
        </h2>
        <div className="mt-6 space-y-6">
          <Alert variant="info" title={t('scholarship.payment.body')}>
            {settings ? (
              <p>
                <span className="font-medium">{pick(settings.paymentMethod.name)}</span>
                {' — '}
                {pick(settings.paymentMethod.instructions)}
              </p>
            ) : null}
          </Alert>
          <div className="bg-navy-900 rounded-2xl px-6 py-10 text-center sm:px-10">
            <h3 className="text-gold-300 text-display-lg">{t('scholarship.cta.title')}</h3>
            <p className="text-navy-200 mx-auto mt-3 max-w-xl">{t('scholarship.cta.body')}</p>
            <ButtonLink to="/register" variant="primary" size="lg" className="mt-6">
              {t('common:actions.apply')}
            </ButtonLink>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
