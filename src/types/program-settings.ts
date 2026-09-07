import type { IsoDate, LocalizedText } from './common';

export interface ImportantDate {
  key: string;
  label: LocalizedText;
  date: IsoDate;
}

export interface FeeByGrade {
  gradeId: string;
  amount: number;
}

/**
 * Demo mobile-financial-service configuration. Intentionally fictional:
 * no real wallet, no real-format account numbers.
 */
export interface PaymentMethodConfig {
  name: LocalizedText;
  merchantAccount: string;
  instructions: LocalizedText;
}

export interface ContactConfig {
  email: string;
  address: LocalizedText;
}

/**
 * Central program configuration — the single source of truth for values the
 * brief requires to be "configurable": names, dates, fees, payment, contact.
 * Served by the API layer (mock now, real backend later); admin-editable later.
 */
export interface ProgramSettings {
  programName: LocalizedText;
  cycle: number;
  /** Short code used in application IDs, e.g. "SS26" → SS26-847291 */
  shortCode: string;
  tagline: LocalizedText;
  announcement: LocalizedText;
  importantDates: ImportantDate[];
  applicationFee: {
    currency: string;
    symbol: string;
    byGrade: FeeByGrade[];
  };
  paymentMethod: PaymentMethodConfig;
  contact: ContactConfig;
}
