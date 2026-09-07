import { cn } from '@/utils/cn';

/** Shared input chrome for text-like controls (kept out of component files). */
export function inputClasses(invalid = false): string {
  return cn(
    'w-full rounded-lg border bg-surface-raised px-3.5 py-2.5 text-sm text-ink shadow-xs transition-colors',
    'placeholder:text-ink-muted/70',
    'focus-visible:outline-none focus-visible:border-navy-600 focus-visible:ring-2 focus-visible:ring-navy-600/40',
    'disabled:cursor-not-allowed disabled:bg-navy-50 disabled:text-ink-muted',
    invalid ? 'border-danger-700' : 'border-line-strong hover:border-navy-300',
  );
}
