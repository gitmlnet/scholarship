import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { TabPanel, Tabs, type TabItem } from './Tabs';

const ITEMS: TabItem[] = [
  { id: 'alpha', label: 'Alpha' },
  { id: 'beta', label: 'Beta' },
  { id: 'gamma', label: 'Gamma' },
];

function TabsDemo() {
  const [activeId, setActiveId] = useState('alpha');
  return (
    <div>
      <Tabs items={ITEMS} activeId={activeId} onChange={setActiveId} label="Demo tabs" />
      <TabPanel id="alpha" activeId={activeId}>
        Panel A
      </TabPanel>
      <TabPanel id="beta" activeId={activeId}>
        Panel B
      </TabPanel>
      <TabPanel id="gamma" activeId={activeId}>
        Panel C
      </TabPanel>
    </div>
  );
}

describe('Tabs', () => {
  it('renders a tablist with the accessible label', () => {
    render(<TabsDemo />);
    expect(screen.getByRole('tablist', { name: 'Demo tabs' })).toBeInTheDocument();
  });

  it('marks the active tab and shows only its panel', () => {
    render(<TabsDemo />);
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tabpanel', { name: 'Alpha' })).toHaveTextContent('Panel A');
    expect(screen.queryByRole('tabpanel', { name: 'Beta' })).not.toBeInTheDocument();
  });

  it('changes panels on click', () => {
    render(<TabsDemo />);
    fireEvent.click(screen.getByRole('tab', { name: 'Gamma' }));
    expect(screen.getByRole('tab', { name: 'Gamma' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Gamma' })).toHaveTextContent('Panel C');
  });

  it('supports arrow-key navigation with automatic activation', () => {
    render(<TabsDemo />);
    const alpha = screen.getByRole('tab', { name: 'Alpha' });
    alpha.focus();

    fireEvent.keyDown(alpha, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Beta' })).toHaveTextContent('Panel B');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Beta' }));

    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'ArrowLeft' });
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(alpha);
  });

  it('supports Home and End keys', () => {
    render(<TabsDemo />);
    const alpha = screen.getByRole('tab', { name: 'Alpha' });
    alpha.focus();

    fireEvent.keyDown(alpha, { key: 'End' });
    expect(screen.getByRole('tab', { name: 'Gamma' })).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Home' });
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'true');
  });

  it('uses roving tabindex', () => {
    render(<TabsDemo />);
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('tabindex', '-1');
  });
});
