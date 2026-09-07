import { render } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/i18n'; // initialize i18next before any component renders

interface Options {
  /** Initial URL for the router (default '/'). */
  route?: string;
  /**
   * Route patterns to mount the component under. Needed when the component
   * reads useParams()/navigates between its own routes (e.g. /syllabus/:id);
   * omitted → the component renders outside any Route.
   */
  paths?: string[];
}

/**
 * Render a page with the providers it needs in tests: i18n, a fresh
 * TanStack Query client (no retries — failures surface immediately),
 * and a memory router at the given route.
 */
export function renderWithProviders(ui: ReactElement, options: Options = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  const content = options.paths ? (
    <Routes>
      {options.paths.map((path) => (
        <Route key={path} path={path} element={ui} />
      ))}
    </Routes>
  ) : (
    ui
  );

  const Providers = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[options.route ?? '/']}>{children}</MemoryRouter>
    </QueryClientProvider>
  );

  return render(content, { wrapper: Providers });
}
