import { describe, expect, it } from 'vitest';
import i18next, { resources } from '@/i18n';

type UnknownRecord = Record<string, unknown>;

const catalogs = resources as unknown as Record<'en' | 'bn', UnknownRecord>;

function flattenKeys(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return [prefix.slice(0, -1)];
  return Object.entries(value as UnknownRecord).flatMap(([key, child]) =>
    flattenKeys(child, `${prefix}${key}.`),
  );
}

/** Resolve a flattened key ("actions.apply") inside a namespace catalog. */
function resolveValue(namespace: unknown, flatKey: string): unknown {
  let current: unknown = namespace;
  for (const part of flatKey.split('.')) {
    if (typeof current !== 'object' || current === null) return undefined;
    current = (current as UnknownRecord)[part];
  }
  return current;
}

describe('translation catalogs', () => {
  it('exposes the same namespaces in both languages', () => {
    expect(Object.keys(catalogs.bn).sort()).toEqual(Object.keys(catalogs.en).sort());
  });

  it('keeps en and bn keys in exact parity (no missing translations)', () => {
    for (const namespace of Object.keys(catalogs.en)) {
      const enKeys = flattenKeys(catalogs.en[namespace]).sort();
      const bnKeys = flattenKeys(catalogs.bn[namespace]).sort();
      expect(bnKeys, `namespace "${namespace}"`).toEqual(enKeys);
    }
  });

  it('has no empty translation values', () => {
    for (const language of ['en', 'bn'] as const) {
      for (const namespace of Object.keys(catalogs[language])) {
        for (const key of flattenKeys(catalogs[language][namespace])) {
          const value = resolveValue(catalogs[language][namespace], key);
          expect(String(value).length, `${language}:${namespace}:${key}`).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe('language switching', () => {
  it('updates <html lang> and persists the preference', async () => {
    await i18next.changeLanguage('bn');
    expect(document.documentElement.lang).toBe('bn');
    expect(window.localStorage.getItem('scholarsphere.lang')).toBe('bn');

    await i18next.changeLanguage('en');
    expect(document.documentElement.lang).toBe('en');
    expect(window.localStorage.getItem('scholarsphere.lang')).toBe('en');
  });
});
