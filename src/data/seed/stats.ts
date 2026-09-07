import type { Statistic } from '@/types';

/** Fictional homepage statistics. */
export const seedStats: Statistic[] = [
  {
    id: 'stat-applications',
    value: '12,400+',
    label: { en: 'Applications in 2025', bn: '২০২৫ সালের আবেদন' },
  },
  {
    id: 'stat-scholarships',
    value: '480',
    label: { en: 'Scholarships awarded', bn: 'প্রদত্ত বৃত্তির সংখ্যা' },
  },
  {
    id: 'stat-districts',
    value: '64',
    label: { en: 'Districts reached', bn: 'জেলা জুড়ে বিস্তৃতি' },
  },
  {
    id: 'stat-schools',
    value: '38',
    label: { en: 'Partner schools', bn: 'অংশীদার শিক্ষা প্রতিষ্ঠান' },
  },
];
