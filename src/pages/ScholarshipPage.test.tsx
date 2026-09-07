import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ScholarshipPage from './ScholarshipPage';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('ScholarshipPage', () => {
  it('renders the page heading and purpose section', async () => {
    renderWithProviders(<ScholarshipPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'The Scholarship' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Why this program exists' })).toBeInTheDocument();
    expect(screen.getByText(/Too much potential goes unnoticed/i)).toBeInTheDocument();
  });

  it('renders all four benefit cards', () => {
    renderWithProviders(<ScholarshipPage />);
    expect(screen.getByRole('heading', { name: 'What scholars receive' })).toBeInTheDocument();
    for (const benefit of [
      'Recognition',
      'Financial support',
      'Mentorship & resources',
      'A fair chance',
    ]) {
      expect(screen.getByRole('heading', { name: benefit })).toBeInTheDocument();
    }
  });

  it('renders the exam-structure table for all seven grades', async () => {
    renderWithProviders(<ScholarshipPage />);
    const table = await screen.findByRole('table');
    for (const grade of ['Grade 4', 'Grade 6', 'Grade 10']) {
      expect(within(table).getByText(grade)).toBeInTheDocument();
    }
    expect(within(table).getAllByRole('row')).toHaveLength(8); // header + 7 grades
    // Marks + duration columns are populated for every grade row.
    expect(within(table).getAllByText('90 min').length).toBeGreaterThanOrEqual(2);
    expect(within(table).getAllByText('150 min').length).toBeGreaterThanOrEqual(2);
  });

  it('renders important dates from program settings', async () => {
    renderWithProviders(<ScholarshipPage />);
    expect(await screen.findByText('Applications open')).toBeInTheDocument();
    expect(screen.getByText('Entrance examination')).toBeInTheDocument();
  });

  it('renders the four application-process steps and the CTA', () => {
    renderWithProviders(<ScholarshipPage />);
    expect(screen.getByRole('heading', { name: 'How applying works' })).toBeInTheDocument();
    for (const step of ['Apply online', 'Pay the fee', 'Sit the exam', 'Results & awards']) {
      expect(screen.getByRole('heading', { name: step })).toBeInTheDocument();
    }
    expect(screen.getByRole('heading', { name: 'Ready to begin?' })).toBeInTheDocument();
  });

  it('documents that payment is simulated', () => {
    renderWithProviders(<ScholarshipPage />);
    expect(screen.getByRole('heading', { name: 'Paying the application fee' })).toBeInTheDocument();
    expect(screen.getByText(/No real money moves anywhere/i)).toBeInTheDocument();
  });
});
