import type { ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface TableProps {
  /** Screen-reader-only caption — required for accessible data tables. */
  caption: string;
  children: ReactNode;
  className?: string;
}

/** Semantic, consistently styled table (used by admin + results later). */
export function Table({ caption, children, className }: TableProps) {
  return (
    <div className="border-line bg-surface-raised shadow-card overflow-x-auto rounded-xl border">
      <table className={cn('w-full border-collapse text-left text-sm', className)}>
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-navy-50/70">
      <tr>{children}</tr>
    </thead>
  );
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-line divide-y">{children}</tbody>;
}

export function TRow({ children, className }: { children: ReactNode; className?: string }) {
  return <tr className={cn('hover:bg-navy-50/50 transition-colors', className)}>{children}</tr>;
}

interface ThProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
}

export function Th({ children, scope = 'col', className, ...rest }: ThProps) {
  return (
    <th
      scope={scope}
      className={cn(
        'border-line text-ink-muted border-b px-4 py-3 text-xs font-semibold tracking-wide uppercase',
        className,
      )}
      {...rest}
    >
      {children}
    </th>
  );
}

interface TdProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
}

export function Td({ children, className, ...rest }: TdProps) {
  return (
    <td className={cn('text-ink px-4 py-3', className)} {...rest}>
      {children}
    </td>
  );
}
