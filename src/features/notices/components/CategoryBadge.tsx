import { useTranslation } from 'react-i18next';
import type { NoticeCategory } from '@/types';
import { Badge, type BadgeVariant } from '@/components/ui/Badge';

const CATEGORY_LABEL_KEYS = {
  registration: 'noticeCategory.registration',
  exam: 'noticeCategory.exam',
  result: 'noticeCategory.result',
  general: 'noticeCategory.general',
} as const;

const CATEGORY_VARIANTS: Record<NoticeCategory, BadgeVariant> = {
  registration: 'navy',
  exam: 'gold',
  result: 'success',
  general: 'neutral',
};

export function CategoryBadge({ category }: { category: NoticeCategory }) {
  const { t } = useTranslation('common');
  return <Badge variant={CATEGORY_VARIANTS[category]}>{t(CATEGORY_LABEL_KEYS[category])}</Badge>;
}
