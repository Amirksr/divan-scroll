import { swapLocaleInPath } from '../components/LanguageSwitcher';

describe('swapLocaleInPath', () => {
  it('swaps the locale segment on the home path', () => {
    expect(swapLocaleInPath('/fa', 'en')).toBe('/en');
  });

  it('swaps the locale segment while preserving the rest of the path', () => {
    expect(swapLocaleInPath('/fa/menu', 'en')).toBe('/en/menu');
    expect(swapLocaleInPath('/en/about', 'fa')).toBe('/fa/about');
  });

  it('preserves deeper nested segments', () => {
    expect(swapLocaleInPath('/fa/menu/coffee', 'en')).toBe('/en/menu/coffee');
  });
});
