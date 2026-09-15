import { stripLocaleFromPath } from '@/lib/i18n';

/**
 * Regression test for a real bug: SmoothScroll reset scroll to the top on
 * every `usePathname()` change. That's correct for Home -> Menu, but a
 * language switch (/fa/menu -> /en/menu) also changes the pathname while
 * staying on the same page, so the reader was thrown back to the top of a
 * page they were partway through. Keying the reset on the locale-stripped
 * path distinguishes the two.
 */
describe('stripLocaleFromPath', () => {
  it('reduces both locales of the same page to the same key', () => {
    expect(stripLocaleFromPath('/fa/menu')).toBe('/en/menu'.replace('/en', ''));
    expect(stripLocaleFromPath('/fa/menu')).toBe(stripLocaleFromPath('/en/menu'));
    expect(stripLocaleFromPath('/fa/about')).toBe(stripLocaleFromPath('/en/about'));
  });

  it('reduces both locale home paths to "/"', () => {
    expect(stripLocaleFromPath('/fa')).toBe('/');
    expect(stripLocaleFromPath('/en')).toBe('/');
    expect(stripLocaleFromPath('/fa')).toBe(stripLocaleFromPath('/en'));
  });

  it('still distinguishes genuinely different pages', () => {
    expect(stripLocaleFromPath('/fa/menu')).not.toBe(stripLocaleFromPath('/fa/about'));
    expect(stripLocaleFromPath('/fa')).not.toBe(stripLocaleFromPath('/fa/menu'));
    // ...including across a simultaneous locale change.
    expect(stripLocaleFromPath('/fa/menu')).not.toBe(stripLocaleFromPath('/en/about'));
  });

  it('preserves deeper nested segments', () => {
    expect(stripLocaleFromPath('/en/menu/coffee')).toBe('/menu/coffee');
  });

  it('leaves a path with no recognised locale prefix untouched', () => {
    expect(stripLocaleFromPath('/menu')).toBe('/menu');
    expect(stripLocaleFromPath('/')).toBe('/');
    expect(stripLocaleFromPath('/de/menu')).toBe('/de/menu');
  });

  it('does not treat a non-leading locale segment as a prefix', () => {
    expect(stripLocaleFromPath('/menu/fa')).toBe('/menu/fa');
  });
});
