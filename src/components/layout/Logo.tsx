import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

interface LogoProps {
  className?: string;
}

/** Original ScholarSphere brand mark + wordmark. */
export function Logo({ className }: LogoProps) {
  const { t } = useTranslation('common');
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg viewBox="0 0 64 64" className="h-8 w-8 shrink-0" aria-hidden="true" focusable="false">
        <rect width="64" height="64" rx="14" fill="#0b1b31" />
        <path d="M32 10l4.9 13.1L50 28l-13.1 4.9L32 46l-4.9-13.1L14 28l13.1-4.9z" fill="#d6ac3f" />
        <path
          d="M16 50c5-3.4 10.5-3.4 16 0 5.5-3.4 11-3.4 16 0"
          fill="none"
          stroke="#f5eccb"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-navy-950 text-lg font-bold tracking-tight">{t('siteName')}</span>
    </span>
  );
}
