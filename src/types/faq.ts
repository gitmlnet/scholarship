import type { LocalizedText } from './common';

export type FaqCategory = 'program' | 'eligibility' | 'payment' | 'tracking' | 'about';

export interface Faq {
  id: string;
  category: FaqCategory;
  question: LocalizedText;
  answer: LocalizedText;
}
