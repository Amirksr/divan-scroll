import en from '../messages/en.json';
import fa from '../messages/fa.json';

export const locales = ['fa', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fa';

export const localeDirection: Record<Locale, 'rtl' | 'ltr'> = {
  fa: 'rtl',
  en: 'ltr',
};

const dictionaries = { en, fa };

export type Messages = typeof fa;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale] as Messages;
}

/**
 * Resolves a dot-notated key path (e.g. "hero.title") against a messages
 * object. Returns the key itself if nothing is found, so missing
 * translations fail loudly in the UI instead of crashing the render.
 */
export function translate(messages: Messages, key: string): string {
  const parts = key.split('.');
  let node: unknown = messages;
  for (const part of parts) {
    if (node == null || typeof node !== 'object' || !(part in node)) {
      return key;
    }
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === 'string' ? node : key;
}

/**
 * Strips the leading locale segment from a pathname, returning the
 * locale-independent part: "/fa/menu" and "/en/menu" both become "/menu",
 * and "/fa" / "/en" both become "/".
 *
 * Used to tell a real page change apart from a pure locale switch.
 * SmoothScroll resets scroll to the top whenever the pathname changes,
 * which is right when navigating Home -> Menu but wrong when the user
 * just switches language on the page they're already reading: /fa/menu ->
 * /en/menu is the same page, so their scroll position should survive.
 * Leaves a path with no recognised locale prefix untouched.
 */
export function stripLocaleFromPath(pathname: string): string {
  const segments = pathname.split('/');
  // segments[0] is the empty string before the leading slash.
  if (segments.length > 1 && isLocale(segments[1])) {
    const rest = segments.slice(2).join('/');
    return rest ? `/${rest}` : '/';
  }
  return pathname;
}
