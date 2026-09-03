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
