import type { LocalizedText } from './common';

/** Grade identifiers for the program's supported classes (4–10). */
export type GradeId = 'g4' | 'g5' | 'g6' | 'g7' | 'g8' | 'g9' | 'g10';

export interface GradeSubject {
  name: LocalizedText;
  marks: number;
}

/** Per-grade configurable eligibility & exam structure (brief §15). */
export interface GradeConfig {
  id: GradeId;
  /** Numeric grade level, e.g. 6 for Grade 6. */
  level: 4 | 5 | 6 | 7 | 8 | 9 | 10;
  label: LocalizedText;
  eligibility: LocalizedText;
  subjects: GradeSubject[];
  examDurationMinutes: number;
  totalMarks: number;
  instructions: LocalizedText[];
}
