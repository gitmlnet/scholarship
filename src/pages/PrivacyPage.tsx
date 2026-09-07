import { useTranslation } from 'react-i18next';
import { Alert } from '@/components/ui/Alert';
import { PageShell } from '@/components/common/PageShell';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

interface LegalSection {
  heading: string;
  paragraphs: string[];
}

/** Privacy policy (demo-honest: everything stays in the browser). */
export default function PrivacyPage() {
  const { t } = useTranslation(['pages', 'common']);

  useDocumentMeta(t('privacy.title'), t('privacy.description'));

  const sections = t('privacy.sections', { returnObjects: true }) as LegalSection[];

  return (
    <PageShell title={t('privacy.title')} description={t('privacy.description')}>
      <div className="max-w-3xl">
        <Alert variant="info" title={t('privacy.intro')} />

        <div className="mt-10 space-y-10">
          {sections.map((section, index) => (
            <section key={section.heading} aria-labelledby={`privacy-section-${index}`}>
              <h2
                id={`privacy-section-${index}`}
                className="text-navy-950 text-xl font-bold tracking-tight"
              >
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="text-ink leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
