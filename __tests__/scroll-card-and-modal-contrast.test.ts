import fs from 'fs';
import path from 'path';

/**
 * Regression tests for two bugs reported on the featured-items scroll
 * strip (.h-card) and the item quick-view modal, both specific to long
 * English item names / the light theme:
 *
 * 1. .h-label (the item name on each scroll-strip card) had no width
 *    bound or overflow handling, so long English names wrapped to a
 *    second line and collided with .h-price above it. Fixed with a
 *    `right` bound + single-line ellipsis truncation.
 * 2. .h-label and .item-modal-close both sit on a hardcoded-dark photo
 *    scrim (.h-scrim / the close button's own dark circle) but were
 *    using the theme-flipping --parchment(-rgb) (or inheriting it),
 *    going dark-on-dark in light theme. Fixed via the fixed
 *    --photo-text-rgb token, same pattern as the hero/gallery/
 *    space-card fixes.
 */
describe('scroll-strip card and modal close button: light-theme + long-name fixes', () => {
  const cssPath = path.join(__dirname, '..', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf8');
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');

  function ruleFor(selector: string): string {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = withoutComments.match(new RegExp(`${escaped}\\s*{([^}]*)}`));
    expect(match).not.toBeNull();
    return match![1];
  }

  it('.h-label truncates to a single line instead of wrapping (no more collision with .h-price)', () => {
    const rule = ruleFor('.h-label');
    expect(rule).toMatch(/white-space:\s*nowrap/);
    expect(rule).toMatch(/overflow:\s*hidden/);
    expect(rule).toMatch(/text-overflow:\s*ellipsis/);
    // Needs a bound on both sides to have a finite width to truncate
    // against -- left-only positioning shrink-wraps to content instead.
    expect(rule).toMatch(/\bleft:/);
    expect(rule).toMatch(/\bright:/);
  });

  it('.h-label uses the fixed --photo-text-rgb color (not the theme-flipping parchment/inherited default)', () => {
    const rule = ruleFor('.h-label');
    expect(rule).toMatch(/color:\s*rgb\(var\(--photo-text-rgb\)/);
  });

  it('.item-modal-close icon uses the fixed --photo-text-rgb color, not --parchment', () => {
    const rule = ruleFor('.item-modal-close');
    expect(rule).toMatch(/color:\s*rgb\(var\(--photo-text-rgb\)/);
    expect(rule).not.toMatch(/color:\s*var\(--parchment\)/);
  });
});
