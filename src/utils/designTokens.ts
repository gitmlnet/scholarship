/**
 * Design-token utilities: parse the token CSS (single source of truth) and
 * compute WCAG contrast ratios. Used by the AA contrast test and the
 * /style-guide color section — parsing the real file means the docs can
 * never drift from the tokens.
 */

export type ColorTokenMap = Map<string, string>;

/** Parse `--color-*: #rrggbb` declarations from the tokens CSS. */
export function parseColorTokens(css: string): ColorTokenMap {
  const tokens: ColorTokenMap = new Map();
  const pattern = /--(color-[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*;/g;
  for (const match of css.matchAll(pattern)) {
    const name = match[1] ?? '';
    const value = (match[2] ?? '').toLowerCase();
    tokens.set(name.replace(/^color-/, ''), value);
  }
  return tokens;
}

/** WCAG 2.x relative luminance of an sRGB hex color. */
export function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map((offset) => {
    const channel = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  const [red, green, blue] = channels as [number, number, number];
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

/** WCAG contrast ratio between two hex colors (1…21). */
export function contrastRatio(foreground: string, background: string): number {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  const [lighter, darker] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (lighter + 0.05) / (darker + 0.05);
}

/** "4.5:1"-style formatting for display. */
export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}

/** Fetch a token color; throws a helpful error for unknown token names. */
export function tokenColor(tokens: ColorTokenMap, name: string): string {
  const value = tokens.get(name);
  if (!value) throw new Error(`Unknown color token: "${name}"`);
  return value;
}

/** A text/background pair that components actually use, with its AA target. */
export interface ContrastPair {
  foreground: string;
  background: string;
  /** 4.5 for normal text; 3.0 for large text (≥24px / 19px bold) or UI parts. */
  minimum: 3 | 4.5;
  usage: string;
}

/**
 * The audited AA pairs — shared by the contrast test (enforcement) and the
 * /style-guide color section (documentation). One list, no drift.
 */
export const AA_CONTRAST_PAIRS: ContrastPair[] = [
  // Body text
  { foreground: 'ink', background: 'surface', minimum: 4.5, usage: 'body text on page surface' },
  { foreground: 'ink', background: 'surface-raised', minimum: 4.5, usage: 'body text on cards' },
  {
    foreground: 'ink-muted',
    background: 'surface',
    minimum: 4.5,
    usage: 'muted text on page surface',
  },
  {
    foreground: 'ink-muted',
    background: 'surface-raised',
    minimum: 4.5,
    usage: 'muted text on cards',
  },
  {
    foreground: 'ink-muted',
    background: 'navy-50',
    minimum: 4.5,
    usage: 'muted text on tinted panels',
  },

  // Buttons
  { foreground: 'navy-950', background: 'gold-400', minimum: 4.5, usage: 'primary button text' },
  {
    foreground: 'navy-950',
    background: 'gold-300',
    minimum: 4.5,
    usage: 'primary button hover text',
  },
  {
    foreground: 'navy-900',
    background: 'surface-raised',
    minimum: 4.5,
    usage: 'secondary button text',
  },
  {
    foreground: 'navy-800',
    background: 'navy-100',
    minimum: 4.5,
    usage: 'ghost/tinted button text',
  },

  // Dark buttons & surfaces
  { foreground: 'surface-raised', background: 'navy-800', minimum: 4.5, usage: 'dark button text' },
  {
    foreground: 'surface-raised',
    background: 'navy-900',
    minimum: 4.5,
    usage: 'text on navy sections',
  },
  { foreground: 'navy-200', background: 'navy-950', minimum: 4.5, usage: 'footer links' },
  { foreground: 'navy-300', background: 'navy-950', minimum: 4.5, usage: 'footer muted text' },
  { foreground: 'gold-300', background: 'navy-950', minimum: 4.5, usage: 'gold links on navy' },
  {
    foreground: 'gold-300',
    background: 'navy-900',
    minimum: 4.5,
    usage: 'gold accents on navy sections',
  },
  {
    foreground: 'surface-raised',
    background: 'navy-700',
    minimum: 4.5,
    usage: 'danger-inverse / navy-700 text',
  },

  // Eyebrows & emphasis
  {
    foreground: 'gold-700',
    background: 'surface',
    minimum: 4.5,
    usage: 'eyebrow text on page surface',
  },
  {
    foreground: 'gold-700',
    background: 'surface-raised',
    minimum: 4.5,
    usage: 'eyebrow text on cards',
  },

  // Badges
  { foreground: 'navy-800', background: 'navy-100', minimum: 4.5, usage: 'navy badge' },
  { foreground: 'gold-800', background: 'gold-100', minimum: 4.5, usage: 'gold badge' },
  { foreground: 'success-800', background: 'success-100', minimum: 4.5, usage: 'success badge' },
  { foreground: 'danger-800', background: 'danger-100', minimum: 4.5, usage: 'danger badge' },
  { foreground: 'ink-muted', background: 'navy-50', minimum: 4.5, usage: 'neutral badge' },

  // Alerts
  { foreground: 'danger-800', background: 'danger-50', minimum: 4.5, usage: 'danger alert text' },
  {
    foreground: 'success-800',
    background: 'success-50',
    minimum: 4.5,
    usage: 'success alert text',
  },
  { foreground: 'gold-800', background: 'gold-50', minimum: 4.5, usage: 'warning alert text' },
  { foreground: 'navy-800', background: 'navy-50', minimum: 4.5, usage: 'info alert text' },

  // Form controls
  { foreground: 'ink', background: 'surface-raised', minimum: 4.5, usage: 'input text' },
  {
    foreground: 'danger-700',
    background: 'surface-raised',
    minimum: 4.5,
    usage: 'field error text',
  },
  {
    foreground: 'danger-800',
    background: 'danger-50',
    minimum: 4.5,
    usage: 'error alert / danger states',
  },
  { foreground: 'success-700', background: 'success-50', minimum: 4.5, usage: 'success messages' },

  // UI components (non-text, ≥ 3:1 — WCAG 1.4.11)
  {
    foreground: 'navy-700',
    background: 'surface',
    minimum: 3,
    usage: 'focus outline on light surfaces',
  },
  {
    foreground: 'navy-600',
    background: 'surface-raised',
    minimum: 3,
    usage: 'input focus border on cards',
  },
  {
    foreground: 'danger-700',
    background: 'surface-raised',
    minimum: 3,
    usage: 'invalid input border',
  },
  {
    foreground: 'ink-muted',
    background: 'surface-raised',
    minimum: 3,
    usage: 'input border (line-strong)',
  },
];
