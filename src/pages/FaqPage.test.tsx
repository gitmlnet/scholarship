import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import FaqPage from './FaqPage';
import { renderWithProviders } from '@/test/renderWithProviders';
import { seedFaqs } from '@/data/seed/faqs';

describe('FaqPage', () => {
  it('renders every question from the seed data', async () => {
    renderWithProviders(<FaqPage />);
    expect(await screen.findByText('Who can apply for the scholarship?')).toBeInTheDocument();
    // Every seeded question is present as a disclosure summary.
    const details = document.querySelectorAll('details');
    expect(details.length).toBeGreaterThanOrEqual(seedFaqs.length);
  });

  it('toggles a question open and reveals its answer', async () => {
    const user = userEvent.setup();
    renderWithProviders(<FaqPage />);
    const summary = await screen.findByText('How do I pay the application fee?');
    const details = summary.closest('details');
    expect(details?.open).toBe(false);

    await user.click(summary);
    expect(details?.open).toBe(true);
    expect(screen.getByText(/fictional mobile financial service/i)).toBeInTheDocument();
  });

  it('filters by category', async () => {
    const user = userEvent.setup();
    renderWithProviders(<FaqPage />);
    await screen.findByText('How do I pay the application fee?');

    await user.click(screen.getByRole('button', { name: 'Payment' }));
    expect(screen.getByText('How do I pay the application fee?')).toBeInTheDocument();
    expect(screen.queryByText('Who can apply for the scholarship?')).not.toBeInTheDocument();
  });
});
