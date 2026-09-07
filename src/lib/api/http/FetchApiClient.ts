import {
  ApiError,
  buildQueryString,
  type ApiClient,
  type ApiRequestOptions,
  type HttpMethod,
} from '../types';
import { getSessionToken } from '../tokenStore';
import type { ApiErrorCode } from '@/types';

interface ErrorPayload {
  code?: ApiErrorCode;
  message?: string;
  details?: Record<string, string[]>;
}

/**
 * Real-HTTP transport with the exact same contract as MockApiClient.
 * Today it is unused (mock mode is the default) — it exists to prove the
 * swap path: set VITE_API_BASE_URL and the app talks to a real backend
 * without touching services or UI (docs/ARCHITECTURE.md §4, §20).
 */
export class FetchApiClient implements ApiClient {
  constructor(private readonly baseUrl: string) {}

  async request<T>(method: HttpMethod, path: string, options: ApiRequestOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${path}${buildQueryString(options.params)}`;
    const token = getSessionToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(url, {
      method,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: options.signal,
    });

    if (!response.ok) {
      let payload: ErrorPayload = {};
      try {
        payload = (await response.json()) as ErrorPayload;
      } catch {
        // Non-JSON error body — fall through with defaults.
      }
      throw new ApiError(
        response.status,
        payload.code ?? 'INTERNAL',
        payload.message ?? `Request failed with status ${response.status}`,
        payload.details,
      );
    }

    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  }
}
