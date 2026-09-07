import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import NoticesPage from './NoticesPage';
import { renderWithProviders } from '@/test/renderWithProviders';
import { seedNotices } from '@/data/seed/notices';

describe('NoticesPage', () => {
  it('renders all notices with a heading', async () => {
    renderWithProviders(<NoticesPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Notices' })).toBeInTheDocument();
    const cards = await screen.findAllByRole('article');
    expect(cards).toHaveLength(seedNotices.length);
  });

  it('filters by category', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NoticesPage />);

    await user.click(screen.getByRole('button', { name: 'Exam' }));
    const cards = await screen.findAllByRole('article');
    expect(cards).toHaveLength(1);
    expect(screen.getByText('Exam centres announced for the December test')).toBeInTheDocument();
  });

  it('marks the active filter with aria-pressed', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NoticesPage />);
    await screen.findAllByRole('article');

    const allButton = screen.getByRole('button', { name: 'All notices' });
    expect(allButton).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('button', { name: 'Result' }));
    expect(screen.getByRole('button', { name: 'Result' })).toHaveAttribute('aria-pressed', 'true');
    expect(allButton).toHaveAttribute('aria-pressed', 'false');
  });
});
