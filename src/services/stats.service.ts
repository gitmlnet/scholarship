import { api } from '@/lib/api';
import type { Statistic } from '@/types';

/** Homepage statistics (fictional). */
export async function getStats(): Promise<Statistic[]> {
  return api().request<Statistic[]>('GET', '/stats');
}
