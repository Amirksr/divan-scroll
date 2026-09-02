'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { HomeIcon, MenuDocIcon, PeopleIcon, PhoneIcon, CloseIcon } from './icons';

interface NavLink {
  href: string;
  label: string;
  Icon: typeof HomeIcon;
}

const LINKS: NavLink[] = [
  { href: '/#hero', label: 'خانه', Icon: HomeIcon },
  { href: '/menu', label: 'منوی کامل', Icon: MenuDocIcon },
  { href: '/about', label: 'درباره دیوان', Icon: PeopleIcon },
  { href: '/contact', label: 'ارتباط با دیوان', Icon: PhoneIcon },
];

/** Delay between an item lighting up and the panel actually closing/navigating. */
const SELECT_DELAY_MS = 220;

/**
 * Ported from DivanCafe's src/components/MobileNav.tsx. Same off-canvas
 * mechanics (portal to <body>, backdrop, slide-in panel, staggered
 * select-then-navigate delay, background-scroll lock) and same panel
 * contents (nav links, ThemeToggle, reserve CTA) -- adapted to
 * divan-scroll's flat routes (no /{locale} prefix) and this project's
 * plain CSS instead of Tailwind. A LanguageSwitcher will slot in next to
 * ThemeToggle here once i18n routing lands (see the reserved spot below);
 * this project is still Farsi-only for now.
 *
 * Also keeps two accessibility affordances that weren't in the original:
 * Escape-to-close and locking that only while open (DivanCafe's backdrop
 * already covers "click outside" -- clicking it closes the panel just
 * like clicking outside would).
 */
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // The backdrop/panel are portaled straight to <body> instead of rendering
  // in place, same reasoning as DivanCafe's original: an ancestor with a
  // blur/filter (the sticky, backdrop-blurred <header>) establishes a new
  // containing block for `position: fixed` descendants, so without the
  // portal the panel would be confined to the header's own bounding box.
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const isActive = (href: string) => (href === '/#hero' ? pathname === '/' : pathname?.startsWith(href));

  function close() {
    setOpen(false);
    setPendingHref(null);
    toggleRef.current?.focus();
  }

  function selectLink(href: string) {
    setPendingHref(href);
    window.setTimeout(() => {
      setOpen(false);
      setPendingHref(null);
      router.push(href);
    }, SELECT_DELAY_MS);
  }

  const panel = (
    <>
      <div aria-hidden="true" onClick={close} className={open ? 'mobile-nav-backdrop mobile-nav-backdrop--open' : 'mobile-nav-backdrop'} />

      <nav
        id="mobile-nav-panel"
        aria-label="ناوبری اصلی"
        className={open ? 'mobile-nav-drawer mobile-nav-drawer--open' : 'mobile-nav-drawer'}
      >
        <div className="mobile-nav-drawer-top">
          <Logo wordmark="دیوان" />
          <div className="mobile-nav-drawer-top-actions">
            <ThemeToggle />
            {/* Reserved for LanguageSwitcher once i18n routing lands. */}
            <button type="button" onClick={close} aria-label="بستن پنل ناوبری" className="mobile-nav-close focus-ring">
              <CloseIcon className="mobile-nav-close-icon" />
            </button>
          </div>
        </div>

        <div className="mobile-nav-divider" />

        <ul className="mobile-nav-list">
          {LINKS.map(({ href, label, Icon }) => {
            const active = pendingHref === href || (!pendingHref && isActive(href));
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    selectLink(href);
                  }}
                  className={active ? 'mobile-nav-item mobile-nav-item--active focus-ring' : 'mobile-nav-item focus-ring'}
                >
                  <Icon className="mobile-nav-item-icon" />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mobile-nav-cta-row">
          <Link
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              selectLink('/contact');
            }}
            className="mobile-nav-cta focus-ring"
          >
            رزرو میز
            <span aria-hidden="true">←</span>
          </Link>
        </div>
      </nav>
    </>
  );

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="mobile-nav-toggle focus-ring"
        aria-label={open ? 'بستن منو' : 'باز کردن منو'}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={open ? 'mobile-nav-icon mobile-nav-icon--open' : 'mobile-nav-icon'} aria-hidden="true" />
      </button>

      {mounted && createPortal(panel, document.body)}
    </>
  );
}
