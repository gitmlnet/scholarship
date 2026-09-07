import { useEffect, useId, useRef, type ReactNode } from 'react';
import { XIcon } from './icons';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Action row (buttons) rendered in the footer. */
  footer?: ReactNode;
  /** Accessible label for the close button — pass a translated string. */
  closeLabel?: string;
}

/**
 * Accessible dialog on the native <dialog> element: Esc closes, focus is
 * trapped and restored by the browser, the backdrop dims via ::backdrop,
 * and background scrolling locks while open.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  closeLabel = 'Close',
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // Open/close is driven by the `open` prop (single source of truth).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', ''); // fallback (jsdom)
    } else if (!open && dialog.open) {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    }
  }, [open]);

  // Notify the owner when the dialog closes (Esc, backdrop, or close button).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    const handleCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };
    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('cancel', handleCancel);
    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    // The dialog element itself is only clickable at the backdrop area.
    if (event.target === dialogRef.current) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClick={handleBackdropClick}
      className="border-line bg-surface-raised shadow-lift backdrop:bg-navy-950/60 m-auto w-[min(32rem,calc(100vw-2rem))] rounded-xl border p-0"
    >
      <div className="border-line flex items-center justify-between gap-4 border-b px-6 py-4">
        <h2 id={titleId} className="text-navy-950 text-lg font-bold">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="text-ink-muted hover:bg-navy-50 hover:text-navy-900 rounded-lg p-1.5 transition-colors"
        >
          <XIcon className="size-5" />
        </button>
      </div>
      <div className="text-ink px-6 py-5 text-sm">{children}</div>
      {footer && (
        <div className="border-line flex flex-wrap justify-end gap-3 border-t px-6 py-4">
          {footer}
        </div>
      )}
    </dialog>
  );
}
