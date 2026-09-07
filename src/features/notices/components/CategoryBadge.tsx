import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import type { NoticeCategory } from '@/types';

const CATEGORY_LABEL_KEYS = {
  registration: 'noticeCategory.registration',
  exam: 'noticeCategory.exam',
  result: 'noticeCategory.result',
  general: 'noticeCategory.general',
} as const;

const CATEGORY_STYLES: Record<NoticeCategory, string> = {
  registration: 'bg-navy-100 text-navy-800',
  exam: 'bg-gold-100 text-gold-800',
  result: 'bg-success-100 text-success-800',
  general: 'bg-navy-50 text-ink-muted',
};

export function CategoryBadge({ category }: { category: NoticeCategory }) {
  const { t } = useTranslation('common');
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        CATEGORY_STYLES[category],
      )}
    >
      {t(CATEGORY_LABEL_KEYS[category])}
    </span>
  );
}
