import { useRef, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  /** Accessible name for the tab list — pass a translated string. */
  label: string;
  className?: string;
}

/**
 * Accessible tab list (WAI-ARIA Tabs pattern): roving tabindex, arrow-key
 * navigation with automatic activation, Home/End support.
 */
export function Tabs({ items, activeId, onChange, label, className }: TabsProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const focusTab = (id: string) => {
    const tabs = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [],
    );
    tabs.find((tab) => tab.dataset.tabId === id)?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const currentIndex = Math.max(
      0,
      items.findIndex((item) => item.id === activeId),
    );
    let nextIndex: number | undefined;
    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % items.length;
        break;
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + items.length) % items.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = items.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const next = items[nextIndex];
    if (next) {
      onChange(next.id);
      focusTab(next.id);
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={cn('border-line flex gap-1 overflow-x-auto border-b', className)}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            data-tab-id={item.id}
            id={`tab-${item.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${item.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(item.id)}
            className={cn(
              'shrink-0 rounded-t-lg border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'border-gold-500 text-navy-950'
                : 'text-ink-muted hover:border-navy-300 hover:text-navy-800 border-transparent',
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

interface TabPanelProps {
  id: string;
  activeId: string;
  children: ReactNode;
  className?: string;
}

/** Panel counterpart to Tabs — renders only while active. */
export function TabPanel({ id, activeId, children, className }: TabPanelProps) {
  if (id !== activeId) return null;
  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      tabIndex={0}
      className={cn('pt-4 focus-visible:outline-none', className)}
    >
      {children}
    </div>
  );
}
