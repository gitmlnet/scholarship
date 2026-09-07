import { useQuery } from '@tanstack/react-query';
import { getGrades } from '@/services/grades.service';

/** Per-grade eligibility & exam structure (rarely changes). */
export function useGrades() {
  return useQuery({ queryKey: ['grades'], queryFn: getGrades, staleTime: 10 * 60_000 });
}
