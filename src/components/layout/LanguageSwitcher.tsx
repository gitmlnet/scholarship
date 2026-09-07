import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import { SUPPORTED_LANGUAGES, type Language } from '@/i18n';

const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  bn: 'বাংলা',
};

/** Instant English ⇄ বাংলা switcher; preference persists, <html lang> follows. */
export function LanguageSwitcher() {
  const { i18n, t } = useTranslation('common');
  const active = (SUPPORTED_LANGUAGES as readonly string[]).includes(i18n.resolvedLanguage ?? '')
    ? (i18n.resolvedLanguage as Language)
    : 'en';

  return (
    <div
      role="group"
      aria-label={t('language.label')}
      className="border-line-strong bg-surface-raised flex items-center rounded-full border p-0.5"
    >
      {SUPPORTED_LANGUAGES.map((language) => (
        <button
          key={language}
          type="button"
          aria-pressed={active === language}
          onClick={() => void i18n.changeLanguage(language)}
          className={cn(
            'rounded-full px-3 py-1 text-sm font-medium transition-colors',
            active === language ? 'bg-navy-800 text-white' : 'text-ink-muted hover:text-navy-800',
          )}
        >
          {LANGUAGE_LABELS[language]}
        </button>
      ))}
    </div>
  );
}
