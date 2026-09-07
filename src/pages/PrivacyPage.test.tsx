import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PrivacyPage from './PrivacyPage';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('PrivacyPage', () => {
  it('renders the intro and every section heading', () => {
    renderWithProviders(<PrivacyPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeInTheDocument();
    expect(
      screen.getByText(/learning project, not a real scholarship program/i),
    ).toBeInTheDocument();
    for (const heading of [
      'No real data collection',
      'What is stored, and where',
      'Fictional content',
      'Your control',
      'Questions',
    ]) {
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
    }
  });

  it('documents the localStorage boundary', () => {
    renderWithProviders(<PrivacyPage />);
    expect(screen.getByText(/browser's localStorage/i)).toBeInTheDocument();
  });
});
