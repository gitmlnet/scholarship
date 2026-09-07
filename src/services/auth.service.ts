import { api } from '@/lib/api';
import { clearSessionToken, setSessionToken } from '@/lib/api/tokenStore';
import type { User } from '@/types';

export interface LoginResult {
  token: string;
  user: User;
}

/**
 * Demo authentication (docs/ARCHITECTURE.md §9). The token is kept in
 * sessionStorage and attached to every request by the API client — the UI
 * never handles credentials beyond the login form itself.
 */
export async function login(email: string, password: string): Promise<LoginResult> {
  const result = await api().request<LoginResult>('POST', '/auth/login', {
    body: { email, password },
  });
  setSessionToken(result.token);
  return result;
}

export async function logout(): Promise<void> {
  try {
    await api().request<void>('POST', '/auth/logout');
  } finally {
    clearSessionToken(); // even if the call failed, drop the local token
  }
}

/** The signed-in user, or throws 401 — callers translate that to "signed out". */
export async function getCurrentUser(): Promise<User> {
  const { user } = await api().request<{ user: User }>('GET', '/auth/me');
  return user;
}
