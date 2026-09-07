import { api } from '@/lib/api';
import type { GradeConfig } from '@/types';

/** Per-grade eligibility & exam structure (sorted by level). */
export async function getGrades(): Promise<GradeConfig[]> {
  return api().request<GradeConfig[]>('GET', '/grades');
}
