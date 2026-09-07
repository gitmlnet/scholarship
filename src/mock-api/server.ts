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
        return route.handler({ params, query, body, authToken });
      } catch (error) {
        if (error instanceof ApiError) throw error;
        // Unexpected handler bugs become 500s, like a real server.
        console.error(`[mock-api] handler error for ${method} ${path}:`, error);
        throw new ApiError(500, 'INTERNAL', 'Unexpected server error');
      }
    }

    throw new ApiError(404, 'NOT_FOUND', `No route for ${method} ${path}`);
  }
}
