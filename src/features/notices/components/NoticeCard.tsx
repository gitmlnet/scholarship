import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import type { Notice } from '@/types';
import { useLocalized } from '@/hooks/useLocalized';
import { formatDate } from '@/utils/format';
import { CategoryBadge } from './CategoryBadge';

export function NoticeCard({ notice }: { notice: Notice }) {
  const { t } = useTranslation('common');
  const { lang, pick } = useLocalized();

  return (
    <article className="border-line bg-surface-raised shadow-card hover:shadow-lift flex h-full flex-col rounded-xl border p-5 transition-shadow">
      <div className="flex items-center justify-between gap-3">
        <CategoryBadge category={notice.category} />
        <time dateTime={notice.date} className="text-ink-muted text-xs font-medium">
          {formatDate(notice.date, lang)}
        </time>
      </div>
      <h3 className="text-navy-900 mt-3 text-base leading-snug font-semibold">
        <Link
          to={`/notices/${notice.id}`}
          className="hover:text-navy-600 rounded-sm hover:underline"
        >
          {pick(notice.title)}
        </Link>
      </h3>
      <p className="text-ink-muted mt-2 line-clamp-3 text-sm">{pick(notice.summary)}</p>
      <span className="sr-only">{t('actions.learnMore')}</span>
    </article>
  );
}
