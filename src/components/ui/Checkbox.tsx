import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  description?: string;
};

/** Self-labeled checkbox (do not wrap in <Field>). */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, className, id, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className={cn('flex items-start gap-2.5', className)}>
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        className="accent-navy-800 mt-0.5 size-4 shrink-0 disabled:cursor-not-allowed"
        {...rest}
      />
      <label htmlFor={inputId} className="text-ink text-sm leading-snug">
        {label}
        {description && <span className="text-ink-muted block text-xs">{description}</span>}
      </label>
    </div>
  );
});
