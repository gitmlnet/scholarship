import { useQuery } from '@tanstack/react-query';
import { getSyllabus } from '@/services/syllabus.service';

/** Full syllabus library. Pages select the grade locally (URL-driven). */
export function useSyllabus() {
  return useQuery({ queryKey: ['syllabus'], queryFn: getSyllabus, staleTime: 10 * 60_000 });
}
