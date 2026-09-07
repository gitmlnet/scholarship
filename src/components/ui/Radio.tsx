import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type RadioProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  description?: string;
};

/** Self-labeled radio option — group options with <fieldset><legend>. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
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
        type="radio"
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
