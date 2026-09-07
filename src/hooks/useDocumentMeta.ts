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

function removeMeta(name: string): void {
  document.querySelector(`meta[name="${name}"]`)?.remove();
}

interface DocumentMetaOptions {
  /** Prevent search engines from indexing this page (e.g. /style-guide). */
  noindex?: boolean;
}

/**
 * Per-page document title + meta description (basic SEO for the SPA).
 * Values come from i18n, so language switches re-run this effect.
 */
export function useDocumentMeta(
  title?: string,
  description?: string,
  options?: DocumentMetaOptions,
): void {
  const noindex = options?.noindex ?? false;

  useEffect(() => {
    document.title = title
      ? `${title} · ${SITE.titleSuffix}`
      : `${SITE.titleSuffix} — Excellence Scholarship 2026`;
    if (description) upsertMeta('description', description);
    if (noindex) upsertMeta('robots', 'noindex, nofollow');
    else removeMeta('robots');
  }, [title, description, noindex]);
}
