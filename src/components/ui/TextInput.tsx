import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { useField } from './field-context';
import { inputClasses } from './inputClasses';

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Overrides the invalid state derived from a surrounding Field. */
  invalid?: boolean;
};

/** Text input wired to Field automatically (works standalone too). */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { className, invalid: invalidProp, id, ...rest },
  ref,
) {
  const field = useField();
  const invalid = invalidProp ?? field?.invalid ?? false;
  return (
    <input
      ref={ref}
      id={id ?? field?.id}
      aria-invalid={invalid || undefined}
      aria-describedby={field?.describedBy}
      aria-required={field?.required || undefined}
      className={cn(inputClasses(invalid), className)}
      {...rest}
    />
  );
});
