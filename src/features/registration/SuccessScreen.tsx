import { useTranslation } from 'react-i18next';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useGrades } from '@/hooks/useGrades';
import { useLocalized } from '@/hooks/useLocalized';
import { formatDateTime } from '@/utils/format';
import { CheckCircleIcon, CheckIcon, DownloadIcon } from '@/components/ui/icons';

export interface SubmittedApplication {
  id: string;
  studentName: string;
  gradeId: string;
  submittedAt: string;
}

/** Step 7 — confirmation with the generated ID and a printable receipt. */
export function SuccessScreen({
  application,
  onReset,
}: {
  application: SubmittedApplication;
  onReset: () => void;
}) {
  const { t } = useTranslation(['register', 'common']);
  const { lang, pick } = useLocalized();
  const { data: grades } = useGrades();

  const gradeLabel = pick(
    grades?.find((grade) => grade.id === application.gradeId)?.label ?? {
      en: application.gradeId,
      bn: application.gradeId,
    },
  );

  return (
    <Card className="mx-auto max-w-2xl">
      <div className="text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-100">
          <CheckCircleIcon className="text-success-700 size-8" />
        </span>
        <h2 className="text-navy-950 mt-4 text-2xl font-bold">{t('success.heading')}</h2>
        <p className="text-ink-muted mt-2">{t('success.saveIdNote')}</p>
      </div>

      {/* Receipt — the part that prints / saves as PDF */}
      <div className="border-line mt-6 rounded-xl border p-5">
        <p className="hidden print:block">{t('success.printHeading')}</p>
        <dl className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <dt className="text-ink-muted text-sm font-semibold tracking-wider uppercase">
              {t('success.idLabel')}
            </dt>
            <dd className="text-navy-950 font-mono text-xl font-bold tracking-wider">
              {application.id}
            </dd>
          </div>
          <div className="border-line flex flex-wrap justify-between gap-2 border-t pt-3">
            <dt className="text-ink-muted text-sm">{t('success.summary.student')}</dt>
            <dd className="text-navy-900 text-sm font-medium">{application.studentName}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="text-ink-muted text-sm">{t('success.summary.grade')}</dt>
            <dd className="text-navy-900 text-sm font-medium">{gradeLabel}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="text-ink-muted text-sm">{t('success.summary.submitted')}</dt>
            <dd className="text-navy-900 text-sm font-medium">
              {formatDateTime(application.submittedAt, lang)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6">
        <h3 className="text-navy-950 font-semibold">{t('success.next.heading')}</h3>
        <ol className="mt-3 space-y-2">
          {[
            t('success.next.payment'),
            t('success.next.review'),
            t('success.next.results'),
          ].map((line) => (
            <li key={line} className="text-ink flex gap-2.5 text-sm leading-relaxed">
              <CheckIcon className="text-success-700 mt-0.5 size-4 shrink-0" />
              {line}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3 print:hidden">
        <Button variant="primary" onClick={() => window.print()}>
          <DownloadIcon className="size-4" />
          {t('actions.print')}
        </Button>
        <ButtonLink to="/track" variant="secondary">
          {t('actions.track')}
        </ButtonLink>
        <Button variant="ghost" onClick={onReset}>
          {t('actions.startNew')}
        </Button>
      </div>
    </Card>
  );
}
