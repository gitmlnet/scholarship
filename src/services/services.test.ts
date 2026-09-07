import { describe, expect, it } from 'vitest';
import { getNotice, getNotices } from './notices.service';
import { getSettings } from './settings.service';
import { getStats } from './stats.service';
import { ApiError } from '@/lib/api/types';

describe('notices service (via mock API)', () => {
  it('lists notices pinned-first, newest-first', async () => {
    const notices = await getNotices();
    expect(notices.length).toBeGreaterThanOrEqual(6);
    expect(notices[0]?.id).toBe('n2026-001'); // pinned registration notice
    expect(notices[1]?.id).toBe('n2026-002');
  });

  it('filters by category', async () => {
    const notices = await getNotices({ category: 'exam' });
    expect(notices.length).toBe(1);
    expect(notices[0]?.category).toBe('exam');
  });

  it('rejects unknown categories with a validation error', async () => {
    // @ts-expect-error — intentionally invalid category for the API contract test
    await expect(getNotices({ category: 'sports' })).rejects.toMatchObject({
      status: 422,
      code: 'VALIDATION',
    });
  });

  it('applies the limit parameter', async () => {
    const notices = await getNotices({ limit: 3 });
    expect(notices).toHaveLength(3);
  });

  it('fetches a single notice', async () => {
    const notice = await getNotice('n2026-003');
    expect(notice.id).toBe('n2026-003');
    expect(notice.category).toBe('exam');
  });

  it('throws ApiError 404 for unknown notice ids', async () => {
    const error = await getNotice('n9999-999').catch((err: unknown) => err);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 404, code: 'NOT_FOUND' });
  });
});

describe('settings service (via mock API)', () => {
  it('returns program settings with a valid ID prefix', async () => {
    const settings = await getSettings();
    expect(settings.cycle).toBe(2026);
    expect(settings.shortCode).toMatch(/^SS\d{2}$/);
    expect(settings.announcement.en.length).toBeGreaterThan(0);
    expect(settings.announcement.bn.length).toBeGreaterThan(0);
  });
});

describe('stats service (via mock API)', () => {
  it('returns the fictional statistics', async () => {
    const stats = await getStats();
    expect(stats.length).toBeGreaterThan(0);
    for (const stat of stats) {
      expect(stat.value.length).toBeGreaterThan(0);
      expect(stat.label.en.length).toBeGreaterThan(0);
      expect(stat.label.bn.length).toBeGreaterThan(0);
    }
  });
});
