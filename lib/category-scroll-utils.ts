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
