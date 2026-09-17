import fs from 'fs';
import path from 'path';

/**
 * Regression tests for two real bugs that aren't practically exercisable
 * in jsdom (they're GSAP/Lenis runtime interactions, not pure-function
 * results):
 *
 * 1. jumpToCategory briefly called ScrollTrigger.refresh() right before
 *    computing where to land. refresh() re-evaluates every functional
 *    ScrollTrigger value on the page, including this trigger's own
 *    `end`/`x` (invalidateOnRefresh: true) -- and doing that while the pin
 *    is actively engaged is exactly the "footer/card snap right as the
 *    pin releases" class of bug lib/scroll-utils.ts's width-keyed
 *    distance cache already exists to guard against. Confirmed by
 *    shipping it: every category jump started overshooting, not just the
 *    one case it was originally meant to fix.
 *
 * 2. After removing that call, jumpToCategory instead computed its
 *    distance from a fresh getDistance() call. Confirmed via an
 *    instrumented headless run that getDistance()'s width-keyed cache can
 *    update itself independently of st.start/st.end -- window.innerWidth
 *    can change mid-session for reasons that never fire a resize event
 *    (a scrollbar or a mobile browser's dynamic toolbar), which
 *    recomputes the cache immediately, while st.start/st.end only change
 *    when an actual ScrollTrigger.refresh() runs. Once those two
 *    diverge, every jump after the divergence lands further off than the
 *    last. jumpToCategory now derives distance from st.end - st.start
 *    directly, so the numerator and the range it's a fraction of can
 *    never disagree.
 *
 * This greps the component source directly rather than asserting on
 * behavior, matching this codebase's existing convention for defects
 * that live in DOM-timing interactions a jsdom render can't reproduce
 * (see hero-bg-photo-css.test.ts, i18n-fonts.test.tsx). Comments are
 * stripped first -- several deliberately name ScrollTrigger.refresh() or
 * getDistance() in prose to explain why they're absent or where they're
 * safe, which would otherwise read as false-positive matches.
 */
describe('FullMenuScroll jump-to-category math is self-consistent and refresh-safe', () => {
  const rawSource = fs.readFileSync(
    path.join(__dirname, '..', 'components', 'FullMenuScroll.tsx'),
    'utf8'
  );
  // Line comments only -- this file has no /* */ blocks, and a naive
  // block-comment stripper risks eating real code if that ever changes.
  // \r\n is also normalized to \n here: this file has no enforced line
  // ending (no .gitattributes existed for it before this change), so a
  // checkout via Windows Git with the common core.autocrlf=true default
  // has CRLF on disk -- and every marker/body below is written against
  // literal \n, which a raw CRLF file would never match. Confirmed by
  // reproducing a CRLF checkout locally: it fails all 4 of this file's
  // marker-dependent tests exactly like this.
  const source = rawSource
    .replace(/\r\n/g, '\n')
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

  const jumpToCategoryBody = () =>
    bodyOf('const jumpToCategory = (slug: CategorySlug', 'const handleTabClick =');

  it('jumpToCategory contains no ScrollTrigger.refresh() call', () => {
    expect(jumpToCategoryBody()).not.toMatch(/ScrollTrigger\.refresh\(\)/);
  });

  it('jumpToCategory derives distance from st.end - st.start, not a separate getDistance() call', () => {
    const body = jumpToCategoryBody();
    expect(body).toMatch(/distance\s*=\s*st\.end\s*-\s*st\.start/);
    expect(body).not.toMatch(/getDistance\(\)/);
  });

  it('the one-time settle correction and the resize listener are both guarded on the pin not being active', () => {
    // The only three places ScrollTrigger.refresh() may legitimately
    // appear: the settle correction, the resize-driven correction, and
    // the deep-link effect's own one-time pre-jump refresh (safe
    // specifically because nothing has been scrolled into yet at that
    // point in the mount sequence).
    const refreshSites = source.match(/ScrollTrigger\.refresh\(\)/g) ?? [];
    expect(refreshSites.length).toBe(3);

    const setupEffectBody = bodyOf(
      'useIsomorphicLayoutEffect(() => {\n    if (!sectionRef.current',
      '\n  const jumpToCategory ='
    );
    expect(setupEffectBody).toMatch(/document\.fonts\?\.ready/);
    expect(setupEffectBody).toMatch(/window\.addEventListener\('resize', onResize\)/);
    // Two guard sites -- settle correction and resize listener.
    const guardSites = setupEffectBody.match(/if \(!scrollTriggerRef\.current\?\.isActive\)/g) ?? [];
    expect(guardSites.length).toBe(2);
  });

  it('the resize listener is cleaned up on unmount', () => {
    const setupEffectBody = bodyOf(
      'useIsomorphicLayoutEffect(() => {\n    if (!sectionRef.current',
      '\n  const jumpToCategory ='
    );
    expect(setupEffectBody).toMatch(/window\.removeEventListener\('resize', onResize\)/);
    expect(setupEffectBody).toMatch(/window\.clearTimeout\(resizeTimer\)/);
  });

  it("the deep-link effect's own refresh happens before the pin can be active (fires pre-jump, at mount)", () => {
    const deepLinkBody = bodyOf('const didDeepLinkRef = useRef(false);', '\n  return (');
    expect(deepLinkBody).toMatch(/ScrollTrigger\.refresh\(\)/);
  });
});
