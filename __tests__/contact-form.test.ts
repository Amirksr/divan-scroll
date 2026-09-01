import { emptyContactForm, validateContactForm } from '../lib/contact-form';

describe('validateContactForm', () => {
  it('flags an entirely empty form', () => {
    const errors = validateContactForm(emptyContactForm);
    expect(errors.name).toBe('required');
    expect(errors.email).toBe('invalid');
    expect(errors.message).toBe('required');
  });

  it('accepts a fully valid submission', () => {
    const errors = validateContactForm({
      ...emptyContactForm,
      name: 'امیر',
      email: 'amir@example.com',
      message: 'میز برای دو نفر، جمعه شب.',
    });
    expect(errors).toEqual({});
  });

  it('rejects malformed emails', () => {
    const errors = validateContactForm({
      ...emptyContactForm,
      name: 'امیر',
      email: 'not-an-email',
      message: 'سلام',
    });
    expect(errors.email).toBe('invalid');
  });

  it('treats a whitespace-only name as missing', () => {
    const errors = validateContactForm({
      ...emptyContactForm,
      name: '   ',
      email: 'amir@example.com',
      message: 'سلام',
    });
    expect(errors.name).toBe('required');
  });

  it('treats a whitespace-only message as missing', () => {
    const errors = validateContactForm({
      ...emptyContactForm,
      name: 'امیر',
      email: 'amir@example.com',
      message: '   ',
    });
    expect(errors.message).toBe('required');
  });

  it('does not require phone, party size, or date', () => {
    const errors = validateContactForm({
      ...emptyContactForm,
      name: 'امیر',
      email: 'amir@example.com',
      message: 'سلام',
    });
    expect(errors).toEqual({});
  });

  it('does not mutate the input values object', () => {
    const values = { ...emptyContactForm, name: 'امیر' };
    const snapshot = { ...values };
    validateContactForm(values);
    expect(values).toEqual(snapshot);
  });
});
