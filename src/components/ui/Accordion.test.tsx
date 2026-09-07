import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Accordion } from './Accordion';

const ITEMS = [
  { id: 'a', summary: 'Who can apply?', content: 'Students in Grades 4–10.' },
  { id: 'b', summary: 'Is there a fee?', content: 'Yes, a demo fee.' },
];

describe('Accordion', () => {
  it('starts closed and toggles open on summary click', () => {
    render(<Accordion items={ITEMS} />);
    const first = screen.getByText('Who can apply?').closest('details');
    expect(first?.open).toBe(false);

    fireEvent.click(screen.getByText('Who can apply?'));
    expect(first?.open).toBe(true);
    expect(screen.getByText('Students in Grades 4–10.')).toBeInTheDocument();
  });

  it('toggles items independently', () => {
    render(<Accordion items={ITEMS} />);
    fireEvent.click(screen.getByText('Who can apply?'));
    fireEvent.click(screen.getByText('Is there a fee?'));
    expect(screen.getByText('Who can apply?').closest('details')?.open).toBe(true);
    expect(screen.getByText('Is there a fee?').closest('details')?.open).toBe(true);
  });
});
