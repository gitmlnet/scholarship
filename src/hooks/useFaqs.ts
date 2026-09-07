import { useQuery } from '@tanstack/react-query';
import { getFaqs } from '@/services/faqs.service';

/** All FAQs (filtered by category on the page). */
export function useFaqs() {
  return useQuery({ queryKey: ['faqs'], queryFn: getFaqs, staleTime: 10 * 60_000 });
}
