import type { GradeConfig } from '@/types';

/**
 * Per-grade eligibility & exam structure (fictional demo values).
 * Feeds the Eligibility page and the registration wizard; the admin
 * dashboard can later edit these instead of touching code.
 */
export const seedGrades: GradeConfig[] = [
  {
    id: 'g4',
    level: 4,
    label: { en: 'Grade 4', bn: 'চতুর্থ শ্রেণি' },
    eligibility: {
      en: 'Students enrolled in Grade 4 at any recognized primary school in the 2026 academic year.',
      bn: '২০২৬ শিক্ষাবর্ষে যেকোনো স্বীকৃত প্রাথমিক বিদ্যালয়ের চতুর্থ শ্রেণিতে ভর্তি শিক্ষার্থীরা।',
    },
    subjects: [
      { name: { en: 'Bangla', bn: 'বাংলা' }, marks: 100 },
      { name: { en: 'English', bn: 'ইংরেজি' }, marks: 100 },
      { name: { en: 'Mathematics', bn: 'গণিত' }, marks: 100 },
    ],
    examDurationMinutes: 90,
    totalMarks: 300,
    instructions: [
      {
        en: 'Bring the admit card and arrive 30 minutes before the exam.',
        bn: 'প্রবেশপত্র সঙ্গে এনে পরীক্ষা শুরুর ৩০ মিনিট আগে উপস্থিত থাকুন।',
      },
      {
        en: 'Answer with a black or blue pen in the provided booklet.',
        bn: 'প্রদত্ত খাতায় কালো বা নীল কলম দিয়ে উত্তর লিখুন।',
      },
      {
        en: 'Electronic devices and calculators are not allowed.',
        bn: 'ইলেকট্রনিক ডিভাইস ও ক্যালকুলেটর ব্যবহার নিষিদ্ধ।',
      },
    ],
  },
  {
    id: 'g5',
    level: 5,
    label: { en: 'Grade 5', bn: 'পঞ্চম শ্রেণি' },
    eligibility: {
      en: 'Students enrolled in Grade 5 at any recognized primary school; the year-end result sheet is required during verification.',
      bn: 'যেকোনো স্বীকৃত প্রাথমিক বিদ্যালয়ের পঞ্চম শ্রেণির শিক্ষার্থীরা; যাচাইয়ের সময় বার্ষিক পরীক্ষার মার্কশিট প্রয়োজন।',
    },
    subjects: [
      { name: { en: 'Bangla', bn: 'বাংলা' }, marks: 100 },
      { name: { en: 'English', bn: 'ইংরেজি' }, marks: 100 },
      { name: { en: 'Mathematics', bn: 'গণিত' }, marks: 100 },
    ],
    examDurationMinutes: 90,
    totalMarks: 300,
    instructions: [
      {
        en: 'Bring the admit card and arrive 30 minutes before the exam.',
        bn: 'প্রবেশপত্র সঙ্গে এনে পরীক্ষা শুরুর ৩০ মিনিট আগে উপস্থিত থাকুন।',
      },
      {
        en: 'Answer with a black or blue pen in the provided booklet.',
        bn: 'প্রদত্ত খাতায় কালো বা নীল কলম দিয়ে উত্তর লিখুন।',
      },
      {
        en: 'Electronic devices and calculators are not allowed.',
        bn: 'ইলেকট্রনিক ডিভাইস ও ক্যালকুলেটর ব্যবহার নিষিদ্ধ।',
      },
    ],
  },
  {
    id: 'g6',
    level: 6,
    label: { en: 'Grade 6', bn: 'ষষ্ঠ শ্রেণি' },
    eligibility: {
      en: 'Students enrolled in Grade 6 at any recognized school; a minimum GPA of 3.50 in the 2025 annual examination is required.',
      bn: 'যেকোনো স্বীকৃত বিদ্যালয়ের ষষ্ঠ শ্রেণির শিক্ষার্থীরা; ২০২৫ বার্ষিক পরীক্ষায় ন্যূনতম জিপিএ ৩.৫০ প্রয়োজন।',
    },
    subjects: [
      { name: { en: 'Bangla', bn: 'বাংলা' }, marks: 100 },
      { name: { en: 'English', bn: 'ইংরেজি' }, marks: 100 },
      { name: { en: 'Mathematics', bn: 'গণিত' }, marks: 100 },
      { name: { en: 'General Science', bn: 'সাধারণ বিজ্ঞান' }, marks: 50 },
    ],
    examDurationMinutes: 120,
    totalMarks: 350,
    instructions: [
      {
        en: 'Bring the admit card and arrive 30 minutes before the exam.',
        bn: 'প্রবেশপত্র সঙ্গে এনে পরীক্ষা শুরুর ৩০ মিনিট আগে উপস্থিত থাকুন।',
      },
      {
        en: 'Rough work must be done only in the margin space of the booklet.',
        bn: 'খসড়া হিসাব শুধু খাতার মার্জিনে করতে হবে।',
      },
      {
        en: 'Electronic devices and calculators are not allowed.',
        bn: 'ইলেকট্রনিক ডিভাইস ও ক্যালকুলেটর ব্যবহার নিষিদ্ধ।',
      },
    ],
  },
  {
    id: 'g7',
    level: 7,
    label: { en: 'Grade 7', bn: 'সপ্তম শ্রেণি' },
    eligibility: {
      en: 'Students enrolled in Grade 7 at any recognized school; a minimum GPA of 3.50 in the 2025 annual examination is required.',
      bn: 'যেকোনো স্বীকৃত বিদ্যালয়ের সপ্তম শ্রেণির শিক্ষার্থীরা; ২০২৫ বার্ষিক পরীক্ষায় ন্যূনতম জিপিএ ৩.৫০ প্রয়োজন।',
    },
    subjects: [
      { name: { en: 'Bangla', bn: 'বাংলা' }, marks: 100 },
      { name: { en: 'English', bn: 'ইংরেজি' }, marks: 100 },
      { name: { en: 'Mathematics', bn: 'গণিত' }, marks: 100 },
      { name: { en: 'General Science', bn: 'সাধারণ বিজ্ঞান' }, marks: 50 },
    ],
    examDurationMinutes: 120,
    totalMarks: 350,
    instructions: [
      {
        en: 'Bring the admit card and arrive 30 minutes before the exam.',
        bn: 'প্রবেশপত্র সঙ্গে এনে পরীক্ষা শুরুর ৩০ মিনিট আগে উপস্থিত থাকুন।',
      },
      {
        en: 'Rough work must be done only in the margin space of the booklet.',
        bn: 'খসড়া হিসাব শুধু খাতার মার্জিনে করতে হবে।',
      },
      {
        en: 'Electronic devices and calculators are not allowed.',
        bn: 'ইলেকট্রনিক ডিভাইস ও ক্যালকুলেটর ব্যবহার নিষিদ্ধ।',
      },
    ],
  },
  {
    id: 'g8',
    level: 8,
    label: { en: 'Grade 8', bn: 'অষ্টম শ্রেণি' },
    eligibility: {
      en: 'Students enrolled in Grade 8 at any recognized school; a minimum GPA of 3.75 in the 2025 annual examination is required.',
      bn: 'যেকোনো স্বীকৃত বিদ্যালয়ের অষ্টম শ্রেণির শিক্ষার্থীরা; ২০২৫ বার্ষিক পরীক্ষায় ন্যূনতম জিপিএ ৩.৭৫ প্রয়োজন।',
    },
    subjects: [
      { name: { en: 'Bangla', bn: 'বাংলা' }, marks: 100 },
      { name: { en: 'English', bn: 'ইংরেজি' }, marks: 100 },
      { name: { en: 'Mathematics', bn: 'গণিত' }, marks: 100 },
      { name: { en: 'General Science', bn: 'সাধারণ বিজ্ঞান' }, marks: 50 },
    ],
    examDurationMinutes: 120,
    totalMarks: 350,
    instructions: [
      {
        en: 'Bring the admit card and arrive 30 minutes before the exam.',
        bn: 'প্রবেশপত্র সঙ্গে এনে পরীক্ষা শুরুর ৩০ মিনিট আগে উপস্থিত থাকুন।',
      },
      {
        en: 'Rough work must be done only in the margin space of the booklet.',
        bn: 'খসড়া হিসাব শুধু খাতার মার্জিনে করতে হবে।',
      },
      {
        en: 'Electronic devices and calculators are not allowed.',
        bn: 'ইলেকট্রনিক ডিভাইস ও ক্যালকুলেটর ব্যবহার নিষিদ্ধ।',
      },
    ],
  },
  {
    id: 'g9',
    level: 9,
    label: { en: 'Grade 9', bn: 'নবম শ্রেণি' },
    eligibility: {
      en: 'Students enrolled in Grade 9 (any stream) at any recognized secondary school; a minimum GPA of 4.00 in the 2025 annual examination is required.',
      bn: 'যেকোনো স্বীকৃত মাধ্যমিক বিদ্যালয়ের নবম শ্রেণির (যেকোনো বিভাগ) শিক্ষার্থীরা; ২০২৫ বার্ষিক পরীক্ষায় ন্যূনতম জিপিএ ৪.০০ প্রয়োজন।',
    },
    subjects: [
      { name: { en: 'Bangla', bn: 'বাংলা' }, marks: 100 },
      { name: { en: 'English', bn: 'ইংরেজি' }, marks: 100 },
      { name: { en: 'Mathematics', bn: 'গণিত' }, marks: 100 },
      { name: { en: 'Science', bn: 'বিজ্ঞান' }, marks: 100 },
    ],
    examDurationMinutes: 150,
    totalMarks: 400,
    instructions: [
      {
        en: 'Bring the admit card and a government-issued ID for verification.',
        bn: 'যাচাইয়ের জন্য প্রবেশপত্র ও সরকারি পরিচয়পত্র সঙ্গে আনুন।',
      },
      {
        en: 'Rough work must be done only in the margin space of the booklet.',
        bn: 'খসড়া হিসাব শুধু খাতার মার্জিনে করতে হবে।',
      },
      {
        en: 'Electronic devices and calculators are not allowed.',
        bn: 'ইলেকট্রনিক ডিভাইস ও ক্যালকুলেটর ব্যবহার নিষিদ্ধ।',
      },
    ],
  },
  {
    id: 'g10',
    level: 10,
    label: { en: 'Grade 10', bn: 'দশম শ্রেণি' },
    eligibility: {
      en: 'Students appearing for the 2027 SSC examination from any recognized secondary school; a minimum GPA of 4.00 in the 2025 annual examination is required.',
      bn: 'যেকোনো স্বীকৃত মাধ্যমিক বিদ্যালয় থেকে ২০২৭ সালের এসএসসিতে অংশগ্রহণের কথা রয়েছে এমন শিক্ষার্থীরা; ২০২৫ বার্ষিক পরীক্ষায় ন্যূনতম জিপিএ ৪.০০ প্রয়োজন।',
    },
    subjects: [
      { name: { en: 'Bangla', bn: 'বাংলা' }, marks: 100 },
      { name: { en: 'English', bn: 'ইংরেজি' }, marks: 100 },
      { name: { en: 'Mathematics', bn: 'গণিত' }, marks: 100 },
      { name: { en: 'Science', bn: 'বিজ্ঞান' }, marks: 100 },
    ],
    examDurationMinutes: 150,
    totalMarks: 400,
    instructions: [
      {
        en: 'Bring the admit card and a government-issued ID for verification.',
        bn: 'যাচাইয়ের জন্য প্রবেশপত্র ও সরকারি পরিচয়পত্র সঙ্গে আনুন।',
      },
      {
        en: 'Rough work must be done only in the margin space of the booklet.',
        bn: 'খসড়া হিসাব শুধু খাতার মার্জিনে করতে হবে।',
      },
      {
        en: 'Electronic devices and calculators are not allowed.',
        bn: 'ইলেকট্রনিক ডিভাইস ও ক্যালকুলেটর ব্যবহার নিষিদ্ধ।',
      },
    ],
  },
];
