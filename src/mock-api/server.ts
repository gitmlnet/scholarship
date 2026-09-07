import { ApiError, type HttpMethod } from '@/lib/api/types';

/** Context handed to a mock route handler. */
export interface MockRequestContext {
  params: Record<string, string>;
  query: URLSearchParams;
  body: unknown;
  /** Auth token, once demo auth exists (Phase 5). */
  authToken: string | null;
}

export type MockHandler = (ctx: MockRequestContext) => unknown;

export interface MockRoute {
  method: HttpMethod;
  /** Path pattern with :params, e.g. "/notices/:id". */
  pattern: string;
  handler: MockHandler;
}

const patternCache = new Map<string, RegExp>();

function patternToRegex(pattern: string): RegExp {
  let regex = patternCache.get(pattern);
  if (!regex) {
    const source = pattern
      .split('/')
      .map((segment) =>
        segment.startsWith(':') ? `([^/]+)` : segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      )
      .join('/');
    regex = new RegExp(`^${source}$`);
    patternCache.set(pattern, regex);
  }
  return regex;
}

/**
 * The simulated server core: a route table + request dispatcher, independent
 * of latency simulation and persistence. Handlers return plain data or throw
 * ApiError — exactly like real server controllers.
 */
export class MockServer {
  constructor(private readonly routes: readonly MockRoute[]) {}

  handle(
    method: HttpMethod,
    path: string,
    query: URLSearchParams,
    body: unknown,
    authToken: string | null,
  ): unknown {
    for (const route of this.routes) {
      if (route.method !== method) continue;
      const match = path.match(patternToRegex(route.pattern));
      if (!match) continue;

      const params: Record<string, string> = {};
      const keys = route.pattern.match(/:([A-Za-z0-9_]+)/g) ?? [];
      keys.forEach((key, index) => {
        params[key.slice(1)] = decodeURIComponent(match[index + 1] ?? '');
      });

      try {
        const result = route.handler({ params, query, body, authToken });
        // Async handlers (e.g. credential hashing) resolve here; their
        // rejections get the same ApiError shaping as sync throws.
        if (result instanceof Promise) {
          return result.catch((error: unknown) => {
            throw toApiError(method, path, error);
          });
        }
        return result;
      } catch (error) {
        throw toApiError(method, path, error);
      }
    }

    throw new ApiError(404, 'NOT_FOUND', `No route for ${method} ${path}`);
  }
}

/** Unexpected handler bugs become 500s, like a real server. */
function toApiError(method: HttpMethod, path: string, error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  console.error(`[mock-api] handler error for ${method} ${path}:`, error);
  return new ApiError(500, 'INTERNAL', 'Unexpected server error');
}
