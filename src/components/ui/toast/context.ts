import { createContext, useContext } from 'react';
import type { AlertVariant } from '../Alert';

export interface ToastInput {
  title: string;
  description?: string;
  variant?: AlertVariant;
}

export interface ToastItem extends ToastInput {
  id: number;
}

export interface ToastContextValue {
  /** Show a toast (auto-dismisses; max 3 stay stacked). */
  push: (toast: ToastInput) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within <ToastProvider>');
  return context;
}
