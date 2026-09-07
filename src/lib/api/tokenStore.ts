import { SESSION_TOKEN_KEY } from '@/config/storageKeys';

/**
 * Client-side session token storage (sessionStorage — dies with the tab).
 * The auth service writes the token after login; the API clients attach it
 * to every request. This mirrors a real SPA's bearer-token handling.
 */

export function getSessionToken(): string | null {
  try {
    return window.sessionStorage.getItem(SESSION_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setSessionToken(token: string): void {
  try {
    window.sessionStorage.setItem(SESSION_TOKEN_KEY, token);
  } catch {
    // Storage unavailable — the session just won't survive a reload.
  }
}

export function clearSessionToken(): void {
  try {
    window.sessionStorage.removeItem(SESSION_TOKEN_KEY);
  } catch {
    // ignore
  }
}
