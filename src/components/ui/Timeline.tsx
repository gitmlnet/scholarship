import { cn } from '@/utils/cn';
import { CheckIcon, XIcon } from './icons';

export type TimelineState = 'done' | 'current' | 'pending' | 'failed';

export interface TimelineStep {
  id: string;
  label: string;
  description?: string;
  state: TimelineState;
}

interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

/**
 * Vertical status timeline (application tracking, Phase 6). State glyphs are
 * decorative (aria-hidden) — pair them with a localized status description
 * so screen readers get the same information.
 */
export function Timeline({ steps, className }: TimelineProps) {
  return (
    <ol className={cn('relative', className)}>
      <span aria-hidden="true" className="bg-line absolute top-4 bottom-4 left-[11px] w-0.5" />
      {steps.map((step) => (
        <li key={step.id} className="relative flex gap-4 pb-7 last:pb-0">
          <span
            aria-hidden="true"
            className={cn(
              'relative z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full',
              step.state === 'done' && 'bg-navy-700 text-white',
              step.state === 'current' && 'border-gold-500 bg-surface-raised border-2',
              step.state === 'pending' && 'border-line-strong bg-surface-raised border-2',
              step.state === 'failed' && 'bg-danger-700 text-white',
            )}
          >
            {step.state === 'done' && <CheckIcon className="size-3.5" />}
            {step.state === 'current' && <span className="bg-gold-400 size-2.5 rounded-full" />}
            {step.state === 'failed' && <XIcon className="size-3.5" />}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <p
              className={cn(
                'text-sm font-semibold',
                step.state === 'pending' ? 'text-ink-muted' : 'text-navy-950',
              )}
            >
              {step.label}
            </p>
            {step.description && (
              <p className="text-ink-muted mt-0.5 text-xs leading-relaxed">{step.description}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
