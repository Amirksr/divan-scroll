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
