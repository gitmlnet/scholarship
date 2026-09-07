import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { CheckCircleIcon, InfoIcon, WarningIcon, XIcon } from './icons';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  info: 'bg-navy-50 text-navy-800 [&_svg]:text-navy-700',
  success: 'bg-success-50 text-success-800 [&_svg]:text-success-700',
  warning: 'bg-gold-50 text-gold-800 [&_svg]:text-gold-700',
  danger: 'bg-danger-50 text-danger-800 [&_svg]:text-danger-700',
};

const VARIANT_ICONS: Record<AlertVariant, typeof InfoIcon> = {
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: WarningIcon,
  danger: XIcon,
};

interface AlertProps {
  variant?: AlertVariant;
  title: string;
  children?: ReactNode;
  className?: string;
}

/**
 * Inline message for important state. Danger alerts announce assertively
 * (role=alert); everything else is polite (role=status).
 */
export function Alert({ variant = 'info', title, children, className }: AlertProps) {
  const Icon = VARIANT_ICONS[variant];
  return (
    <div
      role={variant === 'danger' ? 'alert' : 'status'}
      className={cn('flex gap-3 rounded-xl p-4 text-sm', VARIANT_CLASSES[variant], className)}
    >
      <Icon className="mt-0.5 size-5 shrink-0" />
      <div className="min-w-0">
        <p className="leading-snug font-semibold">{title}</p>
        {children && <div className="mt-1 leading-relaxed">{children}</div>}
      </div>
    </div>
  );
}
