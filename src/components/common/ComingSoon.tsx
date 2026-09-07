import { useTranslation } from 'react-i18next';
import { PageShell } from './PageShell';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

/** Pages of the public site that are scheduled for a later phase. */
export type PlaceholderPageKey =
  | 'scholarship'
  | 'eligibility'
  | 'syllabus'
  | 'notices'
  | 'register'
  | 'track'
  | 'results'
  | 'faq'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'admin';

// Literal-key map keeps i18n keys type-checked (no dynamic string keys).
const META_KEYS = {
  scholarship: { title: 'scholarship.title', description: 'scholarship.description' },
  eligibility: { title: 'eligibility.title', description: 'eligibility.description' },
  syllabus: { title: 'syllabus.title', description: 'syllabus.description' },
  notices: { title: 'notices.title', description: 'notices.description' },
  register: { title: 'register.title', description: 'register.description' },
  track: { title: 'track.title', description: 'track.description' },
  results: { title: 'results.title', description: 'results.description' },
  faq: { title: 'faq.title', description: 'faq.description' },
  contact: { title: 'contact.title', description: 'contact.description' },
  privacy: { title: 'privacy.title', description: 'privacy.description' },
  terms: { title: 'terms.title', description: 'terms.description' },
  admin: { title: 'admin.title', description: 'admin.description' },
} as const;

export function ComingSoon({ page }: { page: PlaceholderPageKey }) {
  const { t } = useTranslation('pages');
  const keys = META_KEYS[page];
  const title = t(keys.title);
  const description = t(keys.description);

  useDocumentMeta(title, description);

  return (
    <PageShell title={title} description={description}>
      <p className="border-line-strong bg-surface-raised text-ink-muted max-w-2xl rounded-xl border border-dashed px-6 py-10 text-center">
        {t('placeholder.body')}
      </p>
    </PageShell>
  );
}
