import { getMessages, isLocale, locales, localeDirection, translate } from '../lib/i18n';

describe('isLocale', () => {
  it('accepts every configured locale', () => {
    for (const locale of locales) {
      expect(isLocale(locale)).toBe(true);
    }
  });

  it('rejects unsupported locale strings', () => {
    expect(isLocale('de')).toBe(false);
    expect(isLocale('')).toBe(false);
    expect(isLocale('FA')).toBe(false); // case-sensitive by design
  });
});

describe('localeDirection', () => {
  it('maps fa to rtl and en to ltr', () => {
    expect(localeDirection.fa).toBe('rtl');
    expect(localeDirection.en).toBe('ltr');
  });
});

describe('getMessages', () => {
  it('returns the matching dictionary for each locale', () => {
    expect(getMessages('fa').hero.title).toBe('دیوان');
    expect(getMessages('en').hero.title).toBe('Divan');
  });
});

describe('translate', () => {
  const messages = getMessages('en');

  it('resolves a nested dot-path key', () => {
    expect(translate(messages, 'hero.title')).toBe('Divan');
  });

  it('resolves a deeply nested key', () => {
    expect(translate(messages, 'contact_page.form.name')).toBe('Your name');
  });

  it('falls back to the key itself when the path is missing', () => {
    expect(translate(messages, 'nope.not.real')).toBe('nope.not.real');
  });

  it('falls back to the key when the resolved node is not a string', () => {
    expect(translate(messages, 'contact_page.form')).toBe('contact_page.form');
  });
});
