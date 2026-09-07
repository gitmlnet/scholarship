import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import EligibilityPage from './EligibilityPage';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('EligibilityPage', () => {
  it('renders the general requirements', () => {
    renderWithProviders(<EligibilityPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Eligibility' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Before you check your grade' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/One application per student per cycle/i)).toBeInTheDocument();
  });

  it('renders an accordion for every grade', async () => {
    renderWithProviders(<EligibilityPage />);
    for (const grade of [
      'Grade 4',
      'Grade 5',
      'Grade 6',
      'Grade 7',
      'Grade 8',
      'Grade 9',
      'Grade 10',
    ]) {
      expect(await screen.findByText(new RegExp(`^${grade} —`))).toBeInTheDocument();
    }
  });

  it('reveals subjects, exam meta, and instructions when a grade is opened', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EligibilityPage />);
    const summary = await screen.findByText(/^Grade 6 —/);
    await user.click(summary);

    const details = summary.closest('details');
    expect(details).not.toBeNull();
    const panel = within(details as HTMLElement);

    expect(
      panel.getByText(/Students enrolled in Grade 6 at any recognized school/i),
    ).toBeInTheDocument();
    expect(panel.getByText('General Science · 50')).toBeInTheDocument();
    expect(panel.getByText('Exam-day instructions')).toBeInTheDocument();
    expect(
      panel.getByText('Electronic devices and calculators are not allowed.'),
    ).toBeInTheDocument();
    expect(panel.getAllByRole('link', { name: 'View the syllabus →' }).length).toBe(1);
  });

  it('links each open grade to its syllabus page', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EligibilityPage />);
    const summary = await screen.findByText(/^Grade 9 —/);
    await user.click(summary);

    const details = summary.closest('details');
    const link = within(details as HTMLElement).getByRole('link', {
      name: 'View the syllabus →',
    });
    expect(link).toHaveAttribute('href', '/syllabus/g9');
  });
});
