import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('fires onClick when enabled', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Submit</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('blocks interaction while loading and exposes aria-busy', () => {
    const onClick = vi.fn();
    render(
      <Button isLoading onClick={onClick}>
        Submitting…
      </Button>,
    );
    const button = screen.getByRole('button', { name: /Submitting/ });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('blocks interaction when disabled', () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Submit
      </Button>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
