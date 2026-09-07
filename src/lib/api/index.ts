import { appEnv } from '@/config/env';
import { MockApiClient } from './mock/MockApiClient';
import { FetchApiClient } from './http/FetchApiClient';
import { getMockServer } from '@/mock-api';
import type { ApiClient } from './types';

export { ApiError, buildQueryString } from './types';
export type { ApiClient, ApiRequestOptions, HttpMethod } from './types';

const DEFAULT_MOCK_LATENCY = { min: 150, max: 450 } as const;

function createApiClient(): ApiClient {
  if (appEnv.apiBaseUrl) {
    return new FetchApiClient(appEnv.apiBaseUrl);
  }
  return new MockApiClient({
    server: getMockServer(),
    latency: appEnv.mockLatencyEnabled ? { ...DEFAULT_MOCK_LATENCY } : null,
  });
}

let client: ApiClient | null = null;

/**
 * The app-wide API client. Services (and only services) call this.
 * Mock by default; a real backend takes over when VITE_API_BASE_URL is set.
 */
export function api(): ApiClient {
  if (!client) client = createApiClient();
  return client;
}
