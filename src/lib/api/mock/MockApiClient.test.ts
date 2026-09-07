import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '../types';
import { MockApiClient } from './MockApiClient';
import { MockServer, type MockRoute } from '@/mock-api/server';

const routes: MockRoute[] = [
  { method: 'GET', pattern: '/ping', handler: () => ({ ok: true }) },
  {
    method: 'GET',
    pattern: '/items/:id',
    handler: ({ params }) => ({ id: params.id }),
  },
  {
    method: 'GET',
    pattern: '/search',
    handler: ({ query }) => Object.fromEntries(query.entries()),
  },
  {
    method: 'POST',
    pattern: '/items',
    handler: ({ body }) => body,
  },
  {
    method: 'GET',
    pattern: '/missing',
    handler: () => {
      throw new ApiError(404, 'NOT_FOUND', 'nope');
    },
  },
  {
    method: 'GET',
    pattern: '/crash',
    handler: () => {
      throw new Error('kaboom');
    },
  },
];

function makeClient(latency: { min: number; max: number } | null = null) {
  return new MockApiClient({ server: new MockServer(routes), latency });
}

describe('MockApiClient', () => {
  it('dispatches simple GET requests', async () => {
    await expect(makeClient().request('GET', '/ping')).resolves.toEqual({ ok: true });
  });

  it('extracts path params', async () => {
    await expect(makeClient().request('GET', '/items/abc-123')).resolves.toEqual({
      id: 'abc-123',
    });
  });

  it('passes query params and skips empty values', async () => {
    const result = await makeClient().request<Record<string, string>>('GET', '/search', {
      params: { category: 'exam', limit: 5, empty: undefined, zero: 0 },
    });
    expect(result).toEqual({ category: 'exam', limit: '5', zero: '0' });
  });

  it('passes the request body through', async () => {
    await expect(
      makeClient().request('POST', '/items', { body: { name: 'ScholarSphere' } }),
    ).resolves.toEqual({ name: 'ScholarSphere' });
  });

  it('deep-clones responses so callers cannot mutate server state', async () => {
    const client = makeClient();
    const first = await client.request<Record<string, unknown>>('GET', '/ping');
    first.ok = 'mutated';
    const second = await client.request<Record<string, unknown>>('GET', '/ping');
    expect(second).toEqual({ ok: true });
  });

  it('propagates ApiErrors thrown by handlers', async () => {
    await expect(makeClient().request('GET', '/missing')).rejects.toMatchObject({
      status: 404,
      code: 'NOT_FOUND',
    });
  });

  it('wraps unexpected handler crashes as 500 INTERNAL', async () => {
    await expect(makeClient().request('GET', '/crash')).rejects.toMatchObject({
      status: 500,
      code: 'INTERNAL',
    });
  });

  it('returns 404 for unknown routes', async () => {
    await expect(makeClient().request('GET', '/definitely-not-a-route')).rejects.toMatchObject({
      status: 404,
    });
  });

  it('returns 404 when the path matches another method', async () => {
    await expect(makeClient().request('GET', '/items')).rejects.toMatchObject({ status: 404 });
  });

  it('simulates latency before resolving', async () => {
    vi.useFakeTimers();
    try {
      const client = makeClient({ min: 100, max: 100 });
      const promise = client.request<{ ok: boolean }>('GET', '/ping');
      let resolved: { ok: boolean } | undefined;
      void promise.then((value) => {
        resolved = value;
      });

      await vi.advanceTimersByTimeAsync(99);
      expect(resolved).toBeUndefined();

      await vi.advanceTimersByTimeAsync(2);
      expect(resolved).toEqual({ ok: true });
    } finally {
      vi.useRealTimers();
    }
  });

  it('aborts during latency with an AbortError', async () => {
    vi.useFakeTimers();
    try {
      const client = makeClient({ min: 100, max: 100 });
      const controller = new AbortController();
      const promise = client.request('GET', '/ping', { signal: controller.signal });
      void promise.catch(() => undefined); // avoid unhandled rejection noise
      controller.abort();
      await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
    } finally {
      vi.useRealTimers();
    }
  });
});
