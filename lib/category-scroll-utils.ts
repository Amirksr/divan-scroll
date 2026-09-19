/**
 * A snapshot of one category's "marker" element's visibility state during
 * horizontal scroll, as reported by an IntersectionObserver watching a
 * probe element placed at the start of each category's item group.
 */
export interface CategoryProbe {
  category: string;
  isIntersecting: boolean;
  /** boundingClientRect.left of the probe element, in the scroll container's coordinate space. */
  left: number;
}

/**
 * Picks which category should be the "active" (highlighted) tab given the
 * current set of probe visibility states. Among probes currently
 * intersecting the viewport, the leftmost one wins — in a left-to-right
 * scroll track, that's the category whose items the user has most
 * recently scrolled into (RTL page direction doesn't matter here since
 * the track itself is forced dir="ltr", same as FeaturedMenu/FullMenuScroll).
 *
 * Falls back to `fallback` (typically "keep whatever was active before")
 * when nothing is currently intersecting, e.g. mid-scroll between two
 * probe points.
 */
export function pickActiveCategory(probes: CategoryProbe[], fallback?: string): string | undefined {
  const visible = probes.filter((p) => p.isIntersecting);
  if (visible.length === 0) return fallback;
  return visible.reduce((leftmost, p) => (p.left < leftmost.left ? p : leftmost)).category;
}

/**
 * Extracts a category slug from a location hash of the form "#cat-<slug>",
 * as linked from the home page's category cards
 * (`/{locale}/menu#cat-{slug}`). Returns undefined for an absent,
 * empty, or differently-shaped hash.
 *
 * Validation against the real category list is left to the caller, which
 * knows which categories currently have content -- this only handles the
 * string shape, so it stays pure and testable without importing menu data.
 */
export function parseCategoryHash(hash: string): string | undefined {
  const withoutHash = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!withoutHash.startsWith('cat-')) return undefined;
  const slug = withoutHash.slice('cat-'.length);
  return slug.length > 0 ? slug : undefined;
}

/**
 * Converts a category's horizontal position within the pinned track into
 * the absolute page scroll position that shows it -- the core of
 * FullMenuScroll's click-to-jump / deep-link jump.
 *
 * `probeOffsetLeft` is where the category's first card sits along the
 * track; `distance` is the total horizontal distance the track travels
 * over the pin's whole lifetime; `pinStart`/`pinEnd` are the pin's
 * absolute page scroll boundaries (ScrollTrigger's `.start`/`.end`).
 *
 * Three things this deliberately protects against, all confirmed as real
 * bugs rather than theoretical ones:
 *
 * - `probeOffsetLeft` isn't clamped to `[0, distance]` before use. A
 *   category near the end of the track can have an offset greater than
 *   `distance` (there isn't enough remaining track after it to align it
 *   to the viewport's left edge without over-scrolling past the last
 *   card), and one at/before the very start can't go below 0 either.
 *   Progress is clamped to 0..1 either way, so the result is always a
 *   point inside the pin -- just not necessarily with that category's
 *   card flush against the left edge, which is an inherent limit of
 *   "align to the left edge" for cards near either end of the track, not
 *   a bug to route around.
 *
 * - The result never equals `pinEnd`. That exact boundary is where GSAP
 *   begins releasing the pin, so landing there -- which is exactly what
 *   jumping to the LAST category always tends toward, since its progress
 *   is closest to 1 -- shows the track's un-scrubbed resting state
 *   instead of that category.
 *
 * - The result never equals `pinStart` either, for the mirror-image
 *   reason: that's the boundary where the pin ENGAGES. Jumping to the
 *   FIRST category always computes progress exactly 0, so its raw target
 *   is exactly `pinStart` -- landing precisely on the engage boundary is
 *   the same class of ambiguous, GSAP-version- and browser-dependent
 *   territory as landing precisely on the release boundary, just at the
 *   other end. Kept as a live, load-bearing case rather than an
 *   after-the-fact guess: it is what continued to reproduce, on an
 *   actual device, after the pinEnd-only version of this fix shipped.
 *
 * Both boundary offsets are 1px, comfortably inside the pinned range at
 * any of this section's real sizes and imperceptible as a landing
 * position.
 */
export function categoryScrollTarget(
  probeOffsetLeft: number,
  distance: number,
  pinStart: number,
  pinEnd: number
): number {
  const progress = distance > 0 ? Math.min(1, Math.max(0, probeOffsetLeft / distance)) : 0;
  const raw = pinStart + (pinEnd - pinStart) * progress;
  return Math.min(Math.max(raw, pinStart + 1), pinEnd - 1);
}
