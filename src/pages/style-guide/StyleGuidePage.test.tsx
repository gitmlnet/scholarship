import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import StyleGuidePage from './StyleGuidePage';
import { ToastProvider } from '@/components/ui/toast/ToastProvider';

describe('StyleGuidePage', () => {
  it('renders all five sections', () => {
    render(
      <ToastProvider>
        <StyleGuidePage />
      </ToastProvider>,
    );
    for (const heading of [
      '1 · Foundations',
      '2 · Forms',
      '3 · Feedback',
      '4 · Overlays & navigation',
      '5 · Data display',
    ]) {
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
    }
  });

  it('documents the AA contrast pairs with live ratios', () => {
    render(
      <ToastProvider>
        <StyleGuidePage />
      </ToastProvider>,
    );
    expect(screen.getByText('primary button text', { exact: false })).toBeInTheDocument();
    expect(screen.getAllByText(/:1$/).length).toBeGreaterThan(10);
  });

  it('marks the page as noindex', () => {
    render(
      <ToastProvider>
        <StyleGuidePage />
      </ToastProvider>,
    );
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    );
  });
});
