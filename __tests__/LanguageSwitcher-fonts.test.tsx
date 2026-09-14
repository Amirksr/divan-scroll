import { render } from '@testing-library/react';
import LanguageSwitcher from '../components/LanguageSwitcher';

jest.mock('next/navigation', () => ({
  usePathname: () => '/fa',
}));

/**
 * Regression test for a real bug: .language-switcher-link had no
 * font-family at all, so both options fell back to body's --font-body
 * (Inter). Unlike every other locale-aware selector in the app, this one
 * always renders BOTH scripts side by side regardless of the current
 * route's locale -- the fa option's label is the literal word "فارسی",
 * the en option's is the literal "EN" -- so a single --font-current can't
 * be correct for both at once. Each option needs its own literal-script
 * class (mirroring .title-fa/.title-en and .logo-wordmark/--en).
 */
describe('<LanguageSwitcher /> per-option script class', () => {
  it('gives the fa option --font-fa and the en option --font-body, regardless of the current route locale', () => {
    const { container } = render(<LanguageSwitcher locale="fa" />);
    const links = container.querySelectorAll('.language-switcher-link');
    expect(links).toHaveLength(2);

    const faLink = Array.from(links).find((el) => el.textContent === 'فارسی');
    const enLink = Array.from(links).find((el) => el.textContent === 'EN');

    expect(faLink).toBeDefined();
    expect(enLink).toBeDefined();
    expect(faLink!.classList.contains('language-switcher-link--fa')).toBe(true);
    expect(faLink!.classList.contains('language-switcher-link--en')).toBe(false);
    expect(enLink!.classList.contains('language-switcher-link--en')).toBe(true);
    expect(enLink!.classList.contains('language-switcher-link--fa')).toBe(false);
  });

  it('marks the current locale active without affecting its script class', () => {
    const { container } = render(<LanguageSwitcher locale="fa" />);
    const links = container.querySelectorAll('.language-switcher-link');
    const activeLink = Array.from(links).find((el) =>
      el.classList.contains('language-switcher-link--active')
    );
    expect(activeLink?.textContent).toBe('فارسی');
    expect(activeLink?.classList.contains('language-switcher-link--fa')).toBe(true);
  });
});
