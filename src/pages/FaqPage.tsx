import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { FaqCategory } from '@/types';
import { Accordion, type AccordionItem } from '@/components/ui/Accordion';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageShell } from '@/components/common/PageShell';
import { ErrorState } from '@/components/common/ErrorState';
import { useFaqs } from '@/hooks/useFaqs';
import { useLocalized } from '@/hooks/useLocalized';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { cn } from '@/utils/cn';

const CATEGORIES: Array<FaqCategory | 'all'> = [
  'all',
  'program',
  'eligibility',
  'payment',
  'tracking',
  'about',
];

// Literal-key map keeps i18n keys type-checked (no dynamic string keys).
const CATEGORY_LABEL_KEYS = {
  program: 'faq.categories.program',
  eligibility: 'faq.categories.eligibility',
  payment: 'faq.categories.payment',
  tracking: 'faq.categories.tracking',
  about: 'faq.categories.about',
} as const;

/** Bilingual FAQ with a category filter, on native disclosure widgets. */
export default function FaqPage() {
  const { t } = useTranslation(['pages', 'common']);
  const { pick } = useLocalized();
  const [category, setCategory] = useState<FaqCategory | 'all'>('all');

  useDocumentMeta(t('faq.title'), t('faq.description'));

  const { data, isPending, isError, refetch } = useFaqs();

  const visible = data?.filter((faq) => category === 'all' || faq.category === category) ?? [];
  const items: AccordionItem[] = visible.map((faq) => ({
    id: faq.id,
    summary: pick(faq.question),
    content: pick(faq.answer),
  }));

  const labelFor = (value: FaqCategory | 'all') =>
    value === 'all' ? t('faq.categories.all') : t(CATEGORY_LABEL_KEYS[value]);

  return (
    <PageShell title={t('faq.title')} description={t('faq.description')}>
      {/* Category filter */}
      <div role="group" aria-label={t('faq.title')} className="flex flex-wrap gap-2">
        {CATEGORIES.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={category === value}
            onClick={() => setCategory(value)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
              category === value
                ? 'border-navy-800 bg-navy-800 text-white'
                : 'border-line-strong bg-surface-raised text-navy-800 hover:border-navy-300 hover:bg-navy-50',
            )}
          >
            {labelFor(value)}
          </button>
        ))}
      </div>

      {/* Questions */}
      <div className="mt-8 max-w-3xl">
        {isError && <ErrorState onRetry={refetch} />}

        {isPending && (
          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map((index) => (
              <Skeleton key={index} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        )}

        {!isPending && !isError && items.length === 0 && (
          <EmptyState title={t('common:state.empty')} />
        )}

        {!isPending && !isError && items.length > 0 && <Accordion items={items} />}
      </div>
    </PageShell>
  );
}
