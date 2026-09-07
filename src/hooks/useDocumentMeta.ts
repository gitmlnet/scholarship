import { useEffect } from 'react';
import { SITE } from '@/config/site';

function upsertMeta(name: string, content: string): void {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

/**
 * Per-page document title + meta description (basic SEO for the SPA).
 * Values come from i18n, so language switches re-run this effect.
 */
export function useDocumentMeta(title?: string, description?: string): void {
  useEffect(() => {
    document.title = title
      ? `${title} · ${SITE.titleSuffix}`
      : `${SITE.titleSuffix} — Excellence Scholarship 2026`;
    if (description) upsertMeta('description', description);
  }, [title, description]);
}
