'use client';

import { translate, type Messages } from '@/lib/i18n';

/**
 * Scoped port of DivanCafe's src/components/NewsletterForm.tsx. Note that
 * the original is also just `onSubmit={(e) => e.preventDefault()}` with no
 * real backend behind it -- so this isn't a functional regression versus
 * DivanCafe, just a faithful port of the same (also non-functional) form.
 */
export default function NewsletterForm({ dict }: { dict: Messages }) {
  const t = (key: string) => translate(dict, key);

  return (
    <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="newsletter-email" className="sr-only">
        {t('footer.newsletter_placeholder')}
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        dir="ltr"
        placeholder={t('footer.newsletter_placeholder')}
        className="newsletter-input"
      />
      <button type="submit" className="newsletter-submit">
        {t('footer.newsletter_cta')}
      </button>
    </form>
  );
}
