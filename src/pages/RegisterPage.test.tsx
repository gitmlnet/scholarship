import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import RegisterPage from './RegisterPage';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('RegisterPage', () => {
  it('renders the wizard with the page title and first step', async () => {
    renderWithProviders(<RegisterPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'Apply for the Scholarship' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { level: 2, name: /confirm your eligibility/i })).toBeInTheDocument();
    expect(document.title).toBe('Apply for the Scholarship · ScholarSphere');
  });

  it('routes the header CTA flow: continue requires the confirmations', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);

    const progress = screen.getByRole('list', { name: /application progress/i });
    expect(within(progress).getAllByRole('listitem')).toHaveLength(7);

    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getAllByText('You must confirm this to continue.')).toHaveLength(4);
  });
});
