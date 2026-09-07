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
      {/* Site chrome disappears when printing (e.g. syllabus → PDF). */}
      <div className="print:hidden">
        <AnnouncementBar />
        <Header />
      </div>
      <main id="main-content" className="flex-1">
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
