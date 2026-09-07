/** Text content available in both supported languages. */
export interface LocalizedText {
  en: string;
  bn: string;
}

/** ISO 8601 calendar date: YYYY-MM-DD */
export type IsoDate = string;

/** ISO 8601 date-time string */
export type IsoDateTime = string;

/** Machine-readable error codes used across the API boundary. */
export type ApiErrorCode =
  'NOT_FOUND' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'CONFLICT' | 'VALIDATION' | 'INTERNAL';

/** Standard paginated list envelope (admin lists, audit log). */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageCount: number;
}
