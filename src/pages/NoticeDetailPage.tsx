import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { useNotice } from '@/features/notices/hooks';
import { useLocalized } from '@/hooks/useLocalized';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { formatDate } from '@/utils/format';
import { isNotFoundError } from '@/services/errors';
import { Container } from '@/components/ui/Container';
import { PageLoading } from '@/components/common/PageLoading';
import { ErrorState } from '@/components/common/ErrorState';
import { CategoryBadge } from '@/features/notices/components/CategoryBadge';

export default function NoticeDetailPage() {
  const { noticeId = '' } = useParams();
  const { t } = useTranslation(['pages', 'common']);
  const { lang, pick } = useLocalized();
  const { data: notice, isPending, isError, error, refetch } = useNotice(noticeId);

  const title = notice ? pick(notice.title) : t('notices.title');
  useDocumentMeta(title, notice ? pick(notice.summary) : t('notices.description'));

  return (
    <Container as="article" className="max-w-3xl py-12 md:py-16">
      <Link
        to="/notices"
        className="text-navy-800 text-sm font-semibold underline-offset-4 hover:underline"
      >
        ← {t('common:actions.back')}
      </Link>

      {isPending && <PageLoading />}

      {isError &&
        (isNotFoundError(error) ? (
          <div className="mt-8">
            <ErrorState message={t('common:state.notFound')} />
          </div>
        ) : (
          <div className="mt-8">
            <ErrorState onRetry={() => void refetch()} />
          </div>
        ))}

      {notice && (
        <div className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <CategoryBadge category={notice.category} />
            <time dateTime={notice.date} className="text-ink-muted text-sm font-medium">
              {formatDate(notice.date, lang)}
            </time>
          </div>
          <h1 className="text-navy-950 mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            {pick(notice.title)}
          </h1>
          <div className="text-ink mt-6 space-y-4 text-base leading-relaxed">
            {pick(notice.details)
              .split(/\n{1,}/)
              .map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
          </div>
        </div>
      )}
    </Container>
  );
}
