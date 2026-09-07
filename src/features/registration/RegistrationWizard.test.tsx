import { describe, expect, it } from 'vitest';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UserEvent } from '@testing-library/user-event';
import { RegistrationWizard } from './RegistrationWizard';
import { renderWithProviders } from '@/test/renderWithProviders';
import { REGISTER_DRAFT_KEY } from '@/config/storageKeys';

const VALID_TRANSACTION_ID = 'DEMO8F3K2Q';

/** Walk the whole wizard with valid data, returning once the review shows. */
async function fillValidApplication(user: UserEvent, transactionId = VALID_TRANSACTION_ID) {
  // Step 1 — eligibility confirmations.
  for (const fragment of ['enrolled in the grade', 'recognized by', 'only application', 'accurate and complete']) {
    await user.click(screen.getByRole('checkbox', { name: new RegExp(fragment, 'i') }));
  }
  await user.click(screen.getByRole('button', { name: 'Continue' }));

  // Step 2 — student.
  await user.type(screen.getByLabelText(/full name/i), 'Nusrat Jahan');
  fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '2011-03-12' } });
  await user.selectOptions(screen.getByLabelText(/gender/i), 'female');
  await user.type(screen.getByLabelText(/email address/i), 'nusrat@example.test');
  await user.type(screen.getByLabelText(/mobile number/i), '01712345678');
  await user.click(screen.getByRole('button', { name: 'Continue' }));

  // Step 3 — guardian.
  await user.type(screen.getByLabelText(/guardian's full name/i), 'Kamrul Jahan');
  await user.selectOptions(screen.getByLabelText(/relation/i), 'father');
  await user.type(screen.getByLabelText(/guardian's mobile number/i), '01812345678');
  await user.click(screen.getByRole('button', { name: 'Continue' }));

  // Step 4 — academic.
  await screen.findByRole('option', { name: /grade 6/i }); // grades load async
  await user.selectOptions(screen.getByLabelText(/grade applying for/i), 'g6');
  await user.type(screen.getByLabelText(/school name/i), 'Chattogram Model High School');
  await user.click(screen.getByRole('button', { name: 'Continue' }));

  // Step 5 — payment (left on the payment step; see continueToReview).
  await user.type(screen.getByLabelText(/transaction id/i), transactionId);
}

/** Advance from the payment step to the review. */
async function continueToReview(user: UserEvent) {
  await user.click(screen.getByRole('button', { name: 'Continue' }));
  expect(
    await screen.findByRole('heading', { level: 2, name: /review your application/i }),
  ).toBeInTheDocument();
}

describe('RegistrationWizard', () => {
  it('renders the eligibility step with a seven-item progress indicator', () => {
    renderWithProviders(<RegistrationWizard />);
    expect(screen.getByRole('heading', { level: 1, name: /apply for the scholarship/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /confirm your eligibility/i })).toBeInTheDocument();

    const progress = screen.getByRole('list', { name: /application progress/i });
    expect(within(progress).getAllByRole('listitem')).toHaveLength(7);
    expect(within(progress).getByText('Confirm')).toBeInTheDocument();
  });

  it('blocks progress until all four confirmations are checked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegistrationWizard />);

    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getAllByText('You must confirm this to continue.')).toHaveLength(4);
    expect(screen.getByRole('heading', { level: 2, name: /confirm your eligibility/i })).toBeInTheDocument();
  });

  it('validates student fields inline and advances when corrected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegistrationWizard />);

    // Skip through eligibility to the student step.
    for (const fragment of ['enrolled in the grade', 'recognized by', 'only application', 'accurate and complete']) {
      await user.click(screen.getByRole('checkbox', { name: new RegExp(fragment, 'i') }));
    }
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    // Continue with an empty form → required errors, no advance.
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByText('This field is required.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /student information/i })).toBeInTheDocument();

    // A malformed email gets a format error once corrected to valid, step advances.
    await user.type(screen.getByLabelText(/full name/i), 'Nusrat Jahan');
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '2011-03-12' } });
    await user.selectOptions(screen.getByLabelText(/gender/i), 'female');
    await user.type(screen.getByLabelText(/email address/i), 'not-an-email');
    await user.type(screen.getByLabelText(/mobile number/i), '01712345678');
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();

    await user.clear(screen.getByLabelText(/email address/i));
    await user.type(screen.getByLabelText(/email address/i), 'nusrat@example.test');
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('heading', { level: 2, name: /guardian information/i })).toBeInTheDocument();
  });

  it('shows the grade-based fee and merchant account on the payment step', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegistrationWizard />);
    await fillValidApplication(user);

    expect(screen.getByRole('heading', { level: 2, name: /payment reference/i })).toBeInTheDocument();
    expect(screen.getByText('৳150')).toBeInTheDocument();
    expect(screen.getByText(/SCHOLARSPHERE-DEMO/i)).toBeInTheDocument();
  });
  it('moves focus to the step heading when advancing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegistrationWizard />);

    for (const fragment of ['enrolled in the grade', 'recognized by', 'only application', 'accurate and complete']) {
      await user.click(screen.getByRole('checkbox', { name: new RegExp(fragment, 'i') }));
    }
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    const heading = screen.getByRole('heading', { level: 2, name: /student information/i });
    expect(heading).toHaveFocus();
  });

  it('reviews the entered values and jumps back via the edit links', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegistrationWizard />);
    await fillValidApplication(user);
    await continueToReview(user);

    expect(screen.getByRole('heading', { level: 2, name: /review your application/i })).toBeInTheDocument();
    expect(screen.getAllByText('Nusrat Jahan').length).toBeGreaterThan(0);
    expect(screen.getAllByText(VALID_TRANSACTION_ID).length).toBeGreaterThan(0);
    expect(screen.getByText('Chattogram Model High School')).toBeInTheDocument();
    expect(screen.getByText('৳150')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /edit — student/i }));
    expect(screen.getByRole('heading', { level: 2, name: /student information/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toHaveValue('Nusrat Jahan');
  });

  it('submits through the service layer once and shows the success screen with a generated id', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegistrationWizard />);
    await fillValidApplication(user);
    await continueToReview(user);

    await user.click(screen.getByRole('button', { name: 'Submit application' }));

    const id = await screen.findByText(/^SS26-\d{6}$/);
    expect(id).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /application submitted/i })).toBeInTheDocument();
    expect(screen.getAllByText('Nusrat Jahan').length).toBeGreaterThan(0);

    // The draft is cleared after a successful submit.
    await waitFor(() => {
      expect(window.localStorage.getItem(REGISTER_DRAFT_KEY)).toBeNull();
    });

    // The mock API persisted exactly one application.
    expect(Object.keys(window.localStorage).filter((key) => key.includes('applications'))).toHaveLength(1);
  });

  it('flags a reused transaction id, returns to the payment step, and keeps the draft', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegistrationWizard />);
    await fillValidApplication(user);
    await continueToReview(user);
    await user.click(screen.getByRole('button', { name: 'Submit application' }));
    await screen.findByText(/^SS26-\d{6}$/);

    // Start a second application reusing the same DemoPay transaction.
    await user.click(screen.getByRole('button', { name: /start a new application/i }));
    expect(screen.getByRole('heading', { level: 2, name: /confirm your eligibility/i })).toBeInTheDocument();
    await fillValidApplication(user);
    await continueToReview(user);
    await user.click(screen.getByRole('button', { name: 'Submit application' }));

    expect(
      await screen.findByText('This transaction ID was already used in this cycle.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /payment reference/i })).toBeInTheDocument();
    expect(window.localStorage.getItem(REGISTER_DRAFT_KEY)).not.toBeNull();
  });

  it('autosaves a draft and restores the wizard state after a remount', async () => {
    const user = userEvent.setup();
    const { unmount } = renderWithProviders(<RegistrationWizard />);

    for (const fragment of ['enrolled in the grade', 'recognized by', 'only application', 'accurate and complete']) {
      await user.click(screen.getByRole('checkbox', { name: new RegExp(fragment, 'i') }));
    }
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.type(screen.getByLabelText(/full name/i), 'Nusrat Jahan');

    // The step change saves synchronously; the debounce persists the typing.
    await waitFor(() => {
      const raw = window.localStorage.getItem(REGISTER_DRAFT_KEY);
      expect(raw).toContain('Nusrat Jahan');
    });

    unmount();
    renderWithProviders(<RegistrationWizard />);

    // Restored to the student step with a notice and the saved value.
    expect(screen.getByRole('heading', { level: 2, name: /student information/i })).toBeInTheDocument();
    expect(screen.getByText(/draft restored/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toHaveValue('Nusrat Jahan');
  });

  it('discards the restored draft and starts over', async () => {
    const user = userEvent.setup();
    const { unmount } = renderWithProviders(<RegistrationWizard />);

    for (const fragment of ['enrolled in the grade', 'recognized by', 'only application', 'accurate and complete']) {
      await user.click(screen.getByRole('checkbox', { name: new RegExp(fragment, 'i') }));
    }
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    unmount();

    renderWithProviders(<RegistrationWizard />);
    await user.click(screen.getByRole('button', { name: /discard draft/i }));

    expect(screen.getByRole('heading', { level: 2, name: /confirm your eligibility/i })).toBeInTheDocument();
    expect(screen.getByText(/draft discarded/i)).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: /enrolled in the grade/i }),
    ).not.toBeChecked();
    expect(window.localStorage.getItem(REGISTER_DRAFT_KEY)).toBeNull();
  });
});
