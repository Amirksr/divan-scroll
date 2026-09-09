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
    // Needs a bound on both inline edges to have a finite width to
    // truncate against -- left-only positioning shrink-wraps to content
    // instead. Logical (inset-inline), not physical (left/right), so
    // this mirrors correctly for RTL (fa) cards.
    expect(rule).toMatch(/inset-inline:/);
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

/**
 * Regression tests for the off-canvas toggle now being mobile/tablet-only
 * (was visible at every breakpoint), replaced by a header-level
 * LanguageSwitcher at the same breakpoint .site-nav already switches on,
 * and the drawer's free inner edge now being rounded.
 */
describe('off-canvas toggle breakpoint + drawer corner radius', () => {
  const cssPath = require('path').join(__dirname, '..', 'app', 'globals.css');
  const css = require('fs').readFileSync(cssPath, 'utf8');
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');

  it('.mobile-nav-toggle is hidden at the same breakpoint .site-nav (desktop links) appears', () => {
    const siteNavBp = withoutComments.match(/@media \(min-width:\s*(\d+px)\)\s*{\s*\.site-nav\s*{\s*display:\s*flex/);
    const toggleHiddenBp = withoutComments.match(/@media \(min-width:\s*(\d+px)\)\s*{\s*\.mobile-nav-toggle\s*{\s*display:\s*none/);
    expect(siteNavBp).not.toBeNull();
    expect(toggleHiddenBp).not.toBeNull();
    expect(toggleHiddenBp![1]).toBe(siteNavBp![1]);
  });

  it('.site-header-lang appears at the same breakpoint the toggle disappears', () => {
    const toggleHiddenBp = withoutComments.match(/@media \(min-width:\s*(\d+px)\)\s*{\s*\.mobile-nav-toggle\s*{\s*display:\s*none/);
    const langShownBp = withoutComments.match(/@media \(min-width:\s*(\d+px)\)\s*{\s*\.site-header-lang\s*{\s*display:\s*flex/);
    expect(langShownBp).not.toBeNull();
    expect(langShownBp![1]).toBe(toggleHiddenBp![1]);
  });

  it('.site-header-lang and .mobile-nav-toggle are both hidden by default (mobile-first)', () => {
    const langDefault = withoutComments.match(/\.site-header-lang\s*{\s*display:\s*none;\s*}/);
    expect(langDefault).not.toBeNull();
  });

  it('.mobile-nav-drawer rounds its free inline-end edge (logical, so it flips correctly per dir)', () => {
    const match = withoutComments.match(/\.mobile-nav-drawer\s*{([^}]*)}/);
    expect(match).not.toBeNull();
    expect(match![1]).toMatch(/border-start-end-radius:\s*\d/);
    expect(match![1]).toMatch(/border-end-end-radius:\s*\d/);
  });
});
