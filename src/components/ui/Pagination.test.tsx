import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders all pages when there are few', () => {
    render(<Pagination page={3} pageCount={5} onChange={vi.fn()} label="Pagination" />);
    for (const pageNumber of [1, 2, 3, 4, 5]) {
      expect(screen.getByRole('button', { name: `Page ${pageNumber}` })).toBeInTheDocument();
    }
    expect(screen.queryByText('…')).not.toBeInTheDocument();
  });

  it('marks the current page with aria-current', () => {
    render(<Pagination page={3} pageCount={5} onChange={vi.fn()} label="Pagination" />);
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Page 4' })).not.toHaveAttribute('aria-current');
  });

  it('reports page changes', () => {
    const onChange = vi.fn();
    render(<Pagination page={3} pageCount={5} onChange={onChange} label="Pagination" />);
    fireEvent.click(screen.getByRole('button', { name: 'Page 4' }));
    expect(onChange).toHaveBeenCalledWith(4);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onChange).toHaveBeenCalledWith(4); // page 3 + 1
  });

  it('disables prev/next at the boundaries', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Pagination page={1} pageCount={5} onChange={onChange} label="Pagination" />,
    );
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled();

    rerender(<Pagination page={5} pageCount={5} onChange={onChange} label="Pagination" />);
    expect(screen.getByRole('button', { name: 'Previous' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('windows large page counts with ellipses', () => {
    render(<Pagination page={6} pageCount={12} onChange={vi.fn()} label="Pagination" />);
    for (const pageNumber of [1, 5, 6, 7, 12]) {
      expect(screen.getByRole('button', { name: `Page ${pageNumber}` })).toBeInTheDocument();
    }
    for (const hidden of [2, 4, 8, 11]) {
      expect(screen.queryByRole('button', { name: `Page ${hidden}` })).not.toBeInTheDocument();
    }
    expect(screen.getAllByText('…').length).toBe(2);
  });

  it('shows the full window near the edges', () => {
    render(<Pagination page={2} pageCount={12} onChange={vi.fn()} label="Pagination" />);
    for (const pageNumber of [1, 2, 3]) {
      expect(screen.getByRole('button', { name: `Page ${pageNumber}` })).toBeInTheDocument();
    }
    expect(screen.getAllByText('…').length).toBe(1);
  });
});
