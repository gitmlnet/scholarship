import { describe, expect, it } from 'vitest';
import { clearUserTables, loadUserTable, saveUserTable } from './persistence';

function isIdRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && 'id' in value;
}

describe('user-table persistence', () => {
  it('round-trips saved rows', () => {
    saveUserTable('applications', [{ id: 'SS26-000001' }, { id: 'SS26-000002' }]);
    const loaded = loadUserTable('applications', isIdRecord);
    expect(loaded).toEqual([{ id: 'SS26-000001' }, { id: 'SS26-000002' }]);
  });

  it('returns null when nothing is stored', () => {
    expect(loadUserTable('auditLog', isIdRecord)).toBeNull();
  });

  it('discards items that fail the shape guard', () => {
    saveUserTable('applications', [{ id: 'SS26-000001' }, { nope: true }, 'garbage']);
    const loaded = loadUserTable('applications', isIdRecord);
    expect(loaded).toEqual([{ id: 'SS26-000001' }]);
  });

  it('returns null for corrupt JSON', () => {
    window.localStorage.setItem('scholarsphere.db.v1.applications', '{not json');
    expect(loadUserTable('applications', isIdRecord)).toBeNull();
  });

  it('returns null for non-array JSON', () => {
    window.localStorage.setItem('scholarsphere.db.v1.applications', '{"a":1}');
    expect(loadUserTable('applications', isIdRecord)).toBeNull();
  });

  it('clears all program tables but leaves unrelated keys alone', () => {
    saveUserTable('applications', [{ id: 'SS26-000001' }]);
    saveUserTable('auditLog', [{ id: 'a1' }]);
    window.localStorage.setItem('scholarsphere.lang', 'bn');

    clearUserTables();

    expect(loadUserTable('applications', isIdRecord)).toBeNull();
    expect(loadUserTable('auditLog', isIdRecord)).toBeNull();
    expect(window.localStorage.getItem('scholarsphere.lang')).toBe('bn');
  });
});
