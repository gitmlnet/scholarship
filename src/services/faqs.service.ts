import { api } from '@/lib/api';
import type { Faq } from '@/types';

/** All FAQs (ordered by category in the seed). */
export async function getFaqs(): Promise<Faq[]> {
  return api().request<Faq[]>('GET', '/faqs');
}
