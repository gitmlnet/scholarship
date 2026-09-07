import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { SkipLink } from '@/components/layout/SkipLink';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageLoading } from '@/components/common/PageLoading';

/** Public site chrome: skip link, announcement bar, header, main, footer. */
export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <AnnouncementBar />
      <Header />
      <main id="main-content" className="flex-1">
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
