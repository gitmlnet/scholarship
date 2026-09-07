import type { LocalizedText } from './common';

/** A homepage statistic. Values are fictional; some may become API-derived. */
export interface Statistic {
  id: string;
  value: string;
  label: LocalizedText;
}
