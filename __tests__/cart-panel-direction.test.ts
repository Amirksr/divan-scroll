import fs from 'fs';
import path from 'path';

/**
 * Regression test for a real bug: .cart-panel was anchored with a
 * hardcoded `left: 0`, so the dropdown always grew rightward from the
 * cart button. The header mirrors under RTL, so the button sits near the
 * left viewport edge on /fa (panel fits) but near the right edge on /en
 * -- where the panel ran off the screen and only half of it was visible.
 * .cart-button-badge had the same hardcoded-`left` problem, putting the
 * count badge on the button's inner corner under LTR.
 *
 * Both must use logical inset properties so they resolve correctly in
 * both directions. jsdom doesn't do layout, so this asserts on the CSS
 * structure directly (same approach as font-tokens-on-body.test.ts).
 */
describe('cart dropdown and badge are positioned direction-agnostically', () => {
  const cssPath = path.join(__dirname, '..', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf8');
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');

  function ruleBody(selector: string): string {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = withoutComments.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
    expect(match).not.toBeNull();
    return match![1];
  }

  describe('.cart-panel', () => {
    const body = () => ruleBody('.cart-panel');

    it('anchors to the inline-end edge', () => {
      expect(body()).toMatch(/inset-inline-end\s*:\s*0/);
    });

    it('does not use a physical left/right inset that would break one direction', () => {
      expect(body()).not.toMatch(/(^|[^-])left\s*:/m);
      expect(body()).not.toMatch(/(^|[^-])right\s*:/m);
    });

    it('is still absolutely positioned and width-capped to the viewport', () => {
      expect(body()).toMatch(/position\s*:\s*absolute/);
      expect(body()).toMatch(/width\s*:\s*min\(/);
    });
  });

  describe('.cart-button-badge', () => {
    const body = () => ruleBody('.cart-button-badge');

    it('anchors to the inline-end edge, which preserves the existing /fa (left) placement while mirroring it on /en', () => {
      expect(body()).toMatch(/inset-inline-end\s*:/);
      expect(body()).not.toMatch(/inset-inline-start\s*:/);
    });

    it('does not use a physical left/right inset', () => {
      expect(body()).not.toMatch(/(^|[^-])left\s*:/m);
      expect(body()).not.toMatch(/(^|[^-])right\s*:/m);
    });
  });
});
