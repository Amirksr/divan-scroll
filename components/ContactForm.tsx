'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import {
  emptyContactForm,
  validateContactForm,
  type ContactFormErrors,
  type ContactFormValues,
} from '@/lib/contact-form';

/**
 * Scoped port of DivanCafe's src/components/ContactForm.tsx, rendered
 * Farsi-only (consistent with Header/Footer/AboutStory, which are also
 * Farsi-only until real i18n routing exists — see README). Validation
 * logic itself lives in lib/contact-form.ts rather than in this file, to
 * match this project's lib/component split.
 */
export default function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(emptyContactForm);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

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
        <p className="contact-submitted-headline">✓ پیام دریافت شد</p>
        <p className="contact-submitted-body">به‌زودی برای تأیید رزرو با شما تماس می‌گیریم.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="contact-form">
      <h2 className="contact-form-title">رزرو میز</h2>

      <Field label="نام شما" htmlFor="contact-name" error={errors.name}>
        <input
          id="contact-name"
          value={values.name}
          onChange={(e) => update('name', e.target.value)}
          className="contact-input"
          aria-invalid={Boolean(errors.name)}
        />
      </Field>

      <div className="contact-field-row">
        <Field label="ایمیل" htmlFor="contact-email" error={errors.email}>
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
        <Field label="شماره تماس" htmlFor="contact-phone">
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
        <Field label="تعداد نفرات" htmlFor="contact-party-size">
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
        <Field label="تاریخ" htmlFor="contact-date">
          <input
            id="contact-date"
            type="date"
            value={values.date}
            onChange={(e) => update('date', e.target.value)}
            className="contact-input"
          />
        </Field>
      </div>

      <Field label="پیام شما" htmlFor="contact-message" error={errors.message}>
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
        ارسال پیام
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: 'required' | 'invalid';
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="contact-field">
      {label}
      {children}
      {error && (
        <span className="contact-field-error" role="alert">
          {error === 'required' ? 'این فیلد الزامی است.' : 'ایمیل معتبر نیست.'}
        </span>
      )}
    </label>
  );
}
