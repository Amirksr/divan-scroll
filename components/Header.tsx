'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';

/**
 * Scoped port of DivanCafe's src/components/Header.tsx. Dropped for now:
 * ThemeToggle, CartButton, LanguageSwitcher, and route-based active-link
 * detection (usePathname). Reserve keeps the same visual treatment
 * (outlined copper pill) as the real header's CTA.
 *
 * MobileNav (dropped from the initial port) is now implemented below --
 * .site-nav is display:none under 1024px with no fallback otherwise,
 * meaning /menu and /about were completely unreachable from the header
 * on any phone or tablet.
 *
 * Links use `/#section` (absolute path + hash) rather than bare `#section`
 * because Header is global (rendered on every route via layout.tsx) — a
 * bare `#hero` href would silently do nothing on /menu, which has no
 * element with that id.
 */
const NAV_LINKS = [
  { href: '/#hero', label: 'خانه' },
  { href: '/about', label: 'درباره دیوان' },
  { href: '/menu', label: 'منوی کامل' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Close on Escape, and on any click outside the panel/toggle button.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || toggleRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onClickOutside);
    firstLinkRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [open]);

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
          <Link href="/#footer-contact" className="reserve-pill focus-ring">
            رزرو میز
          </Link>

          <button
            ref={toggleRef}
            type="button"
            className="mobile-nav-toggle focus-ring"
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
            aria-label={open ? 'بستن منو' : 'باز کردن منو'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={open ? 'mobile-nav-icon mobile-nav-icon--open' : 'mobile-nav-icon'} aria-hidden="true" />
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav-panel" ref={panelRef} className="mobile-nav-panel">
          <nav aria-label="ناوبری موبایل">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                ref={i === 0 ? firstLinkRef : undefined}
                className="mobile-nav-link focus-ring"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
