import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Field } from '@/components/ui/Field';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { Table, TBody, Td, Th, THead, TRow } from '@/components/ui/Table';
import { TextInput } from '@/components/ui/TextInput';
import { SearchIcon } from '@/components/ui/icons';
import { PageShell } from '@/components/common/PageShell';
import { ErrorState } from '@/components/common/ErrorState';
import { useResultYears, useResults } from '@/hooks/useResults';
import { useGrades } from '@/hooks/useGrades';
import { useLocalized } from '@/hooks/useLocalized';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { formatDate, formatNumber } from '@/utils/format';
import { isNotFoundError } from '@/services/errors';

/** Published merit lists: pick year + grade, optionally search names. */
export default function ResultsPage() {
  const { t } = useTranslation(['pages', 'common']);
  const { lang, pick } = useLocalized();

  useDocumentMeta(t('results.title'), t('results.description'));

  const [year, setYear] = useState<number | null>(null);
  const [gradeId, setGradeId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const yearsQuery = useResultYears();
  const gradesQuery = useGrades();
  const years = yearsQuery.data;

  // Defaults: newest year + its first grade once the index loads.
  const effectiveYear = year ?? years?.[0]?.year ?? null;
  const gradesForYear = years?.find((entry) => entry.year === effectiveYear)?.gradeIds ?? [];
  const effectiveGradeId =
    gradeId && gradesForYear.includes(gradeId as never) ? gradeId : (gradesForYear[0] ?? null);

  const resultsQuery = useResults(
    { year: effectiveYear ?? 0, gradeId: effectiveGradeId ?? '', q: appliedSearch || undefined },
    { enabled: effectiveYear !== null && effectiveGradeId !== null },
  );
  const enabled = effectiveYear !== null && effectiveGradeId !== null;

  const gradeLabel = (id: string) =>
    pick(gradesQuery.data?.find((grade) => grade.id === id)?.label ?? { en: id, bn: id });

  const notFound = useMemo(() => isNotFoundError(resultsQuery.error), [resultsQuery.error]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setAppliedSearch(searchInput.trim());
  };

  const changeYear = (value: string) => {
    setYear(Number(value));
    setGradeId(null); // grade options depend on the year
    setAppliedSearch('');
    setSearchInput('');
  };

  const gradeOptions = gradesForYear.map((id) => (
    <option key={id} value={id}>
      {gradeLabel(id)}
    </option>
  ));

  return (
    <PageShell title={t('results.title')} description={t('results.description')}>
      {/* Selectors */}
      {yearsQuery.isPending ? (
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-16 w-40" />
          <Skeleton className="h-16 w-40" />
        </div>
      ) : (
        <form
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr_auto] lg:items-end"
          onSubmit={submitSearch}
        >
          <Field label={t('results.year')}>
            <Select
              value={effectiveYear ?? undefined}
              onChange={(event) => changeYear(event.target.value)}
            >
              {years?.map((entry) => (
                <option key={entry.year} value={entry.year}>
                  {formatNumber(entry.year, lang)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={t('results.grade')}>
            <Select
              value={effectiveGradeId ?? undefined}
              onChange={(event) => setGradeId(event.target.value)}
              disabled={gradesForYear.length === 0}
            >
              {gradeOptions}
            </Select>
          </Field>
          <Field label={t('results.searchLabel')}>
            <TextInput
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder={t('results.searchPlaceholder')}
              type="search"
            />
          </Field>
          <Button type="submit" variant="secondary" className="lg:mb-[30px]">
            <SearchIcon className="size-4" />
            {t('common:actions.search')}
          </Button>
        </form>
      )}

      {/* Result set */}
      <div className="mt-8">
        {yearsQuery.isError && <ErrorState onRetry={yearsQuery.refetch} />}

        {!enabled && !yearsQuery.isError && !yearsQuery.isPending && (
          <EmptyState title={t('results.notFound')} />
        )}

        {enabled && resultsQuery.isPending && (
          <div className="space-y-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        )}

        {enabled && resultsQuery.isError && !notFound && (
          <ErrorState onRetry={resultsQuery.refetch} />
        )}

        {enabled && notFound && <EmptyState title={t('results.notFound')} />}

        {enabled && resultsQuery.data && (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-ink-muted text-sm">
                {t('results.table.publishedOn')}{' '}
                <time dateTime={resultsQuery.data.publishedAt}>
                  {formatDate(resultsQuery.data.publishedAt, lang)}
                </time>
              </p>
              <p className="text-ink-muted text-xs">{t('results.demoNote')}</p>
            </div>

            {resultsQuery.data.meritList.length === 0 ? (
              <EmptyState title={t('results.emptySearch')} />
            ) : (
              <Table
                caption={`${t('results.title')} — ${gradeLabel(resultsQuery.data.gradeId)} ${formatNumber(resultsQuery.data.year, lang)}`}
              >
                <THead>
                  <Th scope="col">{t('results.table.position')}</Th>
                  <Th scope="col">{t('results.table.student')}</Th>
                  <Th scope="col">{t('results.table.school')}</Th>
                  <Th scope="col">{t('results.table.score')}</Th>
                  <Th scope="col">{t('results.table.award')}</Th>
                </THead>
                <TBody>
                  {resultsQuery.data.meritList.map((entry) => (
                    <TRow key={entry.position}>
                      <Td className="text-navy-900 font-semibold">
                        {formatNumber(entry.position, lang)}
                      </Td>
                      <Td>{entry.studentName}</Td>
                      <Td className="text-ink-muted">{entry.schoolName}</Td>
                      <Td>{formatNumber(entry.score, lang)}</Td>
                      <Td>
                        <Badge variant="gold">{pick(entry.award)}</Badge>
                      </Td>
                    </TRow>
                  ))}
                </TBody>
              </Table>
            )}
          </>
        )}
      </div>

      {appliedSearch && !resultsQuery.isPending && (
        <div className="mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchInput('');
              setAppliedSearch('');
            }}
          >
            {t('common:actions.clear')} “{appliedSearch}”
          </Button>
        </div>
      )}
    </PageShell>
  );
}
