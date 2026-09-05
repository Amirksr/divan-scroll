import fs from 'fs';
import path from 'path';

/**
 * Regression test for the off-canvas drawer's LTR/RTL closed-state
 * transform (see the comments above `--mobile-nav-closed-x` and
 * `.mobile-nav-drawer` in app/globals.css). Loads the real stylesheet
 * into jsdom rather than re-deriving the CSS by hand, so this fails if
 * the rule is ever removed/renamed instead of silently drifting from
 * the real file.
 *
 * Reads `--mobile-nav-closed-x` directly instead of the drawer's
 * `transform` -- jsdom's computed style does not resolve var() inside
 * `transform`, it only reports custom-property values verbatim, which
 * is also the more precise thing to assert: it isolates "is the flip
 * wired for this dir" from CSS transform syntax entirely.
 */
describe('mobile-nav-drawer direction-aware closed position', () => {
  const cssPath = path.join(__dirname, '..', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  function render(dir: 'rtl' | 'ltr') {
    document.documentElement.setAttribute('dir', dir);
    document.head.innerHTML = `<style>${css}</style>`;
    document.body.innerHTML = '<nav class="mobile-nav-drawer mobile-nav-drawer--open"></nav>';
    return document.querySelector('.mobile-nav-drawer') as HTMLElement;
  }

  afterEach(() => {
    document.documentElement.removeAttribute('dir');
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  // jsdom does not implement CSS custom-property inheritance through
  // getComputedStyle on descendants, so read the variable where it's
  // declared (<html>) rather than off the drawer element -- the previous
  // test already confirms the drawer's transform is wired to reference
  // exactly this variable, and real browsers do inherit it normally.
  it('closed-position variable is +100% for rtl (fa) and -100% for ltr (en)', () => {
    render('rtl');
    expect(getComputedStyle(document.documentElement).getPropertyValue('--mobile-nav-closed-x').trim()).toBe('100%');
    render('ltr');
    expect(getComputedStyle(document.documentElement).getPropertyValue('--mobile-nav-closed-x').trim()).toBe('-100%');
  });

  it('the closed transform literally references the direction-aware variable', () => {
    expect(css).toMatch(/\.mobile-nav-drawer\s*{[^}]*transform:\s*translateX\(var\(--mobile-nav-closed-x\)\)/);
  });

  // This is the case the first version of this fix got wrong: making the
  // closed-state override a higher-specificity selector (e.g.
  // `html[dir='ltr'] .mobile-nav-drawer`) would out-rank
  // `.mobile-nav-drawer--open`'s lower-specificity rule and the drawer
  // would then refuse to ever visually open on LTR pages. Asserting the
  // open transform directly (not via a dir-conditional variable) proves
  // that can't happen here: it has nothing to key off of per-dir.
  it('the open transform is a fixed literal, independent of dir (element rendered with both classes)', () => {
    expect(getComputedStyle(render('rtl')).transform).toBe('translateX(0)');
    expect(getComputedStyle(render('ltr')).transform).toBe('translateX(0)');
  });
});
