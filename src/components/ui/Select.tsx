import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { useField } from './field-context';
import { inputClasses } from './inputClasses';
import { ChevronDownIcon } from './icons';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
};

/** Native select with custom chevron (full keyboard + AT support for free). */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, invalid: invalidProp, id, children, ...rest },
  ref,
) {
  const field = useField();
  const invalid = invalidProp ?? field?.invalid ?? false;
  return (
    <div className={cn('relative', className)}>
      <select
        ref={ref}
        id={id ?? field?.id}
        aria-invalid={invalid || undefined}
        aria-describedby={field?.describedBy}
        aria-required={field?.required || undefined}
        className={cn(inputClasses(invalid), 'appearance-none pr-10')}
        {...rest}
      >
        {children}
      </select>
      <ChevronDownIcon className="text-ink-muted pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2" />
    </div>
  );
});
