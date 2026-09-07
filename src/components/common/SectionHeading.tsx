import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface SectionHeadingProps {
  title: string;
  eyebrow?: string;
  description?: string;
  align?: 'left' | 'center';
  /** Optional actions rendered on the opposite side (e.g. "view all"). */
  actions?: ReactNode;
}

export function SectionHeading({
  title,
  eyebrow,
  description,
  align = 'left',
  actions,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-8 flex flex-wrap items-end gap-4',
        align === 'center' ? 'flex-col items-center text-center' : 'justify-between',
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && (
          <p className="text-gold-700 text-xs font-semibold tracking-widest uppercase">{eyebrow}</p>
        )}
        <h2 className="text-navy-950 mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {description && <p className="text-ink-muted mt-3">{description}</p>}
      </div>
      {actions}
    </div>
  );
}
