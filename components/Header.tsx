'use client';

import Logo from './Logo';

/**
 * Scoped port of DivanCafe's src/components/Header.tsx. Dropped for now:
 * ThemeToggle, CartButton, LanguageSwitcher, MobileNav, and route-based
 * active-link detection (usePathname) — divan-scroll is a single page with
 * anchor sections, not DivanCafe's multi-route i18n app. Reserve keeps the
 * same visual treatment (outlined copper pill) as the real header's CTA.
 */
const NAV_LINKS = [
  { href: '#hero', label: 'خانه' },
  { href: '#menu-scroll', label: 'منو' },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a href="#hero" className="focus-ring">
          <Logo wordmark="دیوان" />
        </a>

        <nav className="site-nav" aria-label="ناوبری اصلی">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="site-nav-link focus-ring">
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#footer-contact" className="reserve-pill focus-ring">
          رزرو میز
        </a>
      </div>
    </header>
  );
}
