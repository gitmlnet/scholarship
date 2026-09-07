import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressSteps } from './ProgressSteps';

const STEPS = [
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'student', label: 'Student' },
  { id: 'guardian', label: 'Guardian' },
];

describe('ProgressSteps', () => {
  it('marks the current step with aria-current="step"', () => {
    render(<ProgressSteps steps={STEPS} currentId="student" />);
    const current = screen.getByText('Student').closest('li');
    expect(current).toHaveAttribute('aria-current', 'step');
  });

  it('renders every step label in order', () => {
    render(<ProgressSteps steps={STEPS} currentId="guardian" />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(screen.getByText('Eligibility')).toBeInTheDocument();
    expect(screen.getByText('Student')).toBeInTheDocument();
    expect(screen.getByText('Guardian')).toBeInTheDocument();
  });

  it('falls back to the first step for unknown ids', () => {
    render(<ProgressSteps steps={STEPS} currentId="not-a-step" />);
    expect(screen.getByText('Eligibility').closest('li')).toHaveAttribute('aria-current', 'step');
  });
});
