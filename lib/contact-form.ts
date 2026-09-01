/**
 * Ported from DivanCafe's src/components/ContactForm.tsx
 * (validateContactForm + emptyContactForm), which keeps this logic inline
 * in the component file. Split out here instead, consistent with this
 * project's convention (see PROJECT_STATUS.md) of keeping pure/testable
 * logic in lib/*.ts, independent of React and the DOM.
 */

export interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  partySize: string;
  date: string;
  message: string;
}

export const emptyContactForm: ContactFormValues = {
  name: '',
  email: '',
  phone: '',
  partySize: '',
  date: '',
  message: '',
};

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, 'required' | 'invalid'>>;

/**
 * Basic shape validation shared between the form UI and its tests.
 * name/email/message are required; phone, partySize, and date are
 * optional (a reservation enquiry can arrive without them).
 */
export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};
  if (!values.name.trim()) errors.name = 'required';
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'invalid';
  if (!values.message.trim()) errors.message = 'required';
  return errors;
}
