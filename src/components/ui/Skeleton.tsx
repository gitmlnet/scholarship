import { cn } from '@/utils/cn';

/** Loading placeholder block (respects prefers-reduced-motion via tokens.css). */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('bg-navy-100/80 animate-pulse rounded-md', className)} />
  );
}
