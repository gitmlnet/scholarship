import { ApiError } from '@/lib/api/types';

/**
 * Default TanStack Query retry policy (API behavior knowledge lives with the
 * services layer, not in UI code): never retry client errors (4xx) — they
 * will fail the same way again; retry transient/server errors twice.
 */
export function defaultQueryRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
    return false;
  }
  return failureCount < 2;
}
