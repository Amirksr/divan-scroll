import Link from 'next/link';
import Logo from './Logo';
import CartButton from './CartButton';
import ThemeToggle from './ThemeToggle';
import MobileNav from './MobileNav';
import LanguageSwitcher from './LanguageSwitcher';
import { translate, type Locale, type Messages } from '@/lib/i18n';

/**
 * Scoped port of DivanCafe's src/components/Header.tsx, now locale-aware
 * (locale/dict passed down from app/[locale]/layout.tsx, same as
 * DivanCafe's own Header).
 *
 * The reserve CTA and the old plain mobile-dropdown were replaced with a
 * single off-canvas MobileNav (components/MobileNav.tsx), a faithful port
 * of DivanCafe's actual off-canvas panel: it now carries the nav links,
 * ThemeToggle, LanguageSwitcher, and the reserve button, so this
 * persistent bar only holds the logo, the desktop nav row (which nav
 * links still also live in, for >=1024px users), the cart, and the menu
 * toggle -- no separate reserve pill competing for space here anymore.
 *
 * The off-canvas toggle itself (.mobile-nav-toggle, in MobileNav) is
 * CSS-hidden at >=1024px -- that's genuinely a mobile/tablet affordance
 * for a space-constrained header, not something a desktop nav bar with
 * room for the full .site-nav link row needs too. LanguageSwitcher is
 * rendered a second time here (also >=1024px only, via
 * .site-header-lang) so switching language doesn't become off-canvas-
 * only once the toggle that used to be the only way to reach it is
 * gone -- the copy inside MobileNav's panel still covers <1024px.
 */
export default function Header({ locale, dict }: { locale: Locale; dict: Messages }) {
  const t = (key: string) => translate(dict, key);
  const prefix = `/${locale}`;

  const navLinks = [
    { href: `${prefix}#hero`, label: t('nav.home') },
    { href: `${prefix}/menu`, label: t('nav.menu') },
    { href: `${prefix}/about`, label: t('nav.about') },
    { href: `${prefix}/contact`, label: t('nav.contact') },
  ];

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href={prefix} className="focus-ring">
          <Logo wordmark={dict.hero.title} isFa={locale === 'fa'} />
        </Link>

        <nav className="site-nav" aria-label={t('mobile_nav.aria_label')}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="site-nav-link focus-ring">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="site-header-actions">
          <div className="site-header-lang">
            <LanguageSwitcher locale={locale} />
          </div>
          <ThemeToggle dict={dict} />
          <CartButton locale={locale} dict={dict} />
          <MobileNav locale={locale} dict={dict} />
        </div>
      </div>
    </header>
  );
}
