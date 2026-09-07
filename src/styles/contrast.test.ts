import { describe, expect, it } from 'vitest';
import tokensCss from './tokens.css?raw';
import {
  AA_CONTRAST_PAIRS,
  contrastRatio,
  formatRatio,
  parseColorTokens,
  tokenColor,
} from '@/utils/designTokens';

/**
 * Design-token gate: every foreground/background pair the UI relies on must
 * meet WCAG AA. The pair list lives in utils/designTokens.ts and is shared
 * with the internal style guide, so both stay in sync automatically.
 */
const tokens = parseColorTokens(tokensCss);

describe('tokens.css sanity', () => {
  it('exposes the full color scale', () => {
    expect(tokens.size).toBeGreaterThan(30);
    expect(tokens.get('navy-800')).toBe('#142542');
    expect(tokens.get('gold-400')).toBe('#d6ac3f');
  });
});

describe('WCAG AA contrast (AA_CONTRAST_PAIRS)', () => {
  it.each(AA_CONTRAST_PAIRS)(
    '$foreground on $background for "$usage"',
    ({ foreground, background, usage, minimum }) => {
      const ratio = contrastRatio(tokenColor(tokens, foreground), tokenColor(tokens, background));
      expect(
        ratio >= minimum,
        `${foreground} on ${background} for "${usage}" — got ${formatRatio(ratio)}:1, need ${minimum}:1`,
      ).toBe(true);
    },
  );
});
