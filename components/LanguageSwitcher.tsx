'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';

/** Swaps just the /{locale} segment at the start of a path, keeping the rest. */
export function swapLocaleInPath(pathname: string, nextLocale: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  segments[0] = nextLocale;
  return `/${segments.join('/')}`;
}

const LABELS: Record<Locale, string> = { fa: 'فارسی', en: 'EN' };

/** Always matches the literal script of LABELS[loc] (Farsi/Latin), not
 * whichever locale the current page happens to be in -- see the CSS
 * comment above .language-switcher-link for why this can't just be
 * --font-current like the rest of the site's locale-aware text. */
const SCRIPT_CLASS: Record<Locale, string> = {
  fa: 'language-switcher-link--fa',
  en: 'language-switcher-link--en',
};

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? `/${locale}`;

  return (
    <div className="language-switcher" role="group" aria-label={locale === 'fa' ? 'زبان' : 'Language'}>
      {locales.map((loc, i) => (
        <span key={loc} className="language-switcher-item">
          {i > 0 && (
            <span aria-hidden="true" className="language-switcher-sep">
              /
            </span>
          )}
          <Link
            href={swapLocaleInPath(pathname, loc)}
            // Switching language is not a page change -- it re-renders the
            // page the reader is already partway through. Next.js scrolls
            // to the top on navigation by default, which threw away their
            // position; SmoothScroll's own reset is likewise keyed on the
            // locale-stripped path so Lenis doesn't undo this either.
            scroll={false}
            className={[
              'language-switcher-link',
              SCRIPT_CLASS[loc],
              loc === locale && 'language-switcher-link--active',
              'focus-ring',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-current={loc === locale ? 'true' : undefined}
          >
            {LABELS[loc]}
          </Link>
        </span>
      ))}
    </div>
  );
}
