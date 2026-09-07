import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useNotices } from '../hooks';
import { NoticeCard } from './NoticeCard';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { ErrorState } from '@/components/common/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';

/** Home-page slice: latest notices straight through the service → mock API stack. */
export function LatestNotices() {
  const { t } = useTranslation(['home', 'common']);
  const { data, isPending, isError, refetch } = useNotices({ limit: 3 });

  return (
    <Container as="section" className="py-14 md:py-20">
      <SectionHeading
        title={t('notices.heading')}
        actions={
          <Link
            to="/notices"
            className="text-navy-800 text-sm font-semibold underline-offset-4 hover:underline"
          >
            {t('notices.viewAll')}
          </Link>
        }
      />

      {isPending && (
        <div className="grid gap-6 md:grid-cols-3">
          {[0, 1, 2].map((index) => (
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

      {isError && <ErrorState onRetry={() => void refetch()} />}

      {data && data.length === 0 && <p className="text-ink-muted">{t('notices.empty')}</p>}

      {data && data.length > 0 && (
        <ul className="grid list-none gap-6 md:grid-cols-3">
          {data.map((notice) => (
            <li key={notice.id}>
              <NoticeCard notice={notice} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
