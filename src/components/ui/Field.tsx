import { useId, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { FieldContext } from './field-context';

interface FieldProps {
  label: string;
  /** Help text — stays visible even when an error is shown. */
  hint?: string;
  /** Error message; presence marks the control invalid. */
  error?: string;
  isRequired?: boolean;
  className?: string;
  /** A single control (TextInput, Select, Textarea…). */
  children: ReactNode;
}

/**
 * Accessible form field wrapper: generates ids and wires label, hint, and
 * error to the control through FieldContext (aria-describedby / aria-invalid
 * / aria-required). Controls bring their own labels (Checkbox, Radio) and
 * should not be wrapped in Field.
 */
export function Field({ label, hint, error, isRequired, className, children }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <FieldContext.Provider
        value={{
          id,
          hintId,
          errorId,
          describedBy,
          invalid: Boolean(error),
          required: Boolean(isRequired),
        }}
      >
        <label htmlFor={id} className="text-navy-900 text-sm font-medium">
          {label}
          {isRequired && (
            <span aria-hidden="true" className="text-danger-700 ml-0.5">
              *
            </span>
          )}
        </label>
        {children}
        {hint && (
          <p id={hintId} className="text-ink-muted text-xs leading-relaxed">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-danger-700 text-xs font-medium">
            {error}
          </p>
        )}
      </FieldContext.Provider>
    </div>
  );
}
