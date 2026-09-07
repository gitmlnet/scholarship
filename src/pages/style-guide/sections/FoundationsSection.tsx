import tokensCss from '@/styles/tokens.css?raw';
import {
  AA_CONTRAST_PAIRS,
  contrastRatio,
  formatRatio,
  parseColorTokens,
  tokenColor,
} from '@/utils/designTokens';
import { Badge } from '@/components/ui/Badge';
import { DemoBlock, GuideSection, Swatch } from '../bits';

const tokens = parseColorTokens(tokensCss);

const GROUPS: { title: string; names: string[] }[] = [
  {
    title: 'Navy (primary)',
    names: [
      'navy-50',
      'navy-100',
      'navy-200',
      'navy-300',
      'navy-400',
      'navy-500',
      'navy-600',
      'navy-700',
      'navy-800',
      'navy-900',
      'navy-950',
    ],
  },
  {
    title: 'Gold (accent)',
    names: [
      'gold-50',
      'gold-100',
      'gold-200',
      'gold-300',
      'gold-400',
      'gold-500',
      'gold-600',
      'gold-700',
      'gold-800',
      'gold-900',
    ],
  },
  {
    title: 'Status',
    names: [
      'success-50',
      'success-100',
      'success-700',
      'success-800',
      'danger-50',
      'danger-100',
      'danger-700',
      'danger-800',
    ],
  },
  {
    title: 'Surfaces & ink',
    names: ['surface', 'surface-raised', 'ink', 'ink-muted', 'line', 'line-strong'],
  },
];

function TypographySpecimen({
  label,
  className,
  children,
}: {
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-line border-t pt-4 first:border-t-0 first:pt-0">
      <p className="text-ink-muted mb-1 font-mono text-[10px] tracking-wider uppercase">{label}</p>
      <p className={className}>{children}</p>
    </div>
  );
}

export function FoundationsSection() {
  return (
    <GuideSection
      id="foundations"
      title="1 · Foundations"
      description="Tokens are the single source of truth (src/styles/tokens.css). Components never use raw colors — and every pair below is verified for WCAG AA in CI (src/styles/contrast.test.ts)."
    >
      <div className="space-y-6">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <p className="text-navy-900 mb-2 text-sm font-semibold">{group.title}</p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {group.names.map((name) => (
                <Swatch key={name} name={name} value={tokenColor(tokens, name)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <DemoBlock label="Verified AA contrast pairs (enforced by tests)">
        <ul className="grid list-none gap-2 sm:grid-cols-2">
          {AA_CONTRAST_PAIRS.map((pair) => {
            const ratio = contrastRatio(
              tokenColor(tokens, pair.foreground),
              tokenColor(tokens, pair.background),
            );
            return (
              <li
                key={`${pair.foreground}-${pair.background}-${pair.usage}`}
                className="bg-surface flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-xs"
              >
                <span className="text-ink min-w-0 truncate">
                  <span className="text-navy-900 font-semibold">{pair.foreground}</span>
                  {' on '}
                  <span className="text-navy-900 font-semibold">{pair.background}</span>
                  <span className="text-ink-muted"> — {pair.usage}</span>
                </span>
                <Badge variant={ratio >= pair.minimum ? 'success' : 'danger'}>
                  {formatRatio(ratio)}
                </Badge>
              </li>
            );
          })}
        </ul>
      </DemoBlock>

      <DemoBlock label="Typography — serif display + humanist sans (English / বাংলা)">
        <div className="space-y-5">
          <TypographySpecimen
            label="text-display-lg · font-display"
            className="text-display-lg text-navy-950"
          >
            Your Potential Deserves an Opportunity.
          </TypographySpecimen>
          <TypographySpecimen
            label="text-display-lg · বাংলা"
            className="text-display-lg text-navy-950"
          >
            আপনার সম্ভাবনা একটি সুযোগের যোগ্য।
          </TypographySpecimen>
          <TypographySpecimen label="text-display" className="text-display text-navy-950">
            Excellence shapes tomorrow.
          </TypographySpecimen>
          <TypographySpecimen label="text-2xl · h2" className="text-navy-950 text-2xl font-bold">
            Section heading level two
          </TypographySpecimen>
          <TypographySpecimen label="text-base · body" className="text-ink max-w-prose">
            One application and one rigorous examination open a pathway to recognition, support, and
            opportunity for students in Grades 4–10. একটি আবেদন আর একটি পরীক্ষা — স্বীকৃতি ও সুযোগের
            পথ।
          </TypographySpecimen>
          <TypographySpecimen
            label="text-sm · muted"
            className="text-ink-muted max-w-prose text-sm"
          >
            Supporting copy uses the muted ink token to keep hierarchy clear without losing
            contrast.
          </TypographySpecimen>
          <TypographySpecimen
            label="eyebrow"
            className="text-gold-700 text-xs font-semibold tracking-widest uppercase"
          >
            ScholarSphere Excellence Scholarship · 2026
          </TypographySpecimen>
        </div>
      </DemoBlock>
    </GuideSection>
  );
}
