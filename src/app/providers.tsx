import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ToastProvider } from '@/components/ui/toast/ToastProvider';
import { defaultQueryRetry } from '@/services/queryConfig';
import '@/i18n'; // initialize i18next before any component renders

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: defaultQueryRetry,
    },
  },
});

export function AppProviders({ children }: { children: ReactNode }) {
  const { t } = useTranslation('common');
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider closeLabel={t('actions.close')}>{children}</ToastProvider>
    </QueryClientProvider>
  );
}
