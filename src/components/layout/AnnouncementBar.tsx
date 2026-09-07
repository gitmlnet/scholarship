import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useSettings } from '@/hooks/useSettings';
import { useLocalized } from '@/hooks/useLocalized';
import { Container } from '@/components/ui/Container';

/** Program announcement strip (content comes from program settings via the API). */
export function AnnouncementBar() {
  const { t } = useTranslation('layout');
  const { pick } = useLocalized();
  const { data: settings } = useSettings();
  const [dismissed, setDismissed] = useState(false);

  if (!settings || dismissed) return null;

  return (
    <div className="bg-navy-950 text-navy-100">
      <Container className="relative flex items-center justify-center gap-2 py-2 pr-10 text-center text-sm">
        <span
          aria-hidden="true"
          className="bg-gold-400 hidden h-1.5 w-1.5 shrink-0 rounded-full sm:block"
        />
        <p>
          {pick(settings.announcement)}{' '}
          <Link
            to="/notices"
            className="text-gold-300 hover:text-gold-200 font-medium underline underline-offset-2 focus-visible:outline-white"
          >
            {t('announcement.link')}
          </Link>
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label={t('announcement.dismiss')}
          className="text-navy-200 absolute top-1/2 right-3 -translate-y-1/2 rounded p-1 hover:text-white focus-visible:outline-white"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true" focusable="false">
            <path
              d="M5 5l10 10M15 5L5 15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </Container>
    </div>
  );
}
