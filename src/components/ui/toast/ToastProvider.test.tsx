import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ToastProvider } from './ToastProvider';
import { useToast } from './context';

function ToastDemo() {
  const { push } = useToast();
  return (
    <button type="button" onClick={() => push({ title: 'Draft saved', description: 'Just now' })}>
      Save
    </button>
  );
}

describe('ToastProvider', () => {
  it('shows a toast when pushed, inside the live region', async () => {
    render(
      <ToastProvider>
        <ToastDemo />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    const toast = await screen.findByText('Draft saved');
    expect(toast).toBeInTheDocument();
    expect(screen.getByText('Just now')).toBeInTheDocument();
    expect(toast.closest('[aria-live="polite"]')).not.toBeNull();
  });

  it('dismisses manually via the close button', async () => {
    render(
      <ToastProvider>
        <ToastDemo />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await screen.findByText('Draft saved');

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(screen.queryByText('Draft saved')).not.toBeInTheDocument();
  });

  it('auto-dismisses after five seconds', () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <ToastDemo />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByText('Draft saved')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.queryByText('Draft saved')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('keeps at most three toasts stacked', () => {
    render(
      <ToastProvider>
        <ToastDemo />
      </ToastProvider>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(screen.getAllByText('Draft saved')).toHaveLength(3);
    const region = document.querySelector('[aria-live="polite"]');
    expect(region?.querySelectorAll('button[aria-label="Dismiss notification"]').length).toBe(3);
  });
});
