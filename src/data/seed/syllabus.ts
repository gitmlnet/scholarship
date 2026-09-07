import type { Syllabus } from '@/types';

/**
 * Grade-wise syllabus library (fictional). Subjects align with the exam
 * structure in grades.ts; topics are indicative, not a real curriculum.
 */
export const seedSyllabus: Syllabus[] = [
  {
    gradeId: 'g4',
    description: {
      en: 'Foundational language and numeracy skills expected by the end of Grade 4.',
      bn: 'চতুর্থ শ্রেণি শেষে প্রত্যাশিত ভাষা ও সংখ্যাগত মৌলিক দক্ষতা।',
    },
    subjects: [
      {
        name: { en: 'Bangla', bn: 'বাংলা' },
        description: {
          en: 'Reading comprehension, vocabulary, and guided writing.',
          bn: 'পাঠ বোঝন, শব্দভাণ্ডার ও পরিচালিত লেখনী।',
        },
        topics: [
          { en: 'Letters and conjunct characters', bn: 'বর্ণমালা ও যুক্তবর্ণ' },
          { en: 'Word and sentence building', bn: 'শব্দ ও বাক্য গঠন' },
          { en: 'Short stories and poems', bn: 'ছোট গল্প ও কবিতা' },
          { en: 'Paragraph writing (5 sentences)', bn: 'অনুচ্ছেদ রচনা (৫ বাক্য)' },
        ],
      },
      {
        name: { en: 'English', bn: 'ইংরেজি' },
        description: {
          en: 'Basic grammar, everyday vocabulary, and simple reading.',
          bn: 'প্রাথমিক ব্যাকরণ, দৈনন্দিন শব্দভাণ্ডার ও সহজ পাঠ।',
        },
        topics: [
          { en: 'Alphabet and phonics', bn: 'বর্ণ ও ধ্বনি' },
          { en: 'Articles and prepositions', bn: 'Article ও preposition' },
          { en: 'Simple present and past tense', bn: 'Simple present ও past tense' },
          { en: 'Picture-based writing', bn: 'ছবি দেখে লেখা' },
        ],
      },
      {
        name: { en: 'Mathematics', bn: 'গণিত' },
        description: {
          en: 'Number sense, arithmetic, and shapes.',
          bn: 'সংখ্যাবোধ, পাটিগণিত ও জ্যামিতিক আকৃতি।',
        },
        topics: [
          { en: 'Numbers up to 10,000', bn: '১০,০০০ পর্যন্ত সংখ্যা' },
          { en: 'Four operations', bn: 'চার প্রক্রিয়া (যোগ, বিয়োগ, গুণ, ভাগ)' },
          { en: 'Introduction to fractions', bn: 'ভগ্নাংশের পরিচিতি' },
          { en: 'Lines, angles, and simple shapes', bn: 'রেখা, কোণ ও সরল আকৃতি' },
        ],
      },
    ],
  },
  {
    gradeId: 'g5',
    description: {
      en: 'Grade 5 builds on the foundations with longer texts and applied arithmetic.',
      bn: 'পঞ্চম শ্রেণিতে ভিত্তির ওপর দীর্ঘ পাঠ ও প্রায়োগিক পাটিগণিত।',
    },
    subjects: [
      {
        name: { en: 'Bangla', bn: 'বাংলা' },
        description: {
          en: 'Comprehension of longer passages and structured writing.',
          bn: 'দীর্ঘ অনুচ্ছেদ বোঝন ও সংগঠিত লেখনী।',
        },
        topics: [
          { en: 'Parts of speech', bn: 'পদ প্রকরণ' },
          { en: 'Tense and sentence correction', bn: 'কাল ও বাক্য শুদ্ধি' },
          { en: 'Fables and folk tales', bn: 'রূপকথা ও লোককাহিনি' },
          { en: 'Letter and application writing', bn: 'পত্র ও আবেদনপত্র রচনা' },
        ],
      },
      {
        name: { en: 'English', bn: 'ইংরেজি' },
        description: {
          en: 'Expanding grammar and building short compositions.',
          bn: 'ব্যাকরণ সম্প্রসারণ ও সংক্ষিপ্ত রচনা লেখা।',
        },
        topics: [
          { en: 'Nouns, pronouns, and verbs', bn: 'Noun, pronoun ও verb' },
          { en: 'Continuous tenses', bn: 'Continuous tense' },
          { en: 'Reading short passages', bn: 'সংক্ষিপ্ত অনুচ্ছেদ পাঠ' },
          { en: 'Guided paragraph (60–80 words)', bn: 'পরিচালিত অনুচ্ছেদ (৬০–৮০ শব্দ)' },
        ],
      },
      {
        name: { en: 'Mathematics', bn: 'গণিত' },
        description: {
          en: 'Arithmetic with larger numbers, fractions, and measurement.',
          bn: 'বৃহত্তর সংখ্যা, ভগ্নাংশ ও পরিমাপ।',
        },
        topics: [
          { en: 'Factors and multiples', bn: 'গুণনীয়ক ও গুণিতক' },
          { en: 'Fractions and decimals', bn: 'ভগ্নাংশ ও দশমিক' },
          { en: 'Perimeter and area', bn: 'পরিসীমা ও ক্ষেত্রফল' },
          { en: 'Word problems (two steps)', bn: 'শব্দসমস্যা (দুই ধাপ)' },
        ],
      },
    ],
  },
  {
    gradeId: 'g6',
    description: {
      en: 'The secondary-school bridge: deeper language work plus science reasoning.',
      bn: 'মাধ্যমিকের সেতু: গভীরতর ভাষাচর্চা ও বিজ্ঞানচিন্তা।',
    },
    subjects: [
      {
        name: { en: 'Bangla', bn: 'বাংলা' },
        description: {
          en: 'Literary and non-literary texts with analytical writing.',
          bn: 'সাহিত্যিক ও অসাহিত্যিক পাঠে বিশ্লেষণী লেখনী।',
        },
        topics: [
          { en: 'Prose and poetry analysis', bn: 'গদ্য ও কবিতার বিশ্লেষণ' },
          { en: 'Sandhi and samas (basics)', bn: 'সন্ধি ও সমাস (মৌলিক)' },
          { en: 'Essay writing (150 words)', bn: 'রচনা লেখা (১৫০ শব্দ)' },
          { en: 'Summary writing', bn: 'সারমর্ম লেখা' },
        ],
      },
      {
        name: { en: 'English', bn: 'ইংরেজি' },
        description: {
          en: 'All core tenses, modals, and structured composition.',
          bn: 'মূল সব কাল, modal ও সংগঠিত রচনা।',
        },
        topics: [
          { en: 'Perfect tenses', bn: 'Perfect tense' },
          { en: 'Modals and voice', bn: 'Modal ও voice' },
          { en: 'Comprehension and cloze tests', bn: 'বোধগম্যতা ও cloze test' },
          { en: 'Story and report writing', bn: 'গল্প ও প্রতিবেদন লেখা' },
        ],
      },
      {
        name: { en: 'Mathematics', bn: 'গণিত' },
        description: {
          en: 'Arithmetic, beginning algebra, and practical geometry.',
          bn: 'পাটিগণিত, প্রাথমিক বীজগণিত ও ব্যবহারিক জ্যামিতি।',
        },
        topics: [
          { en: 'Ratio, proportion, and percentage', bn: 'অনুপাত, সমানুপাত ও শতকরা' },
          { en: 'Simple algebraic expressions', bn: 'সরল বীজগাণিতিক রাশি' },
          { en: 'Triangles and quadrilaterals', bn: 'ত্রিভুজ ও চতুর্ভুজ' },
          { en: 'Data handling and bar charts', bn: 'উপাত্ত বিন্যাস ও স্তম্বচিত্র' },
        ],
      },
      {
        name: { en: 'General Science', bn: 'সাধারণ বিজ্ঞান' },
        description: {
          en: 'Scientific concepts from everyday life.',
          bn: 'দৈনন্দিন জীবনের বৈজ্ঞানিক ধারণা।',
        },
        topics: [
          { en: 'Cells and living things', bn: 'কোষ ও জীব' },
          { en: 'States of matter', bn: 'পদার্থের অবস্থা' },
          { en: 'Force, energy, and motion', bn: 'বল, শক্তি ও গতি' },
          { en: 'Our environment', bn: 'আমাদের পরিবেশ' },
        ],
      },
    ],
  },
  {
    gradeId: 'g7',
    description: {
      en: 'Grade 7 extends analysis and introduces light, heat, and life processes.',
      bn: 'সপ্তম শ্রেণিতে বিশ্লেষণ বিস্তার এবং আলো, তাপ ও জীবনপ্রক্রিয়ার সূচনা।',
    },
    subjects: [
      {
        name: { en: 'Bangla', bn: 'বাংলা' },
        description: {
          en: 'Comparative reading and evidence-based answers.',
          bn: 'তুলনামূলক পাঠ ও যুক্তিনির্ভর উত্তর।',
        },
        topics: [
          { en: 'Comparing two texts', bn: 'দুই পাঠ্যের তুলনা' },
          { en: 'Idioms and proverbs', bn: 'বাগধারা ও প্রবাদ' },
          { en: 'Formal letters and applications', bn: 'আনুষ্ঠানিক পত্র ও আবেদন' },
          { en: 'Dialogue writing', bn: 'সংলাপ রচনা' },
        ],
      },
      {
        name: { en: 'English', bn: 'ইংরেজি' },
        description: {
          en: 'Complex sentences and paragraph cohesion.',
          bn: 'জটিল বাক্য ও অনুচ্ছেদের সংযোগসামঞ্জস্য।',
        },
        topics: [
          { en: 'Complex and compound sentences', bn: 'Complex ও compound sentence' },
          { en: 'Conditionals', bn: 'Conditional sentence' },
          { en: 'Descriptive writing', bn: 'বর্ণনামূলক লেখা' },
          { en: 'Vocabulary in context', bn: 'প্রসঙ্গভিত্তিক শব্দভাণ্ডার' },
        ],
      },
      {
        name: { en: 'Mathematics', bn: 'গণিত' },
        description: {
          en: 'Algebraic manipulation, integers, and circles.',
          bn: 'বীজগাণিতিক সমীকরণ, পূর্ণসংখ্যা ও বৃত্ত।',
        },
        topics: [
          { en: 'Integers and rational numbers', bn: 'পূর্ণসংখ্যা ও মূলদ সংখ্যা' },
          { en: 'Linear equations in one variable', bn: 'একচলবিশিষ্ট সরল সমীকরণ' },
          { en: 'Circles and constructions', bn: 'বৃত্ত ও জ্যামিতিক অঙ্কন' },
          { en: 'Simple interest and profit', bn: 'সরল সুদ ও লাভ-ক্ষতি' },
        ],
      },
      {
        name: { en: 'General Science', bn: 'সাধারণ বিজ্ঞান' },
        description: {
          en: 'Physical and life sciences with lab-style reasoning.',
          bn: 'পরীক্ষাগার-ধাঁচের যুক্তিসহ ভৌত ও জীববিজ্ঞান।',
        },
        topics: [
          { en: 'Light, reflection, and shadows', bn: 'আলো, প্রতিফলন ও ছায়া' },
          { en: 'Heat and temperature', bn: 'তাপ ও উষ্ণতা' },
          { en: 'Photosynthesis and respiration', bn: 'সালোকসংশ্লেষণ ও শ্বসন' },
          { en: 'Acids, bases, and salts', bn: 'অ্যাসিড, ক্ষারক ও লবণ' },
        ],
      },
    ],
  },
  {
    gradeId: 'g8',
    description: {
      en: 'Pre-SSC consolidation: applied problem-solving across all subjects.',
      bn: 'এসএসসি-পূর্ব সংহতি: সব বিষয়ে প্রায়োগিক সমস্যা সমাধান।',
    },
    subjects: [
      {
        name: { en: 'Bangla', bn: 'বাংলা' },
        description: {
          en: 'Critical reading and well-structured essays.',
          bn: 'সমালোচনামূলক পাঠ ও সুসংগঠিত রচনা।',
        },
        topics: [
          { en: 'Literary devices', bn: 'সাহিত্যিক কৌশল' },
          { en: 'Character and theme analysis', bn: 'চরিত্র ও মূলভাব বিশ্লেষণ' },
          { en: 'Essay writing (250 words)', bn: 'রচনা লেখা (২৫০ শব্দ)' },
          { en: 'Precis and paraphrase', bn: 'সংক্ষেপণ ও ভাবান্তর' },
        ],
      },
      {
        name: { en: 'English', bn: 'ইংরেজি' },
        description: {
          en: 'Argumentative writing and grammar in depth.',
          bn: 'যুক্তিনির্ভর লেখা ও গভীর ব্যাকরণ।',
        },
        topics: [
          { en: 'Passive and reported speech', bn: 'Passive voice ও reported speech' },
          { en: 'Relative clauses', bn: 'Relative clause' },
          { en: 'For-and-against essays', bn: 'পক্ষ-বিপক্ষ ভিত্তিক রচনা' },
          { en: 'Email and formal writing', bn: 'ইমেইল ও আনুষ্ঠানিক লেখা' },
        ],
      },
      {
        name: { en: 'Mathematics', bn: 'গণিত' },
        description: {
          en: 'Algebra, geometry proofs, and statistics.',
          bn: 'বীজগণিত, জ্যামিতিক প্রমাণ ও পরিসংখ্যান।',
        },
        topics: [
          { en: 'Algebraic fractions', bn: 'বীজগাণিতিক ভগ্নাংশ' },
          { en: 'Pythagoras’ theorem', bn: 'পিথাগোরাসের সূত্র' },
          { en: 'Sets and Venn diagrams', bn: 'সেট ও ভেনচিত্র' },
          { en: 'Mean, median, and mode', bn: 'গড়, মধ্যক ও প্রচুরক' },
        ],
      },
      {
        name: { en: 'General Science', bn: 'সাধারণ বিজ্ঞান' },
        description: {
          en: 'Systems-level science: body, earth, and electricity.',
          bn: 'ব্যবস্থা-স্তরের বিজ্ঞান: দেহ, পৃথিবী ও বিদ্যুৎ।',
        },
        topics: [
          { en: 'Human organ systems', bn: 'মানবদেহের অঙ্গতন্ত্র' },
          { en: 'Electric circuits', bn: 'বৈদ্যুতিক বর্তনী' },
          { en: 'Weather and climate', bn: 'আবহাওয়া ও জলবায়ু' },
          { en: 'Atoms and molecules', bn: 'পরমাণু ও অণু' },
        ],
      },
    ],
  },
  {
    gradeId: 'g9',
    description: {
      en: 'SSC-track depth in language, mathematics, and science.',
      bn: 'এসএসসি-পথে ভাষা, গণিত ও বিজ্ঞানে গভীরতা।',
    },
    subjects: [
      {
        name: { en: 'Bangla', bn: 'বাংলা' },
        description: {
          en: 'Full-length literary analysis and formal composition.',
          bn: 'পূর্ণাঙ্গ সাহিত্য বিশ্লেষণ ও আনুষ্ঠানিক রচনা।',
        },
        topics: [
          { en: 'Bengali literary history (outline)', bn: 'বাংলা সাহিত্যের ইতিহাস (সংক্ষেপে)' },
          { en: 'Poetry explication', bn: 'কবিতার ব্যাখ্যা' },
          { en: 'Argumentative essay (350 words)', bn: 'যুক্তিনির্ভর রচনা (৩৫০ শব্দ)' },
          { en: 'Report and editorial writing', bn: 'প্রতিবেদন ও সম্পাদকীয় লেখা' },
        ],
      },
      {
        name: { en: 'English', bn: 'ইংরেজি' },
        description: {
          en: 'Advanced grammar and academic writing.',
          bn: 'উচ্চস্তরের ব্যাকরণ ও একাডেমিক লেখা।',
        },
        topics: [
          { en: 'All conditional forms', bn: 'সব ধরনের conditional' },
          { en: 'Gerunds and infinitives', bn: 'Gerund ও infinitive' },
          { en: 'Cause-and-effect essays', bn: 'কার্য-কারণ ভিত্তিক রচনা' },
          { en: 'Summary of long passages', bn: 'দীর্ঘ অনুচ্ছেদের সারমর্ম' },
        ],
      },
      {
        name: { en: 'Mathematics', bn: 'গণিত' },
        description: {
          en: 'Algebra, trigonometry, and coordinate geometry.',
          bn: 'বীজগণিত, ত্রিকোণমিতি ও স্থানাঙ্ক জ্যামিতি।',
        },
        topics: [
          { en: 'Quadratic equations', bn: 'দ্বিঘাত সমীকরণ' },
          { en: 'Trigonometric ratios', bn: 'ত্রিকোণমিতিক অনুপাত' },
          { en: 'Coordinate geometry', bn: 'স্থানাঙ্ক জ্যামিতি' },
          { en: 'Finite series', bn: 'সসীম ধারা' },
        ],
      },
      {
        name: { en: 'Science', bn: 'বিজ্ঞান' },
        description: {
          en: 'Physics, chemistry, and biology at exam depth.',
          bn: 'পরীক্ষা-গভীরতায় পদার্থ, রসায়ন ও জীববিজ্ঞান।',
        },
        topics: [
          { en: 'Motion and Newton’s laws', bn: 'গতি ও নিউটনের সূত্র' },
          { en: 'Chemical reactions and equations', bn: 'রাসায়নিক বিক্রিয়া ও সমীকরণ' },
          { en: 'Cell division and genetics', bn: 'কোষ বিভাজন ও জিনতত্ত্ব' },
          { en: 'Light: refraction and lenses', bn: 'আলো: প্রতিসরণ ও লেন্স' },
        ],
      },
    ],
  },
  {
    gradeId: 'g10',
    description: {
      en: 'The scholarship exam tests SSC-level mastery with an applied edge.',
      bn: 'বৃত্তি পরীক্ষায় এসএসসি-স্তরের দক্ষতা যাচাই হয় প্রায়োগিক দৃষ্টিকোণ থেকে।',
    },
    subjects: [
      {
        name: { en: 'Bangla', bn: 'বাংলা' },
        description: {
          en: 'Synthesis of literary knowledge and precise composition.',
          bn: 'সাহিত্যজ্ঞানের সংশ্লেষণ ও নির্ভুল রচনা।',
        },
        topics: [
          { en: 'Comparative literature', bn: 'তুলনামূলক সাহিত্য' },
          { en: 'Critical appreciation of poems', bn: 'কবিতার সমালোচনামূলক মূল্যায়ন' },
          { en: 'Long essay (450 words)', bn: 'দীর্ঘ রচনা (৪৫০ শব্দ)' },
          { en: 'Translation skills', bn: 'অনুবাদ দক্ষতা' },
        ],
      },
      {
        name: { en: 'English', bn: 'ইংরেজি' },
        description: {
          en: 'Near-native grammar control and analytical writing.',
          bn: 'প্রায়-দক্ষ ব্যাকরণ নিয়ন্ত্রণ ও বিশ্লেষণী লেখা।',
        },
        topics: [
          { en: 'Advanced sentence transformation', bn: 'উচ্চস্তরের বাক্যরূপান্তর' },
          { en: 'Literary comprehension', bn: 'সাহিত্যিক বোধগম্যতা' },
          { en: 'Analytical essays', bn: 'বিশ্লেষণী রচনা' },
          {
            en: 'Vocabulary: synonyms and collocations',
            bn: 'শব্দভাণ্ডার: সমার্থক ও সহবর্তী শব্দ',
          },
        ],
      },
      {
        name: { en: 'Mathematics', bn: 'গণিত' },
        description: {
          en: 'Complete algebra, geometry, and applied trigonometry.',
          bn: 'সম্পূর্ণ বীজগণিত, জ্যামিতি ও প্রায়োগিক ত্রিকোণমিতি।',
        },
        topics: [
          { en: 'Exponents and logarithms', bn: 'সূচক ও লগারিদম' },
          { en: 'Circles and theorems', bn: 'বৃত্ত ও উপপাদ্য' },
          { en: 'Heights and distances', bn: 'উচ্চতা ও দূরত্ব' },
          { en: 'Probability (single events)', bn: 'সম্ভাবনা (একক ঘটনা)' },
        ],
      },
      {
        name: { en: 'Science', bn: 'বিজ্ঞান' },
        description: {
          en: 'Integrated science with multi-concept problems.',
          bn: 'বহুধারণাভিত্তিক সমস্যাসহ সমন্বিত বিজ্ঞান।',
        },
        topics: [
          { en: 'Electricity and magnetism', bn: 'বিদ্যুৎ ও চুম্বকত্ব' },
          { en: 'Periodic table and bonding', bn: 'পর্যায় সারণি ও বন্ধন' },
          { en: 'Human physiology and disease', bn: 'শারীরবিজ্ঞান ও রোগ' },
          { en: 'Waves and sound', bn: 'তরঙ্গ ও শব্দ' },
        ],
      },
    ],
  },
];
