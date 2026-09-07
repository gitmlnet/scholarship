import { type ApiClient, type ApiRequestOptions, type HttpMethod } from '../types';
import { MockServer } from '@/mock-api/server';

export interface MockApiClientOptions {
  server: MockServer;
  /** Simulated network latency. `null` disables it (tests). */
  latency?: { min: number; max: number } | null;
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

/** Deep-clone responses so UI code can never mutate "server" state. */
function clone<T>(value: T): T {
  if (value === undefined) return value;
  return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * In-browser transport for the mock API: dispatches HTTP-shaped requests to
 * a MockServer with simulated latency and realistic failure modes.
 * The UI never imports this — services consume it via the ApiClient contract.
 */
export class MockApiClient implements ApiClient {
  constructor(private readonly options: MockApiClientOptions) {}

  async request<T>(method: HttpMethod, path: string, options: ApiRequestOptions = {}): Promise<T> {
    const { latency } = this.options;

    if (latency) {
      const { min, max } = latency;
      const delay = min + Math.floor(Math.random() * (max - min + 1));
      await sleep(delay, options.signal);
    }

    if (options.signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(options.params ?? {})) {
      if (value === undefined || value === null || value === '') continue;
      query.set(key, String(value));
    }

    const result = this.options.server.handle(method, path, query, options.body, null);
    return clone(result) as T;
  }
}
