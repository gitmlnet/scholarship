import type { ProgramSettings } from '@/types';

/**
 * Program configuration — 100% fictional, Bangladesh-inspired demo values.
 * Configurable by design: every value here can later be edited from the
 * admin dashboard instead of touching code.
 */
export const seedProgramSettings: ProgramSettings = {
  programName: {
    en: 'ScholarSphere Excellence Scholarship',
    bn: 'স্কলারস্ফিয়ার এক্সিলেন্স স্কলারশিপ',
  },
  cycle: 2026,
  shortCode: 'SS26',
  tagline: {
    en: 'Empowering potential. Recognizing excellence. Shaping tomorrow.',
    bn: 'সম্ভাবনাকে শক্তিশালী করা। মেধাকে সম্মান জানানো। আগামীকে গড়ে তোলা।',
  },
  announcement: {
    en: 'Applications for the 2026 cycle are open until 30 November 2026.',
    bn: '২০২৬ শিক্ষাবর্ষের আবেদন ৩০ নভেম্বর ২০২৬ পর্যন্ত খোলা থাকবে।',
  },
  importantDates: [
    {
      key: 'applications-open',
      label: { en: 'Applications open', bn: 'আবেদন শুরু' },
      date: '2026-09-01',
    },
    {
      key: 'applications-close',
      label: { en: 'Applications close', bn: 'আবেদন শেষ' },
      date: '2026-11-30',
    },
    {
      key: 'admit-cards',
      label: { en: 'Admit cards available', bn: 'প্রবেশপত্র প্রকাশ' },
      date: '2026-12-05',
    },
    {
      key: 'exam',
      label: { en: 'Entrance examination', bn: 'ভর্তি পরীক্ষা' },
      date: '2026-12-19',
    },
    {
      key: 'results',
      label: { en: 'Results published', bn: 'ফলাফল প্রকাশ' },
      date: '2027-01-31',
    },
  ],
  applicationFee: {
    currency: 'BDT',
    symbol: '৳',
    byGrade: [
      { gradeId: 'g4', amount: 100 },
      { gradeId: 'g5', amount: 100 },
      { gradeId: 'g6', amount: 150 },
      { gradeId: 'g7', amount: 150 },
      { gradeId: 'g8', amount: 150 },
      { gradeId: 'g9', amount: 200 },
      { gradeId: 'g10', amount: 200 },
    ],
  },
  paymentMethod: {
    name: {
      en: 'DemoPay — Mobile Financial Service (demo)',
      bn: 'ডেমোপে — মোবাইল ফিন্যান্সিয়াল সার্ভিস (ডেমো)',
    },
    merchantAccount: 'SCHOLARSPHERE-DEMO',
    instructions: {
      en: 'Send the application fee from any demo wallet to the merchant account above, then enter the transaction ID in Step 5 of the application. Payment verification is simulated — this is a learning project, not a real payment provider.',
      bn: 'যেকোনো ডেমো ওয়ালেট থেকে উপরের মার্চেন্ট অ্যাকাউন্টে আবেদন ফি পাঠিয়ে আবেদনের ধাপ ৫-এ ট্রানজেকশন আইডি লিখুন। পেমেন্ট যাচাই অনুকরণ করা হয় — এটি একটি শিক্ষামূলক প্রকল্প, প্রকৃত পেমেন্ট প্রদানকারী নয়।',
    },
  },
  contact: {
    email: 'info@scholarsphere.test',
    address: {
      en: 'ScholarSphere Program Office, House 12, Road 5, Dhanmondi, Dhaka 1205 (fictional)',
      bn: 'স্কলারস্ফিয়ার প্রোগ্রাম অফিস, বাড়ি ১২, রোড ৫, ধানমন্ডি, ঢাকা ১২০৫ (কাল্পনিক)',
    },
  },
};
