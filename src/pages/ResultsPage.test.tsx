import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import ResultsPage from './ResultsPage';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('ResultsPage', () => {
  it('loads the newest year and its first grade by default', async () => {
    renderWithProviders(<ResultsPage />);
    expect(await screen.findByText('Ayesha Siddiqua')).toBeInTheDocument();
    expect(screen.getByText('Future Scholars Academy')).toBeInTheDocument();
    expect(screen.getByText('Gold Award — ৳15,000')).toBeInTheDocument();
  });

  it('renders the full merit table with positions and scores', async () => {
    renderWithProviders(<ResultsPage />);
    const table = await screen.findByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(6); // header + 5
    expect(within(table).getByText('Position')).toBeInTheDocument();
    expect(within(table).getByText('292')).toBeInTheDocument();
  });

  it('searches the merit list by student name', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ResultsPage />);
    await screen.findByText('Ayesha Siddiqua');

    await user.type(screen.getByRole('searchbox'), 'Rafiul');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(await screen.findByText('Rafiul Hasan')).toBeInTheDocument();
    expect(screen.queryByText('Ayesha Siddiqua')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear/i })).toBeInTheDocument();
  });

  it('switches year and grade from the index', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ResultsPage />);
    await screen.findByText('Ayesha Siddiqua');

    const yearSelect = screen.getByLabelText('Year');
    await user.selectOptions(yearSelect, '2024');
    expect(await screen.findByText('Nafis Iqbal')).toBeInTheDocument();

    const gradeSelect = screen.getByLabelText('Grade');
    await user.selectOptions(gradeSelect, 'g9');
    expect(await screen.findByText('Anika Tabassum')).toBeInTheDocument();
  });

  it('shows an empty state when the search matches nothing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ResultsPage />);
    await screen.findByText('Ayesha Siddiqua');

    await user.type(screen.getByRole('searchbox'), 'Nobody Matches This');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(
      await screen.findByText('No students or schools match your search.'),
    ).toBeInTheDocument();
  });
});
