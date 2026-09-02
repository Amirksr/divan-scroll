'use client';

/**
 * Scoped port of DivanCafe's src/components/NewsletterForm.tsx. Note that
 * the original is also just `onSubmit={(e) => e.preventDefault()}` with no
 * real backend behind it -- so this isn't a functional regression versus
 * DivanCafe, just a faithful port of the same (also non-functional) form.
 */
export default function NewsletterForm() {
  return (
    <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="newsletter-email" className="sr-only">
        ایمیل شما
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        dir="ltr"
        placeholder="ایمیل شما"
        className="newsletter-input"
      />
      <button type="submit" className="newsletter-submit">
        عضویت
      </button>
    </form>
  );
}
