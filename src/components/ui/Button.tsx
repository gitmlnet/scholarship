import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router';
import { cn } from '@/utils/cn';
import { buttonClasses, type ButtonSize, type ButtonVariant } from './buttonClasses';
import { Spinner } from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, disables, and sets aria-busy (for async actions). */
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({
  variant,
  size,
  isLoading,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(buttonClasses(variant, size), className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {isLoading && <Spinner className="size-4" />}
      {children}
    </button>
  );
}

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

/** Router-link styled as a button (keeps keyboard/semantics of a link). */
export function ButtonLink({ variant, size, className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={cn(buttonClasses(variant, size), className)} {...rest}>
      {children}
    </Link>
  );
}
