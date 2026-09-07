import { api } from '@/lib/api';
import type { ProgramSettings } from '@/types';

/** Program settings (names, dates, fees, payment method, contact). */
export async function getSettings(): Promise<ProgramSettings> {
  return api().request<ProgramSettings>('GET', '/settings');
}
