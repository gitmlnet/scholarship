import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonBn from './translations/bn/common.json';
import homeBn from './translations/bn/home.json';
import layoutBn from './translations/bn/layout.json';
import pagesBn from './translations/bn/pages.json';
import registerBn from './translations/bn/register.json';
import commonEn from './translations/en/common.json';
import homeEn from './translations/en/home.json';
import layoutEn from './translations/en/layout.json';
import pagesEn from './translations/en/pages.json';
import registerEn from './translations/en/register.json';

export const SUPPORTED_LANGUAGES = ['en', 'bn'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

const LANG_STORAGE_KEY = 'scholarsphere.lang';

export const resources = {
  en: {
    common: commonEn,
    layout: layoutEn,
    home: homeEn,
    pages: pagesEn,
    register: registerEn,
  },
  bn: {
    common: commonBn,
    layout: layoutBn,
    home: homeBn,
    pages: pagesBn,
    register: registerBn,
  },
} as const;

function detectInitialLanguage(): Language {
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === 'en' || stored === 'bn') return stored;
  } catch {
    // storage unavailable — fall through to navigator detection
  }
  const navigatorLanguage =
    typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'en';
  return navigatorLanguage.startsWith('bn') ? 'bn' : 'en';
}

if (!i18next.isInitialized) {
  void i18next.use(initReactI18next).init({
    resources,
    lng: detectInitialLanguage(),
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: { escapeValue: false }, // React already escapes output
  });

  document.documentElement.lang = i18next.language;
  i18next.on('languageChanged', (lng) => {
    document.documentElement.lang = lng;
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lng);
    } catch {
      // storage unavailable — preference simply won't persist
    }
  });
}

export default i18next;

// Type-safe translation keys (autocomplete + compile-time key checking).
// CustomTypeOptions wants the namespace-keyed shape (one language's view);
// the runtime `resources` option above stays language-keyed, as i18next expects.
declare module 'i18next' {
  interface CustomTypeOptions {
    resources: (typeof resources)['en'];
    defaultNS: 'common';
  }
}
