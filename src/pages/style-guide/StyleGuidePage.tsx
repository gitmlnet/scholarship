import { Container } from '@/components/ui/Container';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { DataSection } from './sections/DataSection';
import { FeedbackSection } from './sections/FeedbackSection';
import { FormsSection } from './sections/FormsSection';
import { FoundationsSection } from './sections/FoundationsSection';
import { OverlaysSection } from './sections/OverlaysSection';

const SECTIONS = [
  { id: 'foundations', label: 'Foundations' },
  { id: 'forms', label: 'Forms' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'overlays', label: 'Overlays & navigation' },
  { id: 'data', label: 'Data display' },
];

/**
 * Internal design-system reference — a development tool, not public content.
 * English-only by design (docs/DEVELOPMENT.md "Internal tooling"); excluded
 * from robots and navigation.
 */
export default function StyleGuidePage() {
  useDocumentMeta('Style Guide', 'Internal ScholarSphere design-system reference.', {
    noindex: true,
  });

  return (
    <Container as="section" className="max-w-5xl py-12 md:py-16">
      <p className="text-gold-700 text-xs font-semibold tracking-widest uppercase">
        Internal · design system
      </p>
      <h1 className="text-navy-950 mt-3 text-3xl font-bold md:text-4xl">
        ScholarSphere Design System
      </h1>
      <p className="text-ink-muted mt-4 max-w-2xl">
        Every primitive, token, and pattern used across the platform — with WCAG AA contrast
        verified by the test suite. This page is excluded from navigation and search indexes.
      </p>

      <nav aria-label="Style guide sections" className="mt-8 flex flex-wrap gap-2">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="border-line-strong bg-surface-raised text-navy-800 hover:border-navy-300 hover:bg-navy-50 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors"
          >
            {section.label}
          </a>
        ))}
      </nav>

      <FoundationsSection />
      <FormsSection />
      <FeedbackSection />
      <OverlaysSection />
      <DataSection />
    </Container>
  );
}
