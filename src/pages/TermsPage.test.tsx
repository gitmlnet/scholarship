import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TermsPage from './TermsPage';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('TermsPage', () => {
  it('renders the intro and every section heading', () => {
    renderWithProviders(<TermsPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Terms & Conditions' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/fictional ScholarSphere Excellence Scholarship demonstration/i),
    ).toBeInTheDocument();
    for (const heading of [
      'A demonstration, not an offer',
      'Eligibility rules',
      'Acceptable use',
      'Content and intellectual property',
      'Changes',
    ]) {
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
    }
  });

  it('states that nothing real is offered', () => {
    renderWithProviders(<TermsPage />);
    expect(
      screen.getByText(/No real scholarship, award, or payment is offered/i),
    ).toBeInTheDocument();
  });
});
