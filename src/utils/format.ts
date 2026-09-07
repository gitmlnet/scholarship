import type { Language } from '@/i18n';

/**
 * Format an ISO date (YYYY-MM-DD) for display in the active language.
 * The appended T00:00:00 keeps the date in local time (a bare YYYY-MM-DD
 * is parsed as UTC midnight and can shift a day in eastern timezones).
 */
export function formatDate(isoDate: string, lang: Language): string {
  const value = isoDate.includes('T') ? isoDate : `${isoDate}T00:00:00`;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return isoDate;
  const locale = lang === 'bn' ? 'bn-BD' : 'en-GB';
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/** Localized number (Bengali numerals in bn). */
export function formatNumber(value: number, lang: Language): string {
  return new Intl.NumberFormat(lang === 'bn' ? 'bn-BD' : 'en').format(value);
}

/** Format an ISO date-time for display in the active language. */
export function formatDateTime(isoDateTime: string, lang: Language): string {
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return isoDateTime;
  const locale = lang === 'bn' ? 'bn-BD' : 'en-GB';
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}
