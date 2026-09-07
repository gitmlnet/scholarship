import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Timeline, type TimelineStep } from './Timeline';

const STEPS: TimelineStep[] = [
  { id: 'submitted', label: 'Application submitted', state: 'done' },
  { id: 'payment', label: 'Payment information', state: 'current' },
  { id: 'review', label: 'Application review', state: 'pending' },
  { id: 'decision', label: 'Final decision', state: 'failed' },
];

describe('Timeline', () => {
  it('renders all steps with their labels and descriptions', () => {
    render(
      <Timeline
        steps={[
          ...STEPS,
          { id: 'extra', label: 'With description', description: 'Detail line', state: 'done' },
        ]}
      />,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    expect(screen.getByText('Application submitted')).toBeInTheDocument();
    expect(screen.getByText('With description')).toBeInTheDocument();
    expect(screen.getByText('Detail line')).toBeInTheDocument();
  });

  it('keeps state glyphs decorative (aria-hidden)', () => {
    render(<Timeline steps={STEPS} />);
    const hiddenIcons = document.querySelectorAll('ol span[aria-hidden="true"]');
    expect(hiddenIcons.length).toBeGreaterThan(0);
  });
});
