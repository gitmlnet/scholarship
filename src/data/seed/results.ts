import type { ResultYear, ResultYearIndexEntry } from '@/types';

/**
 * Published (fictional) merit lists. Names and schools are invented for the
 * demo; awards are bilingual so both UI languages render them naturally.
 */
export const seedResults: ResultYear[] = [
  {
    year: 2025,
    gradeId: 'g5',
    publishedAt: '2025-01-30',
    meritList: [
      {
        position: 1,
        studentName: 'Ayesha Siddiqua',
        schoolName: 'Future Scholars Academy',
        score: 292,
        award: { en: 'Gold Award — ৳15,000', bn: 'গোল্ড অ্যাওয়ার্ড — ৳১৫,০০০' },
      },
      {
        position: 2,
        studentName: 'Rafiul Hasan',
        schoolName: 'Dhanmondi Ideal High School',
        score: 287,
        award: { en: 'Silver Award — ৳10,000', bn: 'সিলভার অ্যাওয়ার্ড — ৳১০,০০০' },
      },
      {
        position: 3,
        studentName: 'Nusrat Jahan',
        schoolName: 'Mirpur Public School',
        score: 281,
        award: { en: 'Bronze Award — ৳7,500', bn: 'ব্রোঞ্জ অ্যাওয়ার্ড — ৳৭,৫০০' },
      },
      {
        position: 4,
        studentName: 'Tanvir Ahmed',
        schoolName: 'Uttara Model School',
        score: 275,
        award: { en: 'Merit Award — ৳5,000', bn: 'মেধা পুরস্কার — ৳৫,০০০' },
      },
      {
        position: 5,
        studentName: 'Mitali Das',
        schoolName: 'Chattogram Bright Sun School',
        score: 269,
        award: { en: 'Merit Award — ৳5,000', bn: 'মেধা পুরস্কার — ৳৫,০০০' },
      },
    ],
  },
  {
    year: 2025,
    gradeId: 'g8',
    publishedAt: '2025-01-30',
    meritList: [
      {
        position: 1,
        studentName: 'Mehrab Hossain',
        schoolName: 'Rajshahi Mission School',
        score: 341,
        award: { en: 'Gold Award — ৳15,000', bn: 'গোল্ড অ্যাওয়ার্ড — ৳১৫,০০০' },
      },
      {
        position: 2,
        studentName: 'Sadia Islam',
        schoolName: 'Sylhet Grammar School',
        score: 336,
        award: { en: 'Silver Award — ৳10,000', bn: 'সিলভার অ্যাওয়ার্ড — ৳১০,০০০' },
      },
      {
        position: 3,
        studentName: 'Arif Chowdhury',
        schoolName: 'Khulna Zamindar Academy',
        score: 329,
        award: { en: 'Bronze Award — ৳7,500', bn: 'ব্রোঞ্জ অ্যাওয়ার্ড — ৳৭,৫০০' },
      },
      {
        position: 4,
        studentName: 'Farzana Akter',
        schoolName: 'Future Scholars Academy',
        score: 325,
        award: { en: 'Merit Award — ৳5,000', bn: 'মেধা পুরস্কার — ৳৫,০০০' },
      },
      {
        position: 5,
        studentName: 'Imran Kabir',
        schoolName: 'Bogura Cantonment School',
        score: 318,
        award: { en: 'Merit Award — ৳5,000', bn: 'মেধা পুরস্কার — ৳৫,০০০' },
      },
    ],
  },
  {
    year: 2025,
    gradeId: 'g10',
    publishedAt: '2025-01-30',
    meritList: [
      {
        position: 1,
        studentName: 'Tahmina Begum',
        schoolName: 'Dhanmondi Ideal High School',
        score: 388,
        award: { en: 'Gold Award — ৳20,000', bn: 'গোল্ড অ্যাওয়ার্ড — ৳২০,০০০' },
      },
      {
        position: 2,
        studentName: 'Shakib Rahman',
        schoolName: 'Uttara Model School',
        score: 381,
        award: { en: 'Silver Award — ৳12,500', bn: 'সিলভার অ্যাওয়ার্ড — ৳১২,৫০০' },
      },
      {
        position: 3,
        studentName: 'Lamia Chowdhury',
        schoolName: 'Chattogram Bright Sun School',
        score: 374,
        award: { en: 'Bronze Award — ৳10,000', bn: 'ব্রোঞ্জ অ্যাওয়ার্ড — ৳১০,০০০' },
      },
      {
        position: 4,
        studentName: 'Zahid Hasan',
        schoolName: 'Rangpur Pioneer School',
        score: 366,
        award: { en: 'Merit Award — ৳7,500', bn: 'মেধা পুরস্কার — ৳৭,৫০০' },
      },
      {
        position: 5,
        studentName: 'Sumaiya Khatun',
        schoolName: 'Comilla Victoria School',
        score: 359,
        award: { en: 'Merit Award — ৳7,500', bn: 'মেধা পুরস্কার — ৳৭,৫০০' },
      },
    ],
  },
  {
    year: 2024,
    gradeId: 'g6',
    publishedAt: '2024-01-28',
    meritList: [
      {
        position: 1,
        studentName: 'Nafis Iqbal',
        schoolName: 'Future Scholars Academy',
        score: 338,
        award: { en: 'Gold Award — ৳15,000', bn: 'গোল্ড অ্যাওয়ার্ড — ৳১৫,০০০' },
      },
      {
        position: 2,
        studentName: 'Rituparna Saha',
        schoolName: 'Barishal Sacred Heart School',
        score: 331,
        award: { en: 'Silver Award — ৳10,000', bn: 'সিলভার অ্যাওয়ার্ড — ৳১০,০০০' },
      },
      {
        position: 3,
        studentName: 'Ashiq Mahmud',
        schoolName: 'Mirpur Public School',
        score: 324,
        award: { en: 'Bronze Award — ৳7,500', bn: 'ব্রোঞ্জ অ্যাওয়ার্ড — ৳৭,৫০০' },
      },
      {
        position: 4,
        studentName: 'Priyanka Roy',
        schoolName: 'Sylhet Grammar School',
        score: 317,
        award: { en: 'Merit Award — ৳5,000', bn: 'মেধা পুরস্কার — ৳৫,০০০' },
      },
      {
        position: 5,
        studentName: 'Rakin Shahriar',
        schoolName: 'Khulna Zamindar Academy',
        score: 309,
        award: { en: 'Merit Award — ৳5,000', bn: 'মেধা পুরস্কার — ৳৫,০০০' },
      },
    ],
  },
  {
    year: 2024,
    gradeId: 'g9',
    publishedAt: '2024-01-28',
    meritList: [
      {
        position: 1,
        studentName: 'Anika Tabassum',
        schoolName: 'Dhanmondi Ideal High School',
        score: 391,
        award: { en: 'Gold Award — ৳20,000', bn: 'গোল্ড অ্যাওয়ার্ড — ৳২০,০০০' },
      },
      {
        position: 2,
        studentName: 'Sajid Anwar',
        schoolName: 'Bogura Cantonment School',
        score: 385,
        award: { en: 'Silver Award — ৳12,500', bn: 'সিলভার অ্যাওয়ার্ড — ৳১২,৫০০' },
      },
      {
        position: 3,
        studentName: 'Ishrat Jahan',
        schoolName: 'Rajshahi Mission School',
        score: 377,
        award: { en: 'Bronze Award — ৳10,000', bn: 'ব্রোঞ্জ অ্যাওয়ার্ড — ৳১০,০০০' },
      },
      {
        position: 4,
        studentName: 'Fahim Faisal',
        schoolName: 'Uttara Model School',
        score: 368,
        award: { en: 'Merit Award — ৳7,500', bn: 'মেধা পুরস্কার — ৳৭,৫০০' },
      },
      {
        position: 5,
        studentName: 'Oishi Rahman',
        schoolName: 'Comilla Victoria School',
        score: 361,
        award: { en: 'Merit Award — ৳7,500', bn: 'মেধা পুরস্কার — ৳৭,৫০০' },
      },
    ],
  },
];

/** Year → grades index used by the Results page selectors. */
export const seedResultIndex: ResultYearIndexEntry[] = [
  { year: 2025, gradeIds: ['g5', 'g8', 'g10'] },
  { year: 2024, gradeIds: ['g6', 'g9'] },
];
