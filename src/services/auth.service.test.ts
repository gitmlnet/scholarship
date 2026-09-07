import { describe, expect, it } from 'vitest';
import { getCurrentUser, login, logout } from './auth.service';
import { getMyApplications } from './applications.service';
import { ApiError } from '@/lib/api/types';
import { SESSION_TOKEN_KEY } from '@/config/storageKeys';
import { getMockDb } from '@/mock-api';

const ADMIN = { email: 'admin@scholarsphere.test', password: 'demo-admin-2026' };
const AYESHA = { email: 'ayesha@scholarsphere.test', password: 'demo-applicant-2026' };
const RAFIQ = { email: 'rafiq@scholarsphere.test', password: 'demo-applicant-2026' };

describe('auth service (demo login via mock API)', () => {
  it('exchanges credentials for a session token and the public user', async () => {
    const result = await login(ADMIN.email, ADMIN.password);
    expect(result.user).toMatchObject({ id: 'u-admin', role: 'admin', email: ADMIN.email });
    expect(result.token).toMatch(/^[0-9a-f]{64}$/);
    expect(window.sessionStorage.getItem(SESSION_TOKEN_KEY)).toBe(result.token);

    const me = await getCurrentUser();
    expect(me).toMatchObject({ id: 'u-admin', role: 'admin' });
  });

  it('never exposes credential material', async () => {
    const result = await login(AYESHA.email, AYESHA.password);
    expect(JSON.stringify(result)).not.toContain('salt');
    expect(JSON.stringify(result)).not.toContain('hash');
    expect(JSON.stringify(getMockDb().users)).toContain('hash'); // stays server-side
  });

  it('audits successful logins', async () => {
    await login(AYESHA.email, AYESHA.password);
    const entry = getMockDb().auditLog.find((e) => e.action === 'auth.login');
    expect(entry).toMatchObject({
      actor: 'user:ayesha@scholarsphere.test',
      recordType: 'user',
      recordId: 'u-ayesha',
      result: 'success',
    });
  });

  it('rejects a wrong password with 401 and audits the failure', async () => {
    const error = await login(AYESHA.email, 'not-the-password').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 401, code: 'UNAUTHORIZED' });
    expect((error as ApiError).message).toBe('Invalid email or password');
    expect(
      getMockDb().auditLog.some(
        (e) => e.action === 'auth.login_failed' && e.result === 'failure',
      ),
    ).toBe(true);
  });

  it('gives the same error for unknown emails (no user enumeration)', async () => {
    const unknown = await login('nobody@scholarsphere.test', 'whatever').catch(
      (e: unknown) => e,
    );
    expect(unknown).toMatchObject({ status: 401, message: 'Invalid email or password' });
  });

  it('rejects malformed bodies with 422', async () => {
    const error = await login('', '').catch((e: unknown) => e);
    expect(error).toMatchObject({ status: 422, code: 'VALIDATION' });
  });

  it('enforces session expiry (expired sessions resolve to 401)', async () => {
    await login(AYESHA.email, AYESHA.password);
    // White-box: age the stored session past its TTL, like time passing would.
    const sessions = JSON.parse(
      window.sessionStorage.getItem('scholarsphere.session.v1.sessions') ?? '[]',
    ) as Array<{ expiresAt: string }>;
    expect(sessions).toHaveLength(1);
    const session = sessions[0];
    if (!session) throw new Error('session missing');
    session.expiresAt = new Date(Date.now() - 1000).toISOString();
    window.sessionStorage.setItem(
      'scholarsphere.session.v1.sessions',
      JSON.stringify(sessions),
    );

    await expect(getCurrentUser()).rejects.toMatchObject({ status: 401 });
    await expect(getMyApplications()).rejects.toMatchObject({ status: 401 });
  });

  it('logs out: token cleared, /auth/me and /me/applications become 401', async () => {
    await login(AYESHA.email, AYESHA.password);
    await logout();

    expect(window.sessionStorage.getItem(SESSION_TOKEN_KEY)).toBeNull();
    await expect(getCurrentUser()).rejects.toMatchObject({ status: 401 });
    await expect(getMyApplications()).rejects.toMatchObject({ status: 401 });
  });

  it('isolates applicants: A sees only her own applications', async () => {
    await login(AYESHA.email, AYESHA.password);
    const ayeshaApps = await getMyApplications();
    expect(ayeshaApps.map((a) => a.id)).toEqual(['SS26-100001']);

    await logout();
    await login(RAFIQ.email, RAFIQ.password);
    const rafiqApps = await getMyApplications();
    expect(rafiqApps.map((a) => a.id)).toEqual(['SS26-100002']);
  });
});
