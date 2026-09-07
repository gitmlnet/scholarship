export type ClassValue = string | false | null | undefined;

/** Tiny class-name combiner (deliberately dependency-free). */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
