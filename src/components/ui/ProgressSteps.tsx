import { cn } from '@/utils/cn';
import { CheckIcon } from './icons';

export interface ProgressStep {
  id: string;
  label: string;
}

interface ProgressStepsProps {
  steps: ProgressStep[];
  /** The step the user is currently on (earlier steps render complete). */
  currentId: string;
  className?: string;
}

/** Horizontal wizard progress indicator (used by registration in Phase 4). */
export function ProgressSteps({ steps, currentId, className }: ProgressStepsProps) {
  const currentIndex = Math.max(
    0,
    steps.findIndex((step) => step.id === currentId),
  );

  return (
    <ol className={cn('flex w-full', className)}>
      {steps.map((step, index) => {
        const isCurrent = index === currentIndex;
        const isComplete = index < currentIndex;
        const isLast = index === steps.length - 1;

        return (
          <li
            key={step.id}
            aria-current={isCurrent ? 'step' : undefined}
            className={cn('flex flex-col items-center gap-2 text-center', !isLast && 'flex-1')}
          >
            <div className="relative flex w-full items-center justify-center">
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute top-[13px] right-[calc(-50%+20px)] left-[calc(50%+20px)] h-0.5',
                    isComplete ? 'bg-navy-700' : 'bg-line-strong',
                  )}
                />
              )}
              <span
                aria-hidden="true"
                className={cn(
                  'relative z-10 flex size-7 items-center justify-center rounded-full border-2 text-xs font-semibold',
                  isComplete && 'border-navy-700 bg-navy-700 text-white',
                  isCurrent &&
                    'border-gold-500 bg-surface-raised text-navy-900 ring-gold-200 ring-4',
                  !isComplete &&
                    !isCurrent &&
                    'border-line-strong bg-surface-raised text-ink-muted',
                )}
              >
                {isComplete ? <CheckIcon className="size-3.5" /> : index + 1}
              </span>
            </div>
            <span
              className={cn(
                'max-w-24 text-xs leading-snug',
                isCurrent ? 'text-navy-950 font-semibold' : 'text-ink-muted',
              )}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
