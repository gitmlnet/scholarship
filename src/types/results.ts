import type { IsoDate, LocalizedText } from './common';
import type { GradeId } from './grades';

export interface MeritListEntry {
  position: number;
  /** Fictional student name — public merit lists show name + school only. */
  studentName: string;
  schoolName: string;
  score: number;
  award: LocalizedText;
}

/** Published result set for one year + grade. */
export interface ResultYear {
  year: number;
  gradeId: GradeId;
  publishedAt: IsoDate;
  meritList: MeritListEntry[];
}

/** One row of the Results page index: which grades exist per year. */
export interface ResultYearIndexEntry {
  year: number;
  gradeIds: GradeId[];
}
