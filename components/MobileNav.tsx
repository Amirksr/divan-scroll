'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { HomeIcon, MenuDocIcon, PeopleIcon, PhoneIcon, CloseIcon } from './icons';
import { translate, type Locale, type Messages } from '@/lib/i18n';

/** Delay between an item lighting up and the panel actually closing/navigating. */
const SELECT_DELAY_MS = 220;

/**
 * Ported from DivanCafe's src/components/MobileNav.tsx. Same off-canvas
 * mechanics (portal to <body>, backdrop, slide-in panel, staggered
 * select-then-navigate delay, background-scroll lock) and same panel
 * contents (nav links, ThemeToggle, LanguageSwitcher, reserve CTA) --
 * adapted to this project's plain CSS instead of Tailwind. Now locale-
 * aware: routes are /{locale}/... and LanguageSwitcher's reserved spot
 * is finally filled in.
 *
 * Also keeps two accessibility affordances that weren't in the original:
 * Escape-to-close and locking that only while open (DivanCafe's backdrop
 * already covers "click outside" -- clicking it closes the panel just
 * like clicking outside would).
 */
export default function MobileNav({ locale, dict }: { locale: Locale; dict: Messages }) {
  const [open, setOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const t = (key: string) => translate(dict, key);
  const prefix = `/${locale}`;

  const links = [
    { href: `${prefix}#hero`, label: t('nav.home'), Icon: HomeIcon },
    { href: `${prefix}/menu`, label: t('nav.menu'), Icon: MenuDocIcon },
    { href: `${prefix}/about`, label: t('nav.about'), Icon: PeopleIcon },
    { href: `${prefix}/contact`, label: t('nav.contact'), Icon: PhoneIcon },
  ];
  const contactHref = `${prefix}/contact`;

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

  const isActive = (href: string) => (href === `${prefix}#hero` ? pathname === prefix : pathname?.startsWith(href));

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
        aria-label={t('mobile_nav.aria_label')}
        className={open ? 'mobile-nav-drawer mobile-nav-drawer--open' : 'mobile-nav-drawer'}
      >
        <div className="mobile-nav-drawer-top">
          <Logo wordmark={dict.hero.title} isFa={locale === 'fa'} />
          <div className="mobile-nav-drawer-top-actions">
            <ThemeToggle dict={dict} />
            <button type="button" onClick={close} aria-label={t('mobile_nav.close_panel')} className="mobile-nav-close focus-ring">
              <CloseIcon className="mobile-nav-close-icon" />
            </button>
          </div>
        </div>

        <div className="mobile-nav-divider" />

        <ul className="mobile-nav-list">
          {links.map(({ href, label, Icon }) => {
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
                  {active && (
                    // Ported from DivanCafe's MobileNav.tsx: a thin
                    // rounded bar at the item's start edge (next to the
                    // icon, since RTL's inline-start is the right side)
                    // -- not just the background tint below.
                    <span aria-hidden="true" className="mobile-nav-item-active-bar" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mobile-nav-footer">
          <div className="mobile-nav-lang-row">
            <LanguageSwitcher locale={locale} />
          </div>
          <Link
            href={contactHref}
            onClick={(e) => {
              e.preventDefault();
              selectLink(contactHref);
            }}
            className="mobile-nav-cta focus-ring"
          >
            {t('nav.reserve')}
            <span aria-hidden="true">{locale === 'fa' ? '←' : '→'}</span>
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
        aria-label={open ? t('mobile_nav.close') : t('mobile_nav.open')}
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
