import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { InboxIcon } from './icons';

interface EmptyStateProps {
  title: string;
  description?: string;
  /** Optional call to action rendered below the text. */
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

/** Friendly placeholder for empty lists/sections (never a blank screen). */
export function EmptyState({ title, description, action, icon, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'border-line-strong bg-surface-raised rounded-xl border border-dashed px-6 py-12 text-center',
        className,
      )}
    >
      <span className="bg-navy-50 text-navy-500 mx-auto flex size-12 items-center justify-center rounded-full">
        {icon ?? <InboxIcon className="size-6" />}
      </span>
      <p className="text-navy-900 mt-4 font-semibold">{title}</p>
      {description && <p className="text-ink-muted mx-auto mt-1 max-w-sm text-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
