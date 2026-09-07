import { api } from '@/lib/api';
import type { Syllabus } from '@/types';

/** Full syllabus library (all grades). */
export async function getSyllabus(): Promise<Syllabus[]> {
  return api().request<Syllabus[]>('GET', '/syllabus');
}

/** Syllabus for one grade. Throws ApiError 404/422 for unknown grades. */
export async function getSyllabusForGrade(gradeId: string): Promise<Syllabus> {
  return api().request<Syllabus>('GET', `/syllabus/${encodeURIComponent(gradeId)}`);
}
