import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

/**
 * Internal style-guide scaffolding. This page is a development tool, not
 * part of the public site — labels are intentionally English-only
 * (see docs/DEVELOPMENT.md "Internal tooling").
 */

interface GuideSectionProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function GuideSection({ id, title, description, children }: GuideSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mt-16 scroll-mt-24">
      <h2 id={`${id}-heading`} className="text-navy-950 text-2xl font-bold">
        {title}
      </h2>
      {description && <p className="text-ink-muted mt-2 max-w-2xl text-sm">{description}</p>}
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}

interface DemoBlockProps {
  label: string;
  children: ReactNode;
  className?: string;
  /** Render on a dark background (for light-on-dark examples). */
  dark?: boolean;
}

export function DemoBlock({ label, children, className, dark }: DemoBlockProps) {
  return (
    <figure className={cn('border-line rounded-xl border p-5', className)}>
      <figcaption
        className={cn(
          'mb-4 text-xs font-semibold tracking-widest uppercase',
          dark ? 'text-gold-300' : 'text-ink-muted',
        )}
      >
        {label}
      </figcaption>
      <div className={cn(dark && 'bg-navy-950 rounded-lg p-5')}>{children}</div>
    </figure>
  );
}

interface SwatchProps {
  name: string;
  value: string;
}

export function Swatch({ name, value }: SwatchProps) {
  return (
    <div className="border-line overflow-hidden rounded-lg border">
      <div className="h-14" style={{ backgroundColor: value }} />
      <div className="bg-surface-raised px-3 py-2">
        <p className="text-navy-900 text-xs font-semibold">{name}</p>
        <p className="text-ink-muted font-mono text-[10px] uppercase">{value}</p>
      </div>
    </div>
  );
}
