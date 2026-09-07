import { api } from '@/lib/api';
import type { ApplicationInput } from '@/types/applicationSchema';

/**
 * Submit a completed application (registration wizard, final step).
 * Returns the generated application ID. The API layer owns ID generation,
 * fee derivation, and duplicate-payment rejection — never the client.
 */
export async function submitApplication(input: ApplicationInput): Promise<{ id: string }> {
  return api().request<{ id: string }>('POST', '/applications', { body: input });
}
