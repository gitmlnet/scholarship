import { useTranslation } from 'react-i18next';

/** Keyboard users land here first (WCAG 2.4.1 — bypass blocks). */
export function SkipLink() {
  const { t } = useTranslation('layout');
  return (
    <a
      href="#main-content"
      className="focus:bg-surface-raised focus:text-navy-900 focus:shadow-lift sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
    >
      {t('skipToContent')}
    </a>
  );
}
