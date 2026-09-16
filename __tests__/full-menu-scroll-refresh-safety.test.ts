import fs from 'fs';
import path from 'path';

/**
 * Regression test for a real bug that isn't practically exercisable in
 * jsdom (it's a GSAP/Lenis runtime interaction, not a pure-function
 * result): jumpToCategory briefly called ScrollTrigger.refresh() right
 * before computing where to land, to fix a real staleness problem (see
 * the "settle correction" test below). But refresh() re-evaluates every
 * functional ScrollTrigger value on the page, including this trigger's
 * own `end`/`x` (invalidateOnRefresh: true) -- and doing that while the
 * pin is actively engaged is exactly the "footer/card snap right as the
 * pin releases" class of bug lib/scroll-utils.ts's width-keyed distance
 * cache already exists to guard against. Confirmed by shipping it: every
 * category jump started overshooting, not just the one case it was
 * originally meant to fix.
 *
 * This greps the component source directly rather than asserting on
 * behavior, matching this codebase's existing convention for defects
 * that live in DOM-timing interactions a jsdom render can't reproduce
 * (see hero-bg-photo-css.test.ts, i18n-fonts.test.tsx). Comments are
 * stripped first -- several deliberately name ScrollTrigger.refresh() in
 * prose to explain why it's absent or where it's safe, which would
 * otherwise read as a false-positive match.
 */
describe('FullMenuScroll does not refresh ScrollTrigger from the per-click jump path', () => {
  const rawSource = fs.readFileSync(
    path.join(__dirname, '..', 'components', 'FullMenuScroll.tsx'),
    'utf8'
  );
  // Line comments only -- this file has no /* */ blocks, and a naive
  // block-comment stripper risks eating real code if that ever changes.
  const source = rawSource
    .split('\n')
    .map((line) => line.replace(/\/\/.*$/, ''))
    .join('\n');

  function bodyOf(fnStartMarker: string, nextMarker: string): string {
    const start = source.indexOf(fnStartMarker);
    expect(start).toBeGreaterThanOrEqual(0);
    const end = source.indexOf(nextMarker, start);
    expect(end).toBeGreaterThan(start);
    return source.slice(start, end);
  }

  it('jumpToCategory contains no ScrollTrigger.refresh() call', () => {
    const jumpToCategoryBody = bodyOf(
      'const jumpToCategory = (slug: CategorySlug',
      'const handleTabClick ='
    );
    expect(jumpToCategoryBody).not.toMatch(/ScrollTrigger\.refresh\(\)/);
  });

  it('the one-time settle correction in the pin-setup effect is guarded on the pin not being active', () => {
    // The only two places ScrollTrigger.refresh() may legitimately appear:
    // this settle correction, and the deep-link effect's own one-time
    // pre-jump refresh (which is safe specifically because nothing has
    // been scrolled into yet at that point in the mount sequence).
    const refreshSites = source.match(/ScrollTrigger\.refresh\(\)/g) ?? [];
    expect(refreshSites.length).toBe(2);

    const setupEffectBody = bodyOf(
      'useIsomorphicLayoutEffect(() => {\n    if (!sectionRef.current',
      'return () => {\n      scrollTriggerRef.current = null;'
    );
    expect(setupEffectBody).toMatch(/document\.fonts\?\.ready/);
    expect(setupEffectBody).toMatch(/if \(!scrollTriggerRef\.current\?\.isActive\)/);
  });

  it("the deep-link effect's own refresh happens before the pin can be active (fires pre-jump, at mount)", () => {
    const deepLinkBody = bodyOf('const didDeepLinkRef = useRef(false);', '\n  return (');
    expect(deepLinkBody).toMatch(/ScrollTrigger\.refresh\(\)/);
  });
});
