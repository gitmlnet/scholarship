import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { ToastContext, type ToastInput, type ToastItem } from './context';
import { CheckCircleIcon, InfoIcon, WarningIcon, XIcon } from '../icons';
import type { AlertVariant } from '../Alert';

const AUTO_DISMISS_MS = 5000;
const MAX_VISIBLE = 3;

const VARIANT_ICON_CLASSES: Record<AlertVariant, string> = {
  info: 'text-navy-700',
  success: 'text-success-700',
  warning: 'text-gold-700',
  danger: 'text-danger-700',
};

const VARIANT_ICONS: Record<AlertVariant, typeof InfoIcon> = {
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: WarningIcon,
  danger: XIcon,
};

interface ToastProviderProps {
  children: ReactNode;
  /** Accessible label for the dismiss button — pass a translated string. */
  closeLabel?: string;
}

/**
 * Lightweight toast notifications. Announcements flow through an
 * aria-live="polite" region; each toast can also be dismissed manually.
 */
export function ToastProvider({
  children,
  closeLabel = 'Dismiss notification',
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (input: ToastInput) => {
      nextId.current += 1;
      const id = nextId.current;
      setToasts((current) => [...current, { ...input, id }].slice(-MAX_VISIBLE));
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), AUTO_DISMISS_MS),
      );
    },
    [dismiss],
  );

  // Clear pending timers on unmount.
  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      activeTimers.forEach((timer) => clearTimeout(timer));
      activeTimers.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
      >
        {toasts.map((toast) => {
          const variant = toast.variant ?? 'info';
          const Icon = VARIANT_ICONS[variant];
          return (
            <div
              key={toast.id}
              className="border-line bg-surface-raised shadow-lift pointer-events-auto flex items-start gap-3 rounded-xl border p-4"
            >
              <Icon className={cn('mt-0.5 size-5 shrink-0', VARIANT_ICON_CLASSES[variant])} />
              <div className="min-w-0 flex-1">
                <p className="text-navy-950 text-sm font-semibold">{toast.title}</p>
                {toast.description && (
                  <p className="text-ink-muted mt-0.5 text-xs leading-relaxed">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label={closeLabel}
                className="text-ink-muted hover:bg-navy-50 hover:text-navy-900 rounded-md p-1 transition-colors"
              >
                <XIcon className="size-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
