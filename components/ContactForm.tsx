'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import {
  emptyContactForm,
  validateContactForm,
  type ContactFormErrors,
  type ContactFormValues,
} from '@/lib/contact-form';
import { translate, type Messages } from '@/lib/i18n';

/**
 * Scoped port of DivanCafe's src/components/ContactForm.tsx. Validation
 * logic itself lives in lib/contact-form.ts rather than in this file, to
 * match this project's lib/component split.
 */
export default function ContactForm({ dict }: { dict: Messages }) {
  const [values, setValues] = useState<ContactFormValues>(emptyContactForm);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const t = (key: string) => translate(dict, key);

  function update<K extends keyof ContactFormValues>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateContactForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div role="status" className="contact-submitted">
        <p className="contact-submitted-headline">{t('contact_page.form.submitted_headline')}</p>
        <p className="contact-submitted-body">{t('contact_page.form.submitted_body')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="contact-form">
      <h2 className="contact-form-title">{t('contact_page.form.reserve_title')}</h2>

      <Field label={t('contact_page.form.name')} htmlFor="contact-name" error={errors.name} dict={dict}>
        <input
          id="contact-name"
          value={values.name}
          onChange={(e) => update('name', e.target.value)}
          className="contact-input"
          aria-invalid={Boolean(errors.name)}
        />
      </Field>

      <div className="contact-field-row">
        <Field label={t('contact_page.form.email')} htmlFor="contact-email" error={errors.email} dict={dict}>
          <input
            id="contact-email"
            type="email"
            dir="ltr"
            value={values.email}
            onChange={(e) => update('email', e.target.value)}
            className="contact-input"
            aria-invalid={Boolean(errors.email)}
          />
        </Field>
        <Field label={t('contact_page.form.phone')} htmlFor="contact-phone" dict={dict}>
          <input
            id="contact-phone"
            type="tel"
            dir="ltr"
            value={values.phone}
            onChange={(e) => update('phone', e.target.value)}
            className="contact-input"
          />
        </Field>
      </div>

      <div className="contact-field-row">
        <Field label={t('contact_page.form.party_size')} htmlFor="contact-party-size" dict={dict}>
          <input
            id="contact-party-size"
            type="number"
            min={1}
            max={20}
            value={values.partySize}
            onChange={(e) => update('partySize', e.target.value)}
            className="contact-input"
          />
        </Field>
        <Field label={t('contact_page.form.date')} htmlFor="contact-date" dict={dict}>
          <input
            id="contact-date"
            type="date"
            value={values.date}
            onChange={(e) => update('date', e.target.value)}
            className="contact-input"
          />
        </Field>
      </div>

      <Field label={t('contact_page.form.message')} htmlFor="contact-message" error={errors.message} dict={dict}>
        <textarea
          id="contact-message"
          rows={4}
          value={values.message}
          onChange={(e) => update('message', e.target.value)}
          className="contact-input"
          aria-invalid={Boolean(errors.message)}
        />
      </Field>

      <button type="submit" className="contact-submit">
        {t('contact_page.form.submit')}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  dict,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: 'required' | 'invalid';
  dict: Messages;
  children: ReactNode;
}) {
  const t = (key: string) => translate(dict, key);
  return (
    <label htmlFor={htmlFor} className="contact-field">
      {label}
      {children}
      {error && (
        <span className="contact-field-error" role="alert">
          {error === 'required' ? t('contact_page.form.required') : t('contact_page.form.invalid_email')}
        </span>
      )}
    </label>
  );
}
