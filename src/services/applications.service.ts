import { api } from '@/lib/api';
import type { Application, ApplicationStatusView } from '@/types';
import type { ApplicationInput } from '@/types/applicationSchema';

/**
 * Submit a completed application (registration wizard, final step).
 * Returns the generated application ID. The API layer owns ID generation,
 * fee derivation, and duplicate-payment rejection — never the client.
 */
export async function submitApplication(input: ApplicationInput): Promise<{ id: string }> {
  return api().request<{ id: string }>('POST', '/applications', { body: input });
}

/**
 * Public-safe tracking payload for an application ID — status, payment
 * status, and timestamps ONLY (anti-enumeration: no personal data).
 */
export function getApplicationStatus(id: string): Promise<ApplicationStatusView> {
  return api().request<ApplicationStatusView>(
    'GET',
    `/applications/${encodeURIComponent(id)}/status`,
  );
}

/** The signed-in applicant's own applications, newest first (401 otherwise). */
export function getMyApplications(): Promise<Application[]> {
  return api().request<Application[]>('GET', '/me/applications');
}
