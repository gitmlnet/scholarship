import { useEffect, useRef, useState } from 'react';
import { useForm, FormProvider, type Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isApiError } from '@/services/errors';
import { submitApplication } from '@/services/applications.service';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressSteps } from '@/components/ui/ProgressSteps';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useLocalized } from '@/hooks/useLocalized';
import { formatDateTime } from '@/utils/format';
import {
  DEFAULT_VALUES,
  PAYMENT_STEP_INDEX,
  REVIEW_STEP_INDEX,
  STEP_FIELD_PATHS,
  STEP_IDS,
  useRegisterForm,
  toApplicationPayload,
  type RegisterFormValues,
  type WizardStepId,
} from './schema';
import {
  clearRegisterDraft,
  loadRegisterDraft,
  saveRegisterDraft,
} from './draft';
import { EligibilityStep } from './steps/EligibilityStep';
import { StudentStep } from './steps/StudentStep';
import { GuardianStep } from './steps/GuardianStep';
import { AcademicStep } from './steps/AcademicStep';
import { PaymentStep } from './steps/PaymentStep';
import { ReviewStep } from './steps/ReviewStep';
import { SuccessScreen, type SubmittedApplication } from './SuccessScreen';

const DRAFT_AUTOSAVE_MS = 500;

/**
 * The seven-step registration wizard. One RHF form spans all steps (values
 * survive navigation), each step validates its own fields before continuing,
 * the draft autosaves to localStorage, and the final submit goes through the
 * service layer exactly once.
 */
