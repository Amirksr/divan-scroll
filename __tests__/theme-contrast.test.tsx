import fs from 'fs';
import path from 'path';

/**
 * Regression tests for two light-theme readability bugs found while
 * investigating the reported unreadable card descriptions in the
 * "دفتر دیوان" (category cards) and "فضای دیوان" (space cards) sections:
 *
 * 1. Elements sitting on the hardcoded-dark photo scrims the top-of-file
 *    design comment calls out (hero, gallery cells, space cards, space
 *    lightbox nav/close buttons) were using --parchment/--parchment-rgb,
 *    which flips with the theme -- so in light theme their text/icons
 *    went dark-on-dark against a scrim that stays dark on purpose.
 *    Fixed via a new fixed --photo-text-rgb token.
 * 2. .category-card p (not on a photo -- the normal flipping page
 *    background) used the fixed --gold accent color, which sits at
 *    ~2.1:1 contrast against the light-theme background -- well under
 *    the ~4.5:1 WCAG AA minimum. Fixed via the theme-aware parchment
 *    token instead, at this project's own established card-description
 *    opacity (0.65, matching .about-value-card p / .space-card-desc).
 *
 * As with the other CSS regression tests in this project, this loads the
 * real globals.css into jsdom and checks the custom property / literal
 * CSS text (jsdom does not resolve var() inside `color`), rather than
 * re-deriving values by hand.
 */
describe('light-theme text/icon contrast', () => {
  const cssPath = path.join(__dirname, '..', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  function photoTextRgbFor(theme: 'dark' | 'light'): string {
    document.documentElement.className = theme === 'light' ? 'light' : '';
    document.head.innerHTML = `<style>${css}</style>`;
    return getComputedStyle(document.documentElement).getPropertyValue('--photo-text-rgb').trim();
  }

  afterEach(() => {
    document.documentElement.className = '';
    document.head.innerHTML = '';
  });

  it('--photo-text-rgb is identical in both themes (never flips)', () => {
    const dark = photoTextRgbFor('dark');
    const light = photoTextRgbFor('light');
    expect(dark).not.toBe('');
    expect(dark).toBe(light);
  });

  // Elements that sit on a hardcoded-dark photo scrim: must reference the
  // fixed token, not the theme-flipping parchment one.
  const photoScrimSelectors = [
    '.title-fa,\\s*\\n?\\s*\\.title-en',
    '.hero-description',
    '.subline',
    '.scroll-cue',
    '.gallery-cell-caption',
    '.space-card-title',
    '.space-card-desc',
    '.space-lightbox-close',
    '.space-lightbox-nav',
  ];

  it.each(photoScrimSelectors)('%s uses the fixed --photo-text-rgb, not the theme-flipping parchment', (selectorPattern) => {
    const rule = new RegExp(`${selectorPattern}\\s*{[^}]*}`);
    const match = css.match(rule);
    expect(match).not.toBeNull();
    // Strip CSS comments before asserting -- the fix's own explanatory
    // comments reference var(--parchment) as documentation (what the
    // bug used to be), which isn't actual declared CSS.
    const withoutComments = match![0].replace(/\/\*[\s\S]*?\*\//g, '');
    expect(withoutComments).toMatch(/color:\s*rgb\(var\(--photo-text-rgb\)/);
    expect(withoutComments).not.toMatch(/color:\s*(?:var\(--parchment\)|rgb\(var\(--parchment-rgb\))/);
  });

  it('.category-card p uses the theme-aware parchment token, not the fixed --gold accent', () => {
    const match = css.match(/\.category-card p\s*{[^}]*}/);
    expect(match).not.toBeNull();
    expect(match![0]).toMatch(/color:\s*rgb\(var\(--parchment-rgb\)\s*\/\s*0\.65\)/);
    expect(match![0]).not.toMatch(/color:\s*var\(--gold\)/);
  });

  // Sanity-check the actual composited contrast for .category-card p in
  // light theme, so a future opacity tweak can't silently regress below
  // WCAG AA (4.5:1) again the way the original --gold value did (~2.1:1).
  it('.category-card p composited contrast in light theme meets WCAG AA (>= 4.5:1)', () => {
    // light theme: --parchment-rgb: 28 22 19 (dark ink), page bg #faf5ec
    const [pr, pg, pb] = [28, 22, 19];
    const [br, bg, bb] = [250, 245, 236];
    const alpha = 0.65;
    const composite = (fg: number, bgc: number) => alpha * fg + (1 - alpha) * bgc;
    const [r, g, b] = [composite(pr, br), composite(pg, bg), composite(pb, bb)];

    const relLum = ([r, g, b]: number[]) => {
      const chan = (c: number) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
    };

    const lText = relLum([r, g, b]);
    const lBg = relLum([br, bg, bb]);
    const contrast = (Math.max(lText, lBg) + 0.05) / (Math.min(lText, lBg) + 0.05);
    expect(contrast).toBeGreaterThanOrEqual(4.5);
  });
});
