import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SyllabusPage from './SyllabusPage';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('SyllabusPage', () => {
  it('defaults to the first grade on /syllabus', async () => {
    renderWithProviders(<SyllabusPage />, {
      route: '/syllabus',
      paths: ['/syllabus', '/syllabus/:gradeId'],
    });
    expect(await screen.findByText('Letters and conjunct characters')).toBeInTheDocument();
    expect(screen.getByText(/Foundational language and numeracy skills/)).toBeInTheDocument();
  });

  it('loads the grade from the URL (/syllabus/g6)', async () => {
    renderWithProviders(<SyllabusPage />, {
      route: '/syllabus/g6',
      paths: ['/syllabus', '/syllabus/:gradeId'],
    });
    expect(await screen.findByText('Ratio, proportion, and percentage')).toBeInTheDocument();
    expect(
      screen.getByText('The secondary-school bridge: deeper language work plus science reasoning.'),
    ).toBeInTheDocument();
  });

  it('switches grades through the tab list', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SyllabusPage />, {
      route: '/syllabus/g4',
      paths: ['/syllabus', '/syllabus/:gradeId'],
    });
    await screen.findByText('Letters and conjunct characters');

    await user.click(screen.getByRole('tab', { name: 'Grade 10' }));
    expect(await screen.findByText('Exponents and logarithms')).toBeInTheDocument();
    expect(screen.queryByText('Letters and conjunct characters')).not.toBeInTheDocument();
  });

  it('marks the active tab as selected', async () => {
    renderWithProviders(<SyllabusPage />, {
      route: '/syllabus/g8',
      paths: ['/syllabus', '/syllabus/:gradeId'],
    });
    await screen.findByText(/Pre-SSC consolidation/i);
    expect(screen.getByRole('tab', { name: 'Grade 8' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Grade 4' })).toHaveAttribute('aria-selected', 'false');
  });

  it('offers a working download action (print)', async () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    renderWithProviders(<SyllabusPage />, {
      route: '/syllabus/g5',
      paths: ['/syllabus', '/syllabus/:gradeId'],
    });
    await screen.findByText('Factors and multiples');

    expect(screen.getByRole('button', { name: /Download syllabus sheet/i })).toBeInTheDocument();
    expect(screen.getByText(/save the sheet as PDF/i)).toBeInTheDocument();
    await window.print();
    expect(printSpy).toHaveBeenCalled();
    printSpy.mockRestore();
  });

  it('warns (not crashes) for an unknown grade id', async () => {
    renderWithProviders(<SyllabusPage />, {
      route: '/syllabus/g99',
      paths: ['/syllabus', '/syllabus/:gradeId'],
    });
    expect(await screen.findByText('No syllabus exists for this grade.')).toBeInTheDocument();
  });
});
