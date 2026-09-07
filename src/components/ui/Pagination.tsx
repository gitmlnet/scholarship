import { cn } from '@/utils/cn';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  /** Accessible name for the nav — pass a translated string. */
  label: string;
  previousLabel?: string;
  nextLabel?: string;
  className?: string;
}

type PageEntry = number | 'ellipsis';

/** Compact page list: all pages when few, window + ellipses when many. */
function buildPageList(page: number, pageCount: number): PageEntry[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }
  const pages = new Set<number>([1, pageCount, page - 1, page, page + 1]);
  const sorted = [...pages]
    .filter((value) => value >= 1 && value <= pageCount)
    .sort((a, b) => a - b);
  const entries: PageEntry[] = [];
  let previous = 0;
  for (const value of sorted) {
    if (value - previous > 1) entries.push('ellipsis');
    entries.push(value);
    previous = value;
  }
  return entries;
}

export function Pagination({
  page,
  pageCount,
  onChange,
  label,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  className,
}: PaginationProps) {
  const pageButton = (value: number) => {
    const isActive = value === page;
    return (
      <button
        key={value}
        type="button"
        aria-current={isActive ? 'page' : undefined}
        aria-label={`Page ${value}`}
        onClick={() => onChange(value)}
        className={cn(
          'size-9 rounded-lg text-sm font-medium transition-colors',
          isActive
            ? 'bg-navy-800 text-white'
            : 'text-ink-muted hover:bg-navy-50 hover:text-navy-900',
        )}
      >
        {value}
      </button>
    );
  };

  return (
    <nav aria-label={label} className={cn('flex items-center gap-1', className)}>
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label={previousLabel}
        className="text-ink-muted hover:bg-navy-50 hover:text-navy-900 flex size-9 items-center justify-center rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeftIcon className="size-4" />
      </button>

      {buildPageList(page, pageCount).map((entry, index) =>
        entry === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className="text-ink-muted px-1.5 text-sm"
          >
            …
          </span>
        ) : (
          pageButton(entry)
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pageCount}
        aria-label={nextLabel}
        className="text-ink-muted hover:bg-navy-50 hover:text-navy-900 flex size-9 items-center justify-center rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRightIcon className="size-4" />
      </button>
    </nav>
  );
}
