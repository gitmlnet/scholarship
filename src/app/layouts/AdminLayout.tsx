import { Suspense } from 'react';
import { Link, Outlet } from 'react-router';
import { PageLoading } from '@/components/common/PageLoading';
import { Container } from '@/components/ui/Container';

/**
 * Demo admin shell. Authentication and the dashboard itself arrive in
 * Phase 7 — this layout establishes the route structure now.
 */
export default function AdminLayout() {
  return (
    <div className="bg-navy-50 flex min-h-screen flex-col">
      <header className="border-line bg-navy-950 border-b text-white">
        <Container className="flex h-14 items-center justify-between">
          <Link to="/admin" className="rounded-lg text-sm font-bold tracking-wide">
            ScholarSphere <span className="text-gold-300">Admin</span>
          </Link>
          <Link
            to="/"
            className="text-navy-200 rounded-lg text-sm underline-offset-4 hover:text-white hover:underline focus-visible:outline-white"
          >
            ← Back to site
          </Link>
        </Container>
      </header>
      <main id="main-content" className="flex-1">
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
