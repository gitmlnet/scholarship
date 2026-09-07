import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';
import { Button } from './Button';

function ModalDemo({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal open={open} onClose={onClose} title="Reset demo data?">
        <p>This clears local demo data.</p>
      </Modal>
    </>
  );
}

function getDialog(): HTMLDialogElement {
  const dialog = document.querySelector('dialog');
  if (!dialog) throw new Error('dialog not rendered');
  return dialog;
}

describe('Modal', () => {
  it('opens when the open prop becomes true', async () => {
    render(<ModalDemo onClose={vi.fn()} />);
    expect(getDialog().open).toBe(false);

    fireEvent.click(screen.getByRole('button', { name: 'Open modal' }));
    await waitFor(() => expect(getDialog().open).toBe(true));
    expect(screen.getByText('Reset demo data?')).toBeInTheDocument();
    expect(screen.getByText('This clears local demo data.')).toBeInTheDocument();
  });

  it('notifies the owner when the close button is used', async () => {
    const onClose = vi.fn();
    render(<ModalDemo onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open modal' }));
    await waitFor(() => expect(getDialog().open).toBe(true));

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('notifies the owner when Escape (cancel) fires', async () => {
    const onClose = vi.fn();
    render(<ModalDemo onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open modal' }));
    await waitFor(() => expect(getDialog().open).toBe(true));

    fireEvent(getDialog(), new Event('cancel', { bubbles: false }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on backdrop clicks but not content clicks', async () => {
    const onClose = vi.fn();
    render(<ModalDemo onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open modal' }));
    await waitFor(() => expect(getDialog().open).toBe(true));

    // Clicking inner content must not close.
    fireEvent.click(screen.getByText('This clears local demo data.'));
    expect(onClose).not.toHaveBeenCalled();

    // Clicking the dialog element itself (the backdrop area) closes.
    fireEvent.click(getDialog());
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('associates the title via aria-labelledby', async () => {
    render(<ModalDemo onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open modal' }));
    await waitFor(() => expect(getDialog().open).toBe(true));

    const titleId = getDialog().getAttribute('aria-labelledby');
    expect(titleId).toBeTruthy();
    expect(document.getElementById(titleId ?? '')?.textContent).toBe('Reset demo data?');
  });
});
