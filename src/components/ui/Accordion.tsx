import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDownIcon } from './icons';

export interface AccordionItem {
  id: string;
  summary: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  /**
   * Group name — details elements sharing a name open exclusively
   * (one open at a time) in supporting browsers.
   */
  exclusiveName?: string;
}

/**
 * Disclosure list on native <details>/<summary>: keyboard and screen-reader
 * support come for free, no JS state to get wrong.
 */
export function Accordion({ items, className, exclusiveName }: AccordionProps) {
  return (
    <div
      className={cn(
        'divide-line border-line bg-surface-raised divide-y rounded-xl border',
        className,
      )}
    >
      {items.map((item) => (
        <details key={item.id} name={exclusiveName} className="group px-5 open:pb-1">
          <summary className="text-navy-900 flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-left text-sm font-semibold [&::-webkit-details-marker]:hidden">
            {item.summary}
            <ChevronDownIcon className="text-ink-muted size-4 shrink-0 transition-transform duration-200 group-open:rotate-180" />
          </summary>
          <div className="text-ink-muted pr-8 pb-4 text-sm leading-relaxed">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
