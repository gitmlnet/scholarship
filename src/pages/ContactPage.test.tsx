import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import ContactPage from './ContactPage';
import { renderWithProviders } from '@/test/renderWithProviders';

async function fillAndSubmit() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/Full name/), 'Ariana Rahman');
  await user.type(screen.getByLabelText(/Email address/), 'ariana@example.test');
  await user.type(screen.getByLabelText(/Subject/), 'Question about the exam');
  await user.type(
    screen.getByLabelText(/^Message/),
    'Where can I find the sample syllabus for Grade 6?',
  );
  await user.click(screen.getByRole('button', { name: 'Send message' }));
  return user;
}

describe('ContactPage', () => {
  it('renders the program office details from settings', async () => {
    renderWithProviders(<ContactPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Contact' })).toBeInTheDocument();
    expect(await screen.findByText(/House 12, Road 5, Dhanmondi/i)).toBeInTheDocument();
    expect(screen.getByText('info@scholarsphere.test')).toBeInTheDocument();
    expect(screen.getByText(/House 12, Road 5, Dhanmondi/i)).toBeInTheDocument();
  });

  it('labels the demo nature of the inbox', () => {
    renderWithProviders(<ContactPage />);
    expect(screen.getAllByText(/demo inbox/i).length).toBeGreaterThan(0);
  });

  it('submits a valid message and shows the success state', async () => {
    renderWithProviders(<ContactPage />);
    await fillAndSubmit();

    expect(await screen.findByText('Message received')).toBeInTheDocument();
    expect(screen.getByText(/program office will reply/i)).toBeInTheDocument();
  });

  it('shows field-level API validation errors for invalid input', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactPage />);

    await user.type(screen.getByLabelText(/Full name/), 'A');
    await user.type(screen.getByLabelText(/Email address/), 'not-an-email');
    await user.type(screen.getByLabelText(/Subject/), 'Hi');
    await user.type(screen.getByLabelText(/^Message/), 'short');
    await user.click(screen.getByRole('button', { name: 'Send message' }));

    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();
    expect(screen.getByText('Must be 2–80 characters')).toBeInTheDocument();
    expect(screen.getByText('Must be 4–120 characters')).toBeInTheDocument();
    expect(screen.getByText('Must be 10–2000 characters')).toBeInTheDocument();
  });

  it('returns to the form after success', async () => {
    renderWithProviders(<ContactPage />);
    await fillAndSubmit();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Send another message' }));
    expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument();
  });
});
