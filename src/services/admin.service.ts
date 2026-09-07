import { api } from '@/lib/api';
import type {
  Application,
  ApplicationStatus,
  AuditEntry,
  Paginated,
} from '@/types';

export type AdminSortOption = 'newest' | 'oldest' | 'status';

export interface AdminApplicationsQuery {
  status?: ApplicationStatus;
  grade?: string;
  q?: string;
  sort?: AdminSortOption;
  page?: number;
}

export interface AuditLogQuery {
  recordId?: string;
  page?: number;
}

/**
 * Admin-facing API calls. The mock backend enforces the admin role on every
 * endpoint (401/403) — the UI merely calls these; it never gates data by
 * hiding things (docs/ARCHITECTURE.md §9).
 */

export function listApplications(
  query: AdminApplicationsQuery = {},
): Promise<Paginated<Application>> {
  return api().request<Paginated<Application>>('GET', '/admin/applications', {
    params: {
      status: query.status,
      grade: query.grade,
      q: query.q,
      sort: query.sort,
      page: query.page,
    },
  });
}

export function getApplication(id: string): Promise<Application> {
  return api().request<Application>('GET', `/admin/applications/${encodeURIComponent(id)}`);
}

export function updateApplicationStatus(
  id: string,
  payload: { status: ApplicationStatus; note?: string },
): Promise<Application> {
  return api().request<Application>(
    'PATCH',
    `/admin/applications/${encodeURIComponent(id)}/status`,
    { body: payload },
  );
}

export function requestCorrection(id: string, note: string): Promise<Application> {
  return api().request<Application>(
    'POST',
    `/admin/applications/${encodeURIComponent(id)}/correction`,
    { body: { note } },
  );
}

export function getAuditLog(query: AuditLogQuery = {}): Promise<Paginated<AuditEntry>> {
  return api().request<Paginated<AuditEntry>>('GET', '/admin/audit', {
    params: { recordId: query.recordId, page: query.page },
  });
}
