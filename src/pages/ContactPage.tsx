import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isApiError } from '@/services/errors';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { TextInput } from '@/components/ui/TextInput';
import { Textarea } from '@/components/ui/Textarea';
import { PageShell } from '@/components/common/PageShell';
import { useSettings } from '@/hooks/useSettings';
import { useLocalized } from '@/hooks/useLocalized';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { sendContactMessage } from '@/services/contact.service';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const EMPTY_FORM: FormState = { name: '', email: '', subject: '', message: '' };
type FormStatus = 'idle' | 'submitting' | 'success';

/**
 * Contact page: program-office details (from settings) + a form that stores
 * messages in the demo inbox via the mock API. Field-level validation comes
 * from the API (422 + details), exactly like a real backend.
 */
export default function ContactPage() {
  const { t } = useTranslation(['pages', 'common']);
  const { pick } = useLocalized();
  const { data: settings } = useSettings();

  useDocumentMeta(t('contact.title'), t('contact.description'));

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [failure, setFailure] = useState<string | null>(null);

  const update =
    (key: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [key]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    setFieldErrors({});
    setFailure(null);

    try {
      await sendContactMessage(form);
      setStatus('success');
      setForm(EMPTY_FORM);
    } catch (error) {
      setStatus('idle');
      if (isApiError(error) && error.status === 422 && error.details) {
        setFieldErrors(error.details);
      } else {
        setFailure(t('common:state.error'));
      }
    }
  };

  if (status === 'success') {
    return (
      <PageShell title={t('contact.title')} description={t('contact.description')}>
        <div className="max-w-xl">
          <Alert variant="success" title={t('contact.form.successTitle')}>
            <p>{t('contact.form.successBody')}</p>
          </Alert>
          <p className="text-ink-muted mt-4 text-sm">{t('contact.form.demoNote')}</p>
          <Button variant="secondary" className="mt-6" onClick={() => setStatus('idle')}>
            {t('contact.form.sendAnother')}
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title={t('contact.title')} description={t('contact.description')}>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
        {/* Office details */}
        <div>
          <h2 className="text-navy-950 text-xl font-bold">{t('contact.info.heading')}</h2>
          <Card className="mt-4">
            <dl className="space-y-5">
              <div>
                <dt className="text-ink-muted text-xs font-semibold tracking-wider uppercase">
                  {t('contact.info.emailLabel')}
                </dt>
                <dd className="text-navy-900 mt-1 font-medium">
                  {settings?.contact.email ?? 'info@scholarsphere.test'}
                </dd>
              </div>
              <div>
                <dt className="text-ink-muted text-xs font-semibold tracking-wider uppercase">
                  {t('contact.info.addressLabel')}
                </dt>
                <dd className="text-navy-900 mt-1 font-medium">
                  {settings ? pick(settings.contact.address) : ''}
                </dd>
              </div>
              <div>
                <dt className="text-ink-muted text-xs font-semibold tracking-wider uppercase">
                  {t('contact.info.hoursLabel')}
                </dt>
                <dd className="text-navy-900 mt-1 font-medium">{t('contact.info.hours')}</dd>
              </div>
            </dl>
            <p className="border-line text-ink-muted mt-5 border-t pt-4 text-xs leading-relaxed">
              {t('common:demoNotice')}
            </p>
          </Card>
        </div>

        {/* Message form */}
        <div>
          <h2 className="text-navy-950 text-xl font-bold">{t('contact.form.heading')}</h2>
          <form className="mt-4 space-y-5" onSubmit={handleSubmit} noValidate>
            <Field label={t('contact.form.name')} isRequired error={fieldErrors.name?.[0]}>
              <TextInput
                value={form.name}
                onChange={update('name')}
                autoComplete="name"
                maxLength={80}
              />
            </Field>
            <Field label={t('contact.form.email')} isRequired error={fieldErrors.email?.[0]}>
              <TextInput
                type="email"
                value={form.email}
                onChange={update('email')}
                autoComplete="email"
                maxLength={120}
              />
            </Field>
            <Field label={t('contact.form.subject')} isRequired error={fieldErrors.subject?.[0]}>
              <TextInput value={form.subject} onChange={update('subject')} maxLength={120} />
            </Field>
            <Field
              label={t('contact.form.message')}
              hint={t('contact.form.messageHint')}
              isRequired
              error={fieldErrors.message?.[0]}
            >
              <Textarea
                rows={5}
                value={form.message}
                onChange={update('message')}
                maxLength={2000}
              />
            </Field>

            {failure && <Alert variant="danger" title={failure} />}

            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit" isLoading={status === 'submitting'}>
                {t('contact.form.submit')}
              </Button>
              <p className="text-ink-muted max-w-sm text-xs leading-relaxed">
                {t('contact.form.demoNote')}
              </p>
            </div>
          </form>
        </div>
      </div>
    </PageShell>
  );
}
