import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type BadgeVariant = 'navy' | 'gold' | 'success' | 'danger' | 'neutral';

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  navy: 'bg-navy-100 text-navy-800',
  gold: 'bg-gold-100 text-gold-800',
  success: 'bg-success-100 text-success-800',
  danger: 'bg-danger-100 text-danger-800',
  neutral: 'bg-navy-50 text-ink-muted',
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

/** Compact status/category label (AA-verified pairs — see contrast test). */
export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
