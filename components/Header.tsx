import Link from 'next/link';
import Logo from './Logo';
import CartButton from './CartButton';
import ThemeToggle from './ThemeToggle';
import MobileNav from './MobileNav';

/**
 * Scoped port of DivanCafe's src/components/Header.tsx. Still dropped:
 * LanguageSwitcher and route-based active-link detection (usePathname) --
 * those return once i18n routing lands.
 *
 * The reserve CTA and the old plain mobile-dropdown were replaced with a
 * single off-canvas MobileNav (components/MobileNav.tsx), a faithful port
 * of DivanCafe's actual off-canvas panel: it now carries the nav links,
 * ThemeToggle, and the reserve button, so this persistent bar only holds
 * the logo, the desktop nav row (which nav links still also live in, for
 * >=1024px users), the cart, and the menu toggle -- no separate reserve
 * pill competing for space here anymore.
 *
 * Links use `/#section` (absolute path + hash) rather than bare `#section`
 * because Header is global (rendered on every route via layout.tsx) -- a
 * bare `#hero` href would silently do nothing on /menu, which has no
 * element with that id.
 */
const NAV_LINKS = [
  { href: '/#hero', label: 'خانه' },
  { href: '/menu', label: 'منوی کامل' },
  { href: '/about', label: 'درباره دیوان' },
  { href: '/contact', label: 'ارتباط با دیوان' },
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

        <div className="site-header-actions">
          <ThemeToggle />
          <CartButton />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
