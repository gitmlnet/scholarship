import type { IsoDate, LocalizedText } from './common';

export type NoticeCategory = 'registration' | 'exam' | 'result' | 'general';

/**
 * A program notice/announcement. Content lives in seed data (data layer),
 * never inside UI components.
 */
export interface Notice {
  id: string;
  date: IsoDate;
  category: NoticeCategory;
  pinned: boolean;
  title: LocalizedText;
  summary: LocalizedText;
  details: LocalizedText;
}
