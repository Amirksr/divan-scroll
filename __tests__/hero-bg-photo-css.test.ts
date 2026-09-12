import fs from 'fs';
import path from 'path';

/**
 * Regression test for a real production bug: `.hero-bg-photo` had no
 * position/sizing rules of its own -- it relied entirely on next/image's
 * `fill` prop (used only for the reduced-motion <Image> fallback) to become
 * absolutely positioned and fill .hero, since `fill` injects that via an
 * inline style. Once the hero background switched to a plain <video> for
 * the scroll-driven case (no `fill` equivalent available on <video>), the
 * video had no sizing/positioning of its own and rendered in-flow inside
 * .hero's flex row at its raw intrinsic dimensions.
 *
 * Two symptoms followed from that one root cause: (1) the video read as
 * "not scrolling" because it never filled the viewport the way the pinned
 * scroll effect assumed; (2) since it was then a real flex sibling of
 * .hero-inner, flexbox mirrors row order under RTL, so the video and the
 * hero text swapped sides between the fa (rtl) and en (ltr) locales.
 *
 * jsdom doesn't run layout, so this checks the CSS structure directly
 * (same approach as font-tokens-on-body.test.ts): `.hero-bg-photo` must
 * declare absolute positioning and full sizing so it's taken out of the
 * flex flow regardless of which element (img or video) wears the class.
 */
describe('.hero-bg-photo is taken out of the .hero flex flow', () => {
  const cssPath = path.join(__dirname, '..', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf8');
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');

  const rules: { selector: string; body: string }[] = [];
  const ruleRegex = /([^{}]+)\{([^{}]*)\}/g;
  let match: RegExpExecArray | null;
  while ((match = ruleRegex.exec(withoutComments)) !== null) {
    rules.push({ selector: match[1].trim(), body: match[2] });
  }

  const heroBgPhotoRules = rules.filter((r) =>
    r.selector.split(',').some((s) => s.trim() === '.hero-bg-photo')
  );

  it('declares a .hero-bg-photo rule', () => {
    expect(heroBgPhotoRules.length).toBeGreaterThan(0);
  });

  function declares(prop: string): boolean {
    const propRegex = new RegExp(`(^|[^-])${prop}\\s*:`, 'm');
    return heroBgPhotoRules.some((r) => propRegex.test(r.body));
  }

  it('declares position: absolute (removes it from normal/flex flow)', () => {
    expect(heroBgPhotoRules.some((r) => /(^|[^-])position\s*:\s*absolute/m.test(r.body))).toBe(
      true
    );
  });

  it('declares inset (or all four offsets) to anchor it to .hero', () => {
    const hasInset = declares('inset');
    const hasAllOffsets = ['top', 'right', 'bottom', 'left'].every((side) => declares(side));
    expect(hasInset || hasAllOffsets).toBe(true);
  });

  it('declares full width and height so it fills .hero regardless of intrinsic size', () => {
    expect(heroBgPhotoRules.some((r) => /(^|[^-])width\s*:\s*100%/m.test(r.body))).toBe(true);
    expect(heroBgPhotoRules.some((r) => /(^|[^-])height\s*:\s*100%/m.test(r.body))).toBe(true);
  });

  it('still declares object-fit: cover so a <video> crops the same way the old <Image fill> did', () => {
    expect(heroBgPhotoRules.some((r) => /object-fit\s*:\s*cover/m.test(r.body))).toBe(true);
  });
});
