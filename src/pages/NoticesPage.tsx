import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { NoticeCategory } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { NoticeCard } from '@/features/notices/components/NoticeCard';
import { useNotices } from '@/features/notices/hooks';
import { PageShell } from '@/components/common/PageShell';
import { ErrorState } from '@/components/common/ErrorState';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { cn } from '@/utils/cn';

const CATEGORIES: Array<NoticeCategory | 'all'> = [
  'all',
  'registration',
  'exam',
  'result',
  'general',
];

// Literal-key map keeps i18n keys type-checked (no dynamic string keys).
const CATEGORY_LABEL_KEYS = {
  registration: 'common:noticeCategory.registration',
  exam: 'common:noticeCategory.exam',
  result: 'common:noticeCategory.result',
  general: 'common:noticeCategory.general',
} as const;

/** All notices with a category filter (pinned first, newest first). */
export default function NoticesPage() {
  const { t } = useTranslation(['pages', 'common', 'home']);
  const [category, setCategory] = useState<NoticeCategory | 'all'>('all');

  useDocumentMeta(t('notices.title'), t('notices.description'));

  const { data, isPending, isError, refetch } = useNotices(category === 'all' ? {} : { category });

  const labelFor = (value: NoticeCategory | 'all') =>
    value === 'all' ? t('notices.all') : t(CATEGORY_LABEL_KEYS[value]);

  return (
    <PageShell title={t('notices.title')} description={t('notices.description')}>
      {/* Category filter */}
      <div role="group" aria-label={t('notices.filterLabel')} className="flex flex-wrap gap-2">
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

      {/* Notice list */}
      <div className="mt-8">
        {isError && <ErrorState onRetry={refetch} />}

        {isPending && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="border-line bg-surface-raised space-y-3 rounded-xl border p-5"
              >
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        )}

        {!isPending && !isError && (data?.length ?? 0) === 0 && (
          <EmptyState
            title={t('home:notices.empty')}
            description={t('state.empty', { ns: 'common' })}
          />
        )}

        {!isPending && !isError && (data?.length ?? 0) > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
