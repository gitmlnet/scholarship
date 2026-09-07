import { ApiError } from '@/lib/api/types';

/**
 * Error helpers the UI is allowed to use. UI components never import the API
 * layer directly — these wrappers keep the boundary intact while letting
 * pages react to specific failure modes (404 vs. transient errors).
 */

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isNotFoundError(error: unknown): boolean {
  return isApiError(error) && error.status === 404;
}
