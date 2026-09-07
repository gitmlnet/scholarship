import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../types';
import { FetchApiClient } from './FetchApiClient';

function mockFetch(status: number, body: unknown) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('FetchApiClient', () => {
  it('requests the base URL + path with query params', async () => {
    const fetchMock = mockFetch(200, { items: [1, 2] });
    const client = new FetchApiClient('https://api.scholarsphere.test');

    const result = await client.request<{ items: number[] }>('GET', '/items', {
      params: { limit: 2, skip: undefined },
    });

    expect(result).toEqual({ items: [1, 2] });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.scholarsphere.test/items?limit=2',
      expect.objectContaining({ method: 'GET', signal: undefined }),
    );
  });

  it('serializes the body as JSON for POST', async () => {
    const fetchMock = mockFetch(201, { id: 'SS26-000001' });
    const client = new FetchApiClient('https://api.scholarsphere.test');

    await client.request('POST', '/applications', { body: { grade: 'g6' } });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.scholarsphere.test/applications',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ grade: 'g6' }),
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });

  it('maps error responses to ApiError with code and details', async () => {
    mockFetch(409, {
      code: 'CONFLICT',
      message: 'Transaction ID already used',
      details: { transactionId: ['already used in this cycle'] },
    });
    const client = new FetchApiClient('https://api.scholarsphere.test');

    const error = await client
      .request('POST', '/applications', { body: {} })
      .catch((err: unknown) => err);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 409,
      code: 'CONFLICT',
      message: 'Transaction ID already used',
      details: { transactionId: ['already used in this cycle'] },
    });
  });

  it('falls back to INTERNAL when the error body is not JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => {
        throw new Error('not JSON');
      },
    });
    vi.stubGlobal('fetch', fetchMock);
    const client = new FetchApiClient('https://api.scholarsphere.test');

    await expect(client.request('GET', '/settings')).rejects.toMatchObject({
      status: 502,
      code: 'INTERNAL',
    });
  });
});
