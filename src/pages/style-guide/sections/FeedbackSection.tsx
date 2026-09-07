import { Alert, type AlertVariant } from '@/components/ui/Alert';
import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/toast/context';
import { DemoBlock, GuideSection } from '../bits';

const ALERT_VARIANTS: { variant: AlertVariant; title: string }[] = [
  { variant: 'info', title: 'Applications open until 30 November 2026.' },
  { variant: 'success', title: 'Application submitted.' },
  { variant: 'warning', title: 'Payment reference needs review.' },
  { variant: 'danger', title: 'Transaction ID already used in this cycle.' },
];

const BADGE_VARIANTS: BadgeVariant[] = ['navy', 'gold', 'success', 'danger', 'neutral'];

function ToastDemo() {
  const { push } = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => push({ title: 'Draft saved', variant: 'success' })}
      >
        Success toast
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          push({
            title: 'Verification pending',
            description: 'Demo payment verification runs automatically.',
            variant: 'info',
          })
        }
      >
        Info toast
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => push({ title: 'Could not submit', variant: 'danger' })}
      >
        Danger toast
      </Button>
    </div>
  );
}

export function FeedbackSection() {
  return (
    <GuideSection
      id="feedback"
      title="3 · Feedback"
      description="Every state a user can hit has a designed answer: alerts, badges, toasts, empty states, and loading placeholders. Danger alerts announce assertively; toasts live in an aria-live region."
    >
      <DemoBlock label="Alerts (role=alert for danger, role=status otherwise)">
        <div className="grid gap-3 sm:grid-cols-2">
          {ALERT_VARIANTS.map((item) => (
            <Alert key={item.variant} variant={item.variant} title={item.title}>
              Supporting detail line for context.
            </Alert>
          ))}
        </div>
      </DemoBlock>

      <DemoBlock label="Badges">
        <div className="flex flex-wrap gap-2">
          {BADGE_VARIANTS.map((variant) => (
            <Badge key={variant} variant={variant}>
              {variant}
            </Badge>
          ))}
        </div>
      </DemoBlock>

      <DemoBlock label="Toasts (aria-live · auto-dismiss 5s · max 3 stacked)">
        <ToastDemo />
      </DemoBlock>

      <DemoBlock label="Empty state">
        <EmptyState
          title="No notices yet"
          description="Announcements will appear here as the cycle progresses."
        />
      </DemoBlock>

      <DemoBlock label="Loading (skeleton + spinner, reduced-motion safe)">
        <div className="flex items-center gap-6">
          <Spinner className="text-navy-700 size-6" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </DemoBlock>
    </GuideSection>
  );
}
