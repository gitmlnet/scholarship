import { createContext, useContext } from 'react';

/** Wiring provided by <Field>; controls consume it to stay accessible. */
export interface FieldContextValue {
  id: string;
  hintId?: string;
  errorId?: string;
  describedBy?: string;
  invalid: boolean;
  required: boolean;
}

export const FieldContext = createContext<FieldContextValue | null>(null);

/** Returns the surrounding Field's wiring, or null when used standalone. */
export function useField(): FieldContextValue | null {
  return useContext(FieldContext);
}
