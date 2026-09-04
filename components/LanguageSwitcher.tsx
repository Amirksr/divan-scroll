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
            className={loc === locale ? 'language-switcher-link language-switcher-link--active focus-ring' : 'language-switcher-link focus-ring'}
            aria-current={loc === locale ? 'true' : undefined}
          >
            {LABELS[loc]}
          </Link>
        </span>
      ))}
    </div>
  );
}