export function RegistrationWizard() {
  const { t } = useTranslation(['register', 'common']);
  const { lang } = useLocalized();
  const { resolver } = useRegisterForm();

  const [stepIndex, setStepIndex] = useState(0);
  const [submitted, setSubmitted] = useState<SubmittedApplication | null>(null);
  const [draftRestoredAt, setDraftRestoredAt] = useState<string | null>(null);
  const [draftDiscarded, setDraftDiscarded] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const stepIndexRef = useRef(stepIndex);
  const submittedRef = useRef(submitted);
  const suppressStepSaveRef = useRef(false);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useDocumentMeta(t('meta.title'), t('meta.description'));

  const methods = useForm<RegisterFormValues>({
    resolver,
    defaultValues: DEFAULT_VALUES,
    mode: 'onTouched',
  });
  const {
    trigger,
    handleSubmit,
    setError,
    getValues,
    reset,
    formState: { isSubmitting },
  } = methods;

  // ── Draft lifecycle ────────────────────────────────────────────────────
  // Restore once on mount (values + step), before the autosave starts.
  useEffect(() => {
    const draft = loadRegisterDraft();
    if (draft) {
      reset(draft.values);
      setStepIndex(draft.stepIndex);
      setDraftRestoredAt(draft.savedAt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only restore
  }, []);

  // Debounced autosave — only on real user edits (info.type === 'change'),
  // never on programmatic resets (draft restore / discard / start new).
  // Also skipped once the application is submitted.
  useEffect(() => {
    submittedRef.current = submitted;
  }, [submitted]);

  useEffect(() => {
    // RHF's watch returns a subscription (not a memoizable value) — the React
    // Compiler warning is expected and safe to suppress for this pattern.
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = methods.watch((_values, info) => {
      if (info.type !== 'change') return;
      if (submittedRef.current) return;
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
      autosaveTimer.current = setTimeout(() => {
        saveRegisterDraft(stepIndexRef.current, getValues());
      }, DRAFT_AUTOSAVE_MS);
    });
    return () => {
      subscription.unsubscribe();
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [methods, getValues]);

  // Flush a save whenever the step changes, and keep the ref in sync —
  // unless a reset (discard / start new) just cleared the draft.
  useEffect(() => {
    stepIndexRef.current = stepIndex;
    if (submittedRef.current || suppressStepSaveRef.current) {
      suppressStepSaveRef.current = false;
      return;
    }
    saveRegisterDraft(stepIndex, getValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps -- save on step change
  }, [stepIndex]);

  // Move focus to the step heading on every step transition (a11y).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [stepIndex, submitted]);

  // ── Navigation ─────────────────────────────────────────────────────────
  const stepId = STEP_IDS[stepIndex] ?? 'eligibility';

  const goTo = (step: WizardStepId) => {
    const index = STEP_IDS.indexOf(step);
    if (index >= 0) setStepIndex(index);
  };

  const goNext = async () => {
    const valid = await trigger(STEP_FIELD_PATHS[stepId] as Path<RegisterFormValues>[], {
      shouldFocus: true,
    });
    if (valid) setStepIndex((index) => Math.min(index + 1, REVIEW_STEP_INDEX));
  };

  const goBack = () => setStepIndex((index) => Math.max(index - 1, 0));

  // Enter submits the current step's validation (or the application on
  // review) — consistent behavior across the whole wizard.
  const handleFormSubmit =
    stepIndex === REVIEW_STEP_INDEX
      ? handleSubmit(onValidSubmit)
      : (event: React.FormEvent) => {
          event.preventDefault();
          void goNext();
        };

  async function onValidSubmit(values: RegisterFormValues) {
    setSubmitError(null);
    try {
      const { id } = await submitApplication(toApplicationPayload(values));
      clearRegisterDraft();
      setSubmitted({
        id,
        studentName: values.student.fullName,
        gradeId: values.academic.gradeId,
        submittedAt: new Date().toISOString(),
      });
    } catch (error) {
      if (isApiError(error) && error.status === 409) {
        setError('payment.transactionId', {
          message: t('validation.duplicateTransaction'),
        });
        setStepIndex(PAYMENT_STEP_INDEX);
      } else {
        setSubmitError(t('validation.submitFailed'));
      }
    }
  }

  const discardDraft = () => {
    reset(DEFAULT_VALUES); // watch fires with type 'reset' → autosave skipped
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    clearRegisterDraft();
    if (stepIndexRef.current !== 0) suppressStepSaveRef.current = true;
    setStepIndex(0);
    setDraftRestoredAt(null);
    setDraftDiscarded(true);
  };

  const startNew = () => {
    reset(DEFAULT_VALUES); // watch skipped via the submitted guard
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    suppressStepSaveRef.current = true;
    setStepIndex(0);
    setSubmitted(null);
    setDraftDiscarded(false);
    setSubmitError(null);
  };

  // ── Render ─────────────────────────────────────────────────────────────
  const progressSteps = [
    ...STEP_IDS.map((id) => ({ id, label: t(`steps.${id}`) })),
    { id: 'confirm', label: t('steps.confirm') },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <h1 className="text-navy-950 text-3xl font-bold tracking-tight md:text-4xl">
        {t('meta.title')}
      </h1>
      <p className="text-ink-muted mt-4 max-w-2xl text-lg">{t('meta.description')}</p>

      <div className="mt-10">
        <ProgressSteps
          steps={progressSteps}
          currentId={submitted ? 'confirm' : stepId}
          label={t('progress.label')}
        />
      </div>

      {draftRestoredAt && !draftDiscarded && (
        <Alert variant="info" title={t('draft.restored', { time: formatDateTime(draftRestoredAt, lang) })}>
          <button
            type="button"
            onClick={discardDraft}
            className="text-navy-800 mt-1 text-sm font-semibold underline-offset-4 hover:underline"
          >
            {t('draft.discard')}
          </button>
        </Alert>
      )}
      {draftDiscarded && <p role="status">{t('draft.discarded')}</p>}

      <FormProvider {...methods}>
        {submitted ? (
          <SuccessScreen application={submitted} onReset={startNew} />
        ) : (
          <form className="mt-8" onSubmit={handleFormSubmit} noValidate>
            <Card>
              <h2
                ref={headingRef}
                tabIndex={-1}
                className="text-navy-950 text-xl font-bold tracking-tight outline-none"
              >
                {t(`steps.${stepId}`)} — {t(`${stepId}.heading`)}
              </h2>
              <div className="mt-6">
                {stepId === 'eligibility' && <EligibilityStep />}
                {stepId === 'student' && <StudentStep />}
                {stepId === 'guardian' && <GuardianStep />}
                {stepId === 'academic' && <AcademicStep />}
                {stepId === 'payment' && <PaymentStep />}
                {stepId === 'review' && <ReviewStep onEdit={goTo} />}
              </div>
            </Card>

            {submitError && (
              <Alert variant="danger" title={submitError} className="mt-6" />
            )}

            <div className="mt-6 flex items-center justify-between gap-4">
              {stepIndex > 0 ? (
                <Button type="button" variant="secondary" onClick={goBack}>
                  {t('actions.back')}
                </Button>
              ) : (
                <span />
              )}
              {stepIndex < REVIEW_STEP_INDEX ? (
                <Button type="button" variant="primary" onClick={() => void goNext()}>
                  {t('actions.next')}
                </Button>
              ) : (
                <Button type="submit" variant="primary" isLoading={isSubmitting}>
                  {isSubmitting ? t('actions.submitting') : t('actions.submit')}
                </Button>
              )}
            </div>
          </form>
        )}
      </FormProvider>
    </section>
  );
}
