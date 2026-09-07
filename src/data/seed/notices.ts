import type { Notice } from '@/types';

/** Fictional, bilingual seed notices. Dates are relative to the 2026 cycle. */
export const seedNotices: Notice[] = [
  {
    id: 'n2026-001',
    date: '2026-09-01',
    category: 'registration',
    pinned: true,
    title: {
      en: 'Applications open for the 2026 cycle',
      bn: '২০২৬ শিক্ষাবর্ষের আবেদন শুরু হয়েছে',
    },
    summary: {
      en: 'Online applications are open from 1 September to 30 November 2026 for students in Grades 4–10.',
      bn: 'চতুর্থ থেকে দশম শ্রেণির শিক্ষার্থীদের জন্য ১ সেপ্টেম্বর থেকে ৩০ নভেম্বর ২০২৬ পর্যন্ত অনলাইন আবেদন চলবে।',
    },
    details: {
      en: 'Applications must be completed through the online registration wizard on this website. The application fee varies by grade and is paid through the demo mobile financial service. After submitting, keep your application ID (for example SS26-847291) to track your status on the Track Application page.',
      bn: 'আবেদন অবশ্যই এই ওয়েবসাইটের অনলাইন রেজিস্ট্রেশন উইজার্ডের মাধ্যমে সম্পন্ন করতে হবে। আবেদন ফি শ্রেণিভেদে ভিন্ন এবং ডেমো মোবাইল ফিন্যান্সিয়াল সার্ভিসের মাধ্যমে পরিশোধ করতে হবে। জমা দেওয়ার পর অবস্থা দেখতে আপনার আবেদন আইডি (যেমন SS26-847291) সংরক্ষণ করুন।',
    },
  },
  {
    id: 'n2026-002',
    date: '2026-09-01',
    category: 'registration',
    pinned: false,
    title: {
      en: 'Applicant guide and demo walkthrough published',
      bn: 'আবেদনকারীর নির্দেশিকা ও ডেমো প্রক্রিয়ার বিবরণ প্রকাশিত',
    },
    summary: {
      en: 'A step-by-step guide to the seven-step application wizard is now available on the Registration page.',
      bn: 'সাত ধাপের আবেদন উইজার্ডের ধাপে ধাপে নির্দেশিকা এখন রেজিস্ট্রেশন পৃষ্ঠায় পাওয়া যাবে।',
    },
    details: {
      en: 'The guide walks through eligibility confirmation, student and guardian information, academic details, the demo payment reference, and submission. Keep your information ready before starting — the wizard saves a draft automatically as you go.',
      bn: 'নির্দেশিকাটি যোগ্যতা নিশ্চিতকরণ, শিক্ষার্থী ও অভিভাবকের তথ্য, শিক্ষাগত তথ্য, ডেমো পেমেন্ট রেফারেন্স এবং জমা দেওয়ার প্রক্রিয়া ব্যাখ্যা করে। শুরু করার আগে প্রয়োজনীয় তথ্য প্রস্তুত রাখুন — উইজার্ড প্রতিটি ধাপ স্বয়ংক্রিয়ভাবে খসড়া হিসেবে সংরক্ষণ করে।',
    },
  },
  {
    id: 'n2026-003',
    date: '2026-08-20',
    category: 'exam',
    pinned: false,
    title: {
      en: 'Exam centres announced for the December test',
      bn: 'ডিসেম্বর পরীক্ষার কেন্দ্র ঘোষণা করা হয়েছে',
    },
    summary: {
      en: 'The 2026 entrance examination will be held on 19 December across 24 (fictional) centres nationwide.',
      bn: '২০২৬ সালের ভর্তি পরীক্ষা ১৯ ডিসেম্বর সারাদেশের ২৪টি (কাল্পনিক) কেন্দ্রে অনুষ্ঠিত হবে।',
    },
    details: {
      en: 'Admit cards will be available for download from 5 December 2026. Candidates must bring the printed admit card and one photo ID to the exam centre. Centre allocations are fictional and shown for demonstration only.',
      bn: 'প্রবেশপত্র ৫ ডিসেম্বর ২০২৬ থেকে ডাউনলোডের জন্য উন্মুক্ত থাকবে। পরীক্ষার্থীদের পরীক্ষা কেন্দ্রে ছাপানো প্রবেশপত্র এবং একটি ছবিসহ পরিচয়পত্র আনতে হবে। কেন্দ্র বরাদ্দ কাল্পনিক এবং শুধু প্রদর্শনের উদ্দেশ্যে দেখানো হয়েছে।',
    },
  },
  {
    id: 'n2026-004',
    date: '2026-08-12',
    category: 'general',
    pinned: false,
    title: {
      en: 'Syllabus refined for Grades 6–8',
      bn: 'ষষ্ঠ থেকে অষ্টম শ্রেণির সিলেবাস পরিমার্জিত',
    },
    summary: {
      en: 'Minor updates to mathematics and science topic weights for the 2026 cycle.',
      bn: '২০২৬ শিক্ষাবর্ষের জন্য গণিত ও বিজ্ঞানের অধ্যায়ভিত্তিক গুরুত্বে সামান্য পরিবর্তন আনা হয়েছে।',
    },
    details: {
      en: 'The updated syllabus documents for Grades 6, 7 and 8 are available in the Syllabus library. No topics were removed; only mark distributions changed slightly.',
      bn: 'ষষ্ঠ, সপ্তম ও অষ্টম শ্রেণির হালনাগাদ সিলেবাস সিলেবাস লাইব্রেরিতে পাওয়া যাবে। কোনো অধ্যায় বাদ দেওয়া হয়নি; শুধু নম্বর বণ্টনে সামান্য পরিবর্তন এসেছে।',
    },
  },
  {
    id: 'n2026-005',
    date: '2026-07-30',
    category: 'result',
    pinned: false,
    title: {
      en: '2025 merit list added to the archive',
      bn: '২০২৫ সালের মেধা তালিকা সংরক্ষণাগারে যোগ হয়েছে',
    },
    summary: {
      en: 'Merit lists and award records from the 2025 cycle are now browsable on the Results page.',
      bn: '২০২৫ শিক্ষাবর্ষের মেধা তালিকা ও পুরস্কারের তথ্য এখন ফলাফল পৃষ্ঠায় দেখা যাবে।',
    },
    details: {
      en: 'The archive includes grade-wise merit lists for all seven grades of the 2025 cycle, with fictional student and school names used throughout.',
      bn: 'সংরক্ষণাগারে ২০২৫ শিক্ষাবর্ষের সাতটি শ্রেণির মেধা তালিকা রয়েছে; সব শিক্ষার্থীর নাম ও প্রতিষ্ঠানের নাম কাল্পনিক।',
    },
  },
  {
    id: 'n2026-006',
    date: '2026-05-20',
    category: 'general',
    pinned: false,
    title: {
      en: 'Revised office hours during Eid holidays',
      bn: 'ঈদ ছুটির সময় অফিসের পরিবর্তিত সময়সূচি',
    },
    summary: {
      en: 'The program office will remain closed from 24 to 28 May and reopen on 29 May.',
      bn: 'প্রোগ্রাম অফিস ২৪ থেকে ২৮ মে পর্যন্ত বন্ধ থাকবে এবং ২৯ মে থেকে আবার খুলবে।',
    },
    details: {
      en: 'Emails received during the holidays will be answered after the office reopens. This is a fictional schedule for a fictional program office.',
      bn: 'ছুটির সময় প্রাপ্ত ইমেইলের উত্তর অফিস খোলার পর দেওয়া হবে। এটি একটি কাল্পনিক প্রোগ্রাম অফিসের কাল্পনিক সময়সূচি।',
    },
  },
];
