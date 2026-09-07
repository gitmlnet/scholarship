import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router';
import { cn } from '@/utils/cn';
import { buttonClasses, type ButtonSize, type ButtonVariant } from './buttonClasses';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export function Button({ variant, size, className, children, ...rest }: ButtonProps) {
  return (
    <button className={cn(buttonClasses(variant, size), className)} {...rest}>
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
