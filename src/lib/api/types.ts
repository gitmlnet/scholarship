import type { ApiErrorCode } from '@/types';

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface ApiRequestOptions {
  /** Query-string parameters. undefined/null/'' values are skipped. */
  params?: Record<string, string | number | boolean | undefined | null>;
  /** JSON request body (serialized automatically). */
  body?: unknown;
  /** Aborts the request (same semantics as fetch). */
  signal?: AbortSignal;
}

/**
 * Transport-agnostic API client contract. MockApiClient (in-browser) and
 * FetchApiClient (real HTTP) both implement it — this interface is the
 * future-real-backend swap point. See docs/ARCHITECTURE.md §4.
 */
export interface ApiClient {
  request<T>(method: HttpMethod, path: string, options?: ApiRequestOptions): Promise<T>;
}

/** Typed API error — mirrors what a real backend would return. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;
  /** Field-level validation errors, e.g. { transactionId: ['already used'] }. */
  readonly details?: Record<string, string[]>;

  constructor(
    status: number,
    code: ApiErrorCode,
    message: string,
    details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/** Build a query string ('' when nothing remains). */
export function buildQueryString(params: ApiRequestOptions['params']): string {
  if (!params) return '';
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}
