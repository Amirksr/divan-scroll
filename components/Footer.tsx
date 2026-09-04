import { toTelHref } from '@/lib/format';
import NewsletterForm from './NewsletterForm';
import { translate, type Locale, type Messages } from '@/lib/i18n';

/**
 * Scoped port of DivanCafe's src/components/Footer.tsx, now locale-aware.
 * Phone/email/address are the real DivanCafe values -- address stays
 * Farsi-only either way (it's a physical Isfahan address; DivanCafe's own
 * English dictionary just transliterates the street names, which this
 * project keeps consistent with by using dict.footer.address per locale
 * the same way DivanCafe does).
 */
const YEAR = new Date().getFullYear();

export default function Footer({ locale, dict }: { locale: Locale; dict: Messages }) {
  const t = (key: string) => translate(dict, key);
  const prefix = `/${locale}`;

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-grid">
          <div>
            <p className="footer-wordmark">{dict.hero.title}</p>
            <p className="footer-tagline">{t('footer.tagline')}</p>
          </div>

          <nav aria-label={t('mobile_nav.aria_label')}>
            <p className="footer-heading">{t('footer.quick_links')}</p>
            <ul className="footer-list">
              <li><a href={`${prefix}#hero`} className="focus-ring">{t('nav.home')}</a></li>
              <li><a href={`${prefix}/menu`} className="focus-ring">{t('nav.menu')}</a></li>
              <li><a href={`${prefix}/about`} className="focus-ring">{t('nav.about')}</a></li>
              <li><a href={`${prefix}/contact`} className="focus-ring">{t('nav.contact')}</a></li>
            </ul>
          </nav>

          <div>
            <p className="footer-heading">{t('footer.contact_info')}</p>
            <ul id="footer-contact" className="footer-list">
              <li>{dict.footer.address}</li>
              <li dir="ltr" className="footer-ltr">
                <a href={toTelHref(dict.footer.phone_intl)} className="focus-ring">{dict.footer.phone}</a>
              </li>
              <li dir="ltr" className="footer-ltr">
                <a href={`mailto:${dict.footer.email}`} className="focus-ring">{dict.footer.email}</a>
              </li>
            </ul>
          </div>

          <div>
            <p className="footer-heading">{t('footer.newsletter')}</p>
            <p className="footer-newsletter-desc">{t('footer.newsletter_desc')}</p>
            <NewsletterForm dict={dict} />
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {YEAR} {dict.hero.title} — {t('footer.rights')}</p>
          <p>{t('footer.made_by')}</p>
        </div>
      </div>
    </footer>
  );
}
