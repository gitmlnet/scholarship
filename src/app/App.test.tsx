import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

/**
 * End-to-end smoke test through the whole foundation stack:
 * UI → service → ApiClient → mock server → seed data, plus i18n switching.
 */
describe('App shell', () => {
  it('renders the hero and loads notices from the mock API', async () => {
    render(<App />);

    // The page chunk and API data both resolve asynchronously.
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Your Potential Deserves an Opportunity.',
      }),
    ).toBeInTheDocument();
    // Header CTA + hero CTA both point at the registration wizard.
    const applyLinks = screen.getAllByRole('link', { name: 'Apply for Scholarship' });
    expect(applyLinks.length).toBeGreaterThanOrEqual(2);
    for (const link of applyLinks) {
      expect(link).toHaveAttribute('href', '/register');
    }

    // Notices arrive asynchronously through the mock API.
    expect(await screen.findByText('Applications open for the 2026 cycle')).toBeInTheDocument();
    // Stats strip renders from seed data too.
    expect(await screen.findByText('12,400+')).toBeInTheDocument();
  });

  it('switches to Bengali and back without losing content', async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByText('Applications open for the 2026 cycle');

    await user.click(screen.getByRole('button', { name: 'বাংলা' }));
    expect(document.documentElement.lang).toBe('bn');
    expect(
      screen.getByRole('heading', { level: 1, name: 'আপনার সম্ভাবনা একটি সুযোগের যোগ্য।' }),
    ).toBeInTheDocument();
    expect(await screen.findByText('২০২৬ শিক্ষাবর্ষের আবেদন শুরু হয়েছে')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'English' }));
    expect(document.documentElement.lang).toBe('en');
    expect(
      screen.getByRole('heading', { level: 1, name: 'Your Potential Deserves an Opportunity.' }),
    ).toBeInTheDocument();
  });

  it('renders the announcement bar from program settings', async () => {
    render(<App />);
    expect(
      await screen.findByText(/Applications for the 2026 cycle are open until 30 November 2026/i),
    ).toBeInTheDocument();
  });
});
