import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { LocalizedText } from '@/types';
import { SUPPORTED_LANGUAGES, type Language } from '@/i18n';

function resolveLanguage(candidate: string | undefined): Language {
  return SUPPORTED_LANGUAGES.includes(candidate as Language) ? (candidate as Language) : 'en';
}

/**
 * Pick the active language's value from a LocalizedText content field.
 * Mirrors how real CMS-localized content is rendered.
 */
export function useLocalized() {
  const { i18n } = useTranslation();
  const lang = resolveLanguage(i18n.resolvedLanguage ?? i18n.language);
  const pick = useCallback((text: LocalizedText): string => text[lang] || text.en, [lang]);
  return { lang, pick };
}
