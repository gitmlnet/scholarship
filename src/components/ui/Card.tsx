import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md';
  as?: 'div' | 'article' | 'section' | 'li';
}

/** Raised surface for grouping content. */
export function Card({ children, className, padding = 'md', as: Tag = 'div' }: CardProps) {
  return (
    <Tag
      className={cn(
        'border-line bg-surface-raised shadow-card rounded-xl border',
        padding === 'md' && 'p-6',
        padding === 'sm' && 'p-4',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
