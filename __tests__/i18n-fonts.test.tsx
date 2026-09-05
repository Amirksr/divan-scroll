import fs from 'fs';
import path from 'path';

/**
 * Regression test for the post-i18n font bug: most content selectors in
 * globals.css were hardcoded to `var(--font-fa)` (Vazirmatn) from the
 * project's original Farsi-only design. Once route-level i18n made their
 * text genuinely English on /en pages (dict-driven, not the couple of
 * literal always-fa glyphs like the hero's "دیوان"), those selectors kept
 * rendering real English copy in a Farsi font instead of following
 * --font-body (Inter) the way the rest of the design's tokens intended.
 *
 * Loads the real globals.css into jsdom rather than re-deriving values by
 * hand. jsdom does not resolve var() inside `font-family` in
 * getComputedStyle (confirmed by hand before writing this), so this
 * checks the --font-current custom property itself (which jsdom does
 * expose verbatim) plus the literal CSS text for wiring, rather than
 * asserting a browser-resolved font stack.
 */
describe('locale-aware content font (--font-current)', () => {
  const cssPath = path.join(__dirname, '..', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  function currentFontFor(lang: 'fa' | 'en'): string {
    document.documentElement.setAttribute('lang', lang);
    document.head.innerHTML = `<style>${css}</style>`;
    return getComputedStyle(document.documentElement).getPropertyValue('--font-current').trim();
  }

  afterEach(() => {
    document.documentElement.removeAttribute('lang');
    document.head.innerHTML = '';
  });

  it('defaults to --font-fa (Vazirmatn) for fa and switches to --font-body (Inter) for en', () => {
    expect(currentFontFor('fa')).toBe('var(--font-fa)');
    expect(currentFontFor('en')).toBe('var(--font-body)');
  });

  // A representative sample of dict-/prop-driven content selectors across
  // different sections (menu, about, cart, gallery, contact, nav) --
  // not exhaustive, but enough to catch the whole class of bug coming
  // back if someone hardcodes --font-fa again on new or edited content.
  const contentSelectors = [
    '.hero-description',
    '.categories-title',
    '.category-card h3',
    '.about-title',
    '.about-paragraph',
    '.site-nav-link',
    '.mobile-nav-item',
    '.footer-wordmark',
    '.item-modal-title',
    '.cart-panel-line-name',
    '.gallery-title',
    '.ambiance-title',
    '.space-card-body',
    '.contact-title',
    '.contact-input',
  ];

  it.each(contentSelectors)('%s uses the locale-aware --font-current, not the fa-only literal', (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rule = new RegExp(`${escaped}\\s*{[^}]*}`);
    const match = css.match(rule);
    expect(match).not.toBeNull();
    expect(match![0]).toMatch(/font-family:\s*var\(--font-current\)/);
  });

  // These render a literal, always-Farsi glyph (e.g. the hero's "دیوان")
  // regardless of route locale -- they have no translated counterpart to
  // switch to, so they must keep referencing --font-fa directly rather
  // than the locale-aware alias.
  const literalFaSelectors = ['.title-fa', '.logo-wordmark'];

  it.each(literalFaSelectors)('%s keeps the literal --font-fa (always-Farsi content, not dict-driven)', (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rule = new RegExp(`${escaped}\\s*{[^}]*}`);
    const match = css.match(rule);
    expect(match).not.toBeNull();
    expect(match![0]).toMatch(/font-family:\s*var\(--font-fa\)/);
  });
});
