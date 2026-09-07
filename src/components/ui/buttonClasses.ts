import { cn } from '@/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'dark';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
  // Warm gold accent — the program's primary call to action.
  primary:
    'bg-gold-400 text-navy-950 hover:bg-gold-300 active:bg-gold-500 focus-visible:outline-navy-800',
  secondary:
    'border border-navy-200 bg-surface-raised text-navy-900 hover:border-navy-400 hover:bg-navy-50 focus-visible:outline-navy-700',
  ghost: 'text-navy-800 hover:bg-navy-100/70 focus-visible:outline-navy-700',
  dark: 'bg-navy-800 text-white hover:bg-navy-900 active:bg-navy-950 focus-visible:outline-navy-500',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

/** Shared button styling (kept out of Button.tsx for fast-refresh isolation). */
export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md') {
  return cn(base, variants[variant], sizes[size]);
}
