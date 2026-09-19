import fs from 'fs';
import path from 'path';

/**
 * Regression test for a real bug: this app had NO <meta name="viewport">
 * tag at all -- Next.js's Metadata API only emits one if a `viewport`
 * export tells it to, and app/[locale]/layout.tsx (the actual document
 * shell -- app/layout.tsx is a passthrough) never had one. Confirmed
 * missing by curling a rendered page and finding no viewport meta tag in
 * the HTML at all.
 *
 * Without it, a mobile browser falls back to laying the page out at its
 * own desktop-simulation width (historically ~980px, and reproduced live
 * in headless Chromium's mobile emulation here too) and zooms the whole
 * page out to fit the physical screen, rather than rendering at the
 * device's actual CSS pixel width. Every `vw`-based CSS measurement in
 * this app and every JS scroll calculation that reads window.innerWidth
 * or getBoundingClientRect() (all of FullMenuScroll's click-to-jump math)
 * would then be computed against that wrong, wide layout viewport --
 * which is a far more fundamental explanation for "this only breaks on
 * an actual phone" than anything in the scroll logic itself.
 *
 * Importing app/[locale]/layout.tsx directly in Jest isn't practical --
 * it transitively pulls in the ESM-only `lenis` package via
 * SmoothScroll, which ts-jest can't transform (confirmed: `SyntaxError:
 * Unexpected token 'export'` from node_modules/lenis/dist/lenis.mjs).
 * This checks the source directly instead, matching this codebase's
 * existing convention for exactly this situation (see
 * full-menu-scroll-refresh-safety.test.ts).
 */
describe('locale layout declares a device-width viewport', () => {
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'app', '[locale]', 'layout.tsx'),
    'utf8'
  );

  it('imports the Viewport type from next', () => {
    expect(source).toMatch(/import type \{[^}]*\bViewport\b[^}]*\} from 'next'/);
  });

  it('exports a viewport constant set to device-width, initial-scale 1', () => {
    const match = source.match(/export const viewport\s*:\s*Viewport\s*=\s*\{([^}]*)\}/);
    expect(match).not.toBeNull();
    const body = match![1];
    expect(body).toMatch(/width\s*:\s*'device-width'/);
    expect(body).toMatch(/initialScale\s*:\s*1\b/);
  });
});
