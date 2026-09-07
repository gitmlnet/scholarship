import type { Faq } from '@/types';

/** Fictional, bilingual seed FAQs. */
export const seedFaqs: Faq[] = [
  {
    id: 'faq-eligibility',
    category: 'eligibility',
    question: {
      en: 'Who can apply for the scholarship?',
      bn: 'স্কলারশিপের জন্য কারা আবেদন করতে পারবে?',
    },
    answer: {
      en: 'Students currently enrolled in Grades 4–10 at any recognized institution can apply. Grade-wise requirements, subjects, and exam durations are listed on the Eligibility page.',
      bn: 'যেকোনো স্বীকৃত প্রতিষ্ঠানে চতুর্থ থেকে দশম শ্রেণিতে অধ্যয়নরত শিক্ষার্থীরা আবেদন করতে পারবে। শ্রেণিভিত্তিক শর্ত, বিষয় ও পরীক্ষার সময় যোগ্যতা পৃষ্ঠায় দেওয়া আছে।',
    },
  },
  {
    id: 'faq-fee',
    category: 'payment',
    question: { en: 'How do I pay the application fee?', bn: 'আবেদন ফি কীভাবে পরিশোধ করব?' },
    answer: {
      en: 'The fee (৳100–200 depending on grade) is paid through DemoPay, a fictional mobile financial service, and the transaction ID is entered in Step 5 of the application. Verification is simulated — no real money moves anywhere.',
      bn: 'শ্রেণি অনুযায়ী ফি (৳১০০–২০০) পরিশোধ করতে হয় ডেমোপে নামের কাল্পনিক মোবাইল ফিন্যান্সিয়াল সার্ভিসের মাধ্যমে এবং আবেদনের ধাপ ৫-এ ট্রানজেকশন আইডি দিতে হয়। যাচাই অনুকরণ করা হয় — কোনো প্রকৃত অর্থ লেনদেন হয় না।',
    },
  },
  {
    id: 'faq-tracking',
    category: 'tracking',
    question: {
      en: 'How can I track my application?',
      bn: 'আমি কীভাবে আমার আবেদনের অবস্থা দেখতে পারি?',
    },
    answer: {
      en: 'Use the Track Application page with the application ID you received after submission (for example SS26-847291). The status page shows your progress from submission to the final decision — nothing more, so your personal details stay private.',
      bn: 'জমা দেওয়ার পর প্রাপ্ত আবেদন আইডি (যেমন SS26-847291) দিয়ে "আবেদন ট্র্যাক করুন" পৃষ্ঠা ব্যবহার করুন। সেখানে জমা থেকে চূড়ান্ত সিদ্ধান্ত পর্যন্ত অগ্রগতি দেখা যায় — আর কিছুই নয়, যাতে আপনার ব্যক্তিগত তথ্য সুরক্ষিত থাকে।',
    },
  },
  {
    id: 'faq-results',
    category: 'program',
    question: { en: 'When are results published?', bn: 'ফলাফল কবে প্রকাশ হয়?' },
    answer: {
      en: 'For the 2026 cycle, results are expected by 31 January 2027. Merit lists are published on the Results page, and a notice is posted as soon as they are available.',
      bn: '২০২৬ শিক্ষাবর্ষের ফলাফল আশা করা হচ্ছে ৩১ জানুয়ারি ২০২৭-এর মধ্যে। মেধা তালিকা ফলাফল পৃষ্ঠায় প্রকাশ করা হবে এবং প্রকাশের সাথে সাথেই নোটিশ দেওয়া হবে।',
    },
  },
  {
    id: 'faq-real',
    category: 'about',
    question: { en: 'Is this a real scholarship program?', bn: 'এটি কি প্রকৃত বৃত্তি প্রোগ্রাম?' },
    answer: {
      en: 'No. ScholarSphere is a fictional platform built as a software-engineering learning project. No real applications, payments, or personal data are processed.',
      bn: 'না। স্কলারস্ফিয়ার একটি সফটওয়্যার প্রকৌশল শেখার প্রকল্প হিসেবে নির্মিত কাল্পনিক প্ল্যাটফর্ম। কোনো প্রকৃত আবেদন, পেমেন্ট বা ব্যক্তিগত তথ্য প্রক্রিয়া করা হয় না।',
    },
  },
];
