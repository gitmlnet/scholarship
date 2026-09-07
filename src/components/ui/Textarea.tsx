import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { useField } from './field-context';
import { inputClasses } from './inputClasses';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid: invalidProp, id, rows = 4, ...rest },
  ref,
) {
  const field = useField();
  const invalid = invalidProp ?? field?.invalid ?? false;
  return (
    <textarea
      ref={ref}
      id={id ?? field?.id}
      rows={rows}
      aria-invalid={invalid || undefined}
      aria-describedby={field?.describedBy}
      aria-required={field?.required || undefined}
      className={cn(inputClasses(invalid), 'resize-y', className)}
      {...rest}
    />
  );
});
