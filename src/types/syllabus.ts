import type { LocalizedText } from './common';
import type { GradeId } from './grades';

export interface SyllabusSubject {
  name: LocalizedText;
  description: LocalizedText;
  topics: LocalizedText[];
}

/** Grade-wise syllabus document used by the syllabus library. */
export interface Syllabus {
  gradeId: GradeId;
  description: LocalizedText;
  subjects: SyllabusSubject[];
}
