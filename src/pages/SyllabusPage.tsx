import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { TabPanel, Tabs, type TabItem } from '@/components/ui/Tabs';
import { PageShell } from '@/components/common/PageShell';
import { ErrorState } from '@/components/common/ErrorState';
import { useSyllabus } from '@/hooks/useSyllabus';
import { useGrades } from '@/hooks/useGrades';
import { useLocalized } from '@/hooks/useLocalized';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { formatNumber } from '@/utils/format';
import { DownloadIcon } from '@/components/ui/icons';

/**
 * Grade-wise syllabus library. The active grade is URL-driven
 * (/syllabus/g6) so syllabus links are shareable; the index route
 * (/syllabus) falls back to the first grade.
 */
export default function SyllabusPage() {
  const { t } = useTranslation(['pages', 'common']);
  const { lang, pick } = useLocalized();
  const { gradeId } = useParams<{ gradeId: string }>();
  const navigate = useNavigate();

  const syllabusQuery = useSyllabus();
  const gradesQuery = useGrades();

  useDocumentMeta(t('syllabus.title'), t('syllabus.description'));

  const syllabus = syllabusQuery.data;
  const grades = gradesQuery.data;
  const requested = syllabus?.find((item) => item.gradeId === gradeId);
  const active = requested ?? syllabus?.[0];
  // A grade id in the URL that has no syllabus falls back to the first
  // grade — visibly, so a bad link is never silent.
  const unknownGrade = Boolean(gradeId && syllabus && !requested);
  const activeGradeConfig = grades?.find((grade) => grade.id === active?.gradeId);

  const gradeLabel = (id: string): string =>
    pick(grades?.find((grade) => grade.id === id)?.label ?? { en: id, bn: id });

  const tabItems: TabItem[] =
    syllabus?.map((item) => ({ id: item.gradeId, label: gradeLabel(item.gradeId) })) ?? [];

  if (syllabusQuery.isError) {
    return (
      <PageShell title={t('syllabus.title')} description={t('syllabus.description')}>
        <ErrorState onRetry={syllabusQuery.refetch} />
      </PageShell>
    );
  }

  return (
    <PageShell title={t('syllabus.title')} description={t('syllabus.description')}>
      {/* Grade picker + download controls (hidden when printing) */}
      <div className="print:hidden">
        {syllabusQuery.isPending ? (
          <Skeleton className="h-11 w-full max-w-xl" />
        ) : (
          <div className="space-y-4">
            <p className="text-ink-muted text-sm font-medium">{t('syllabus.gradePicker')}</p>
            <Tabs
              items={tabItems}
              activeId={active?.gradeId ?? ''}
              onChange={(id) => navigate(`/syllabus/${id}`)}
              label={t('syllabus.gradePicker')}
            />
          </div>
        )}
      </div>

      {unknownGrade && (
        <Alert variant="warning" title={t('syllabus.notFound')} className="mt-8 print:hidden" />
      )}

      {syllabusQuery.isPending && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {[0, 1, 2, 3].map((index) => (
            <Skeleton key={index} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      )}

      {active && (
        <TabPanel id={active.gradeId} activeId={active.gradeId} className="mt-8">
          {/* Sheet header (stays visible in print output) */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-gold-700 text-xs font-semibold tracking-widest uppercase">
                {t('common:siteName')} · {t('syllabus.title')}
              </p>
              <h2 className="text-navy-950 mt-2 text-2xl font-bold">
                {gradeLabel(active.gradeId)}
              </h2>
              <p className="text-ink-muted mt-2 max-w-2xl">{pick(active.description)}</p>
            </div>
            <div className="flex flex-col items-end gap-2 print:hidden">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.print()}
                className="whitespace-nowrap"
              >
                <DownloadIcon className="size-4" />
                {t('syllabus.download')}
              </Button>
              <p className="text-ink-muted max-w-56 text-right text-xs">
                {t('syllabus.printHint')}
              </p>
            </div>
          </div>

          {activeGradeConfig && (
            <dl className="border-line text-ink mt-6 grid gap-4 rounded-xl border px-5 py-4 sm:grid-cols-3">
              <div>
                <dt className="text-ink-muted text-xs">{t('common:exam.totalMarks')}</dt>
                <dd className="font-semibold">
                  {formatNumber(activeGradeConfig.totalMarks, lang)}
                </dd>
              </div>
              <div>
                <dt className="text-ink-muted text-xs">{t('common:exam.duration')}</dt>
                <dd className="font-semibold">
                  {t('common:exam.minutes', {
                    count: formatNumber(activeGradeConfig.examDurationMinutes, lang),
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-ink-muted text-xs">{t('common:exam.subjects')}</dt>
                <dd className="font-semibold">
                  {formatNumber(activeGradeConfig.subjects.length, lang)}
                </dd>
              </div>
            </dl>
          )}

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {active.subjects.map((subject) => (
              <Card key={subject.name.en} padding="sm">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-navy-950 font-semibold">{pick(subject.name)}</h3>
                  {activeGradeConfig && (
                    <Badge variant="navy">
                      {formatNumber(
                        activeGradeConfig.subjects.find(
                          (entry) => entry.name.en === subject.name.en,
                        )?.marks ?? 0,
                        lang,
                      )}
                    </Badge>
                  )}
                </div>
                <p className="text-ink-muted mt-1 text-sm">{pick(subject.description)}</p>
                <p className="text-navy-900 mt-4 text-xs font-semibold tracking-wider uppercase">
                  {t('syllabus.topics')}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {subject.topics.map((topic) => (
                    <li key={topic.en} className="text-ink flex gap-2 text-sm">
                      <span aria-hidden="true" className="text-gold-600">
                        ▸
                      </span>
                      {pick(topic)}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </TabPanel>
      )}
    </PageShell>
  );
}
