import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Field } from './Field';
import { Select } from './Select';
import { TextInput } from './TextInput';
import { Textarea } from './Textarea';

describe('Field + controls', () => {
  it('associates the label with the wrapped control', () => {
    render(
      <Field label="Full name">
        <TextInput />
      </Field>,
    );
    expect(screen.getByLabelText('Full name').tagName).toBe('INPUT');
  });

  it('associates labels with Select and Textarea too', () => {
    render(
      <div>
        <Field label="Grade">
          <Select>
            <option value="g4">Grade 4</option>
          </Select>
        </Field>
        <Field label="Notes">
          <Textarea />
        </Field>
        ,
      </div>,
    );
    expect(screen.getByLabelText('Grade').tagName).toBe('SELECT');
    expect(screen.getByLabelText('Notes').tagName).toBe('TEXTAREA');
  });

  it('focuses the control when the label is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Field label="Email">
        <TextInput type="email" />
      </Field>,
    );
    await user.click(screen.getByText('Email'));
    expect(screen.getByLabelText('Email')).toHaveFocus();
  });

  it('wires hint and error via aria-describedby and marks the control invalid', () => {
    render(
      <Field label="Phone" hint="11 digits, starting with 01" error="Invalid mobile number">
        <TextInput />
      </Field>,
    );
    const input = screen.getByLabelText('Phone');
    expect(input).toHaveAttribute('aria-invalid', 'true');

    const describedBy = input.getAttribute('aria-describedby') ?? '';
    expect(describedBy).toContain(screen.getByText('11 digits, starting with 01').id);
    expect(describedBy).toContain(screen.getByText('Invalid mobile number').id);

    expect(screen.getByText('Invalid mobile number')).toHaveAttribute('role', 'alert');
  });

  it('keeps the hint visible when an error is shown', () => {
    render(
      <Field label="Phone" hint="11 digits" error="Invalid mobile number">
        <TextInput />
      </Field>,
    );
    expect(screen.getByText('11 digits')).toBeInTheDocument();
    expect(screen.getByText('Invalid mobile number')).toBeInTheDocument();
  });

  it('marks required controls with aria-required', () => {
    render(
      <Field label="Grade" isRequired>
        <TextInput />
      </Field>,
    );
    // Regex: the required asterisk is aria-hidden but part of the text content.
    expect(screen.getByLabelText(/Grade/)).toHaveAttribute('aria-required', 'true');
  });

  it('does not mark valid controls as invalid', () => {
    render(
      <Field label="School">
        <TextInput />
      </Field>,
    );
    expect(screen.getByLabelText('School')).not.toHaveAttribute('aria-invalid');
    expect(screen.getByLabelText('School')).not.toHaveAttribute('aria-describedby');
  });
});
