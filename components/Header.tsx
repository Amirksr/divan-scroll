'use client';

import Link from 'next/link';
import Logo from './Logo';

/**
 * Scoped port of DivanCafe's src/components/Header.tsx. Dropped for now:
 * ThemeToggle, CartButton, LanguageSwitcher, MobileNav, and route-based
 * active-link detection (usePathname). Reserve keeps the same visual
 * treatment (outlined copper pill) as the real header's CTA.
 *
 * Links use `/#section` (absolute path + hash) rather than bare `#section`
 * because Header is global (rendered on every route via layout.tsx) — a
 * bare `#hero` href would silently do nothing on /menu, which has no
 * element with that id.
 */
const NAV_LINKS = [
  { href: '/#hero', label: 'خانه' },
  { href: '/#about', label: 'درباره دیوان' },
  { href: '/menu', label: 'منوی کامل' },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="focus-ring">
          <Logo wordmark="دیوان" />
        </Link>

        <nav className="site-nav" aria-label="ناوبری اصلی">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="site-nav-link focus-ring">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/#footer-contact" className="reserve-pill focus-ring">
          رزرو میز
        </Link>
      </div>
    </header>
  );
}
