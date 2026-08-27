import { toTelHref } from '@/lib/format';

/**
 * Scoped port of DivanCafe's src/components/Footer.tsx. Tagline, address,
 * phone, and email are the real values from DivanCafe's messages/fa.json.
 * Dropped: the newsletter signup form (NewsletterForm.tsx posts to a real
 * backend endpoint that doesn't exist in this standalone repo — showing a
 * form that silently does nothing would be worse than not showing one).
 */
const YEAR = new Date().getFullYear();
const PHONE = '۰۳۱-۳۲۲۰۱۵۵۵';
const PHONE_INTL = '+98 31 3220 1555';
const EMAIL = 'hello@divan-cafe.ir';
const ADDRESS = 'اصفهان، خیابان چهارباغ عباسی، کوچه‌ی نارنجستان، پلاک ۱۲';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-grid">
          <div>
            <p className="footer-wordmark">دیوان</p>
            <p className="footer-tagline">دیوان — دفتری برای قهوه، شعر و گفت‌وگوهای طولانی.</p>
          </div>

          <nav aria-label="فوتر">
            <p className="footer-heading">دسترسی سریع</p>
            <ul className="footer-list">
              <li><a href="/#hero" className="focus-ring">خانه</a></li>
              <li><a href="/about" className="focus-ring">درباره دیوان</a></li>
              <li><a href="/menu" className="focus-ring">منوی کامل</a></li>
            </ul>
          </nav>

          <div>
            <p className="footer-heading">اطلاعات تماس</p>
            <ul id="footer-contact" className="footer-list">
              <li>{ADDRESS}</li>
              <li dir="ltr" className="footer-ltr">
                <a href={toTelHref(PHONE_INTL)} className="focus-ring">{PHONE}</a>
              </li>
              <li dir="ltr" className="footer-ltr">
                <a href={`mailto:${EMAIL}`} className="focus-ring">{EMAIL}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {YEAR} دیوان — کلیه حقوق محفوظ است.</p>
          <p>طراحی و توسعه با ❤</p>
        </div>
      </div>
    </footer>
  );
}
