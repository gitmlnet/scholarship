import { api } from '@/lib/api';
import type { ResultYear, ResultYearIndexEntry } from '@/types';

export interface ResultListParams {
  year: number;
  gradeId: string;
  /** Optional merit-list search (student or school name). */
  q?: string;
}

/** Which grades have published results, per year (newest year first). */
export async function getResultYears(): Promise<ResultYearIndexEntry[]> {
  return api().request<ResultYearIndexEntry[]>('GET', '/results/years');
}

/**
 * One published merit list. Throws ApiError 404 when the year/grade
 * combination has no published results.
 */
export async function getResults({ year, gradeId, q }: ResultListParams): Promise<ResultYear> {
  return api().request<ResultYear>('GET', '/results', {
    params: { year, grade: gradeId, q },
  });
}
