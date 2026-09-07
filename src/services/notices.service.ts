import { api } from '@/lib/api';
import type { Notice, NoticeCategory } from '@/types';

export interface NoticeListParams {
  category?: NoticeCategory;
  limit?: number;
}

/** List notices — pinned first, newest first. */
export async function getNotices(params: NoticeListParams = {}): Promise<Notice[]> {
  const requestParams: Record<string, string | number | boolean | undefined> = {};
  if (params.category) requestParams.category = params.category;
  if (params.limit !== undefined) requestParams.limit = params.limit;
  return api().request<Notice[]>('GET', '/notices', { params: requestParams });
}

/** Fetch a single notice by ID. Throws ApiError 404 when unknown. */
export async function getNotice(id: string): Promise<Notice> {
  return api().request<Notice>('GET', `/notices/${encodeURIComponent(id)}`);
}
