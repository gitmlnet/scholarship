import { useQuery } from '@tanstack/react-query';
import { getResultYears, getResults, type ResultListParams } from '@/services/results.service';

/** Published year → grades index (newest first). */
export function useResultYears() {
  return useQuery({ queryKey: ['result-years'], queryFn: getResultYears, staleTime: 10 * 60_000 });
}

/**
 * One published merit list (year + grade, optional search). Pass
 * `enabled: false` until the year/grade selectors have real values —
 * a 404 (unpublished combination) is a normal state, not a failure to mask.
 */
export function useResults(params: ResultListParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['results', params.year, params.gradeId, params.q ?? ''],
    queryFn: () => getResults(params),
    staleTime: 10 * 60_000,
    retry: false,
    enabled: options?.enabled ?? true,
  });
}
