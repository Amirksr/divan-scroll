/**
 * Pure helpers for scroll-driven animation math.
 * Kept framework/DOM-free so they can be unit tested without a browser.
 */

/**
 * Distance (in px) the horizontal track must translate so its last card
 * reaches the right edge of the viewport, given some side padding.
 *
 * Mirrors the "menu scroll" section: track.scrollWidth - viewport + padding.
 * Clamped to 0 so a track narrower than the viewport never scrolls backwards.
 */
export function getHorizontalScrollDistance(
  trackWidth: number,
  viewportWidth: number,
  sidePadding: number = 0
): number {
  if (trackWidth < 0 || viewportWidth < 0 || sidePadding < 0) {
    throw new RangeError('getHorizontalScrollDistance: arguments must be >= 0');
  }
  const distance = trackWidth - viewportWidth + sidePadding;
  return Math.max(0, distance);
}

/**
 * Maps a raw scroll progress value (which can slightly overshoot due to
 * scrub easing/rubber-banding) into a safe 0..1 range for driving tweens.
 */
export function clampProgress(progress: number): number {
  if (Number.isNaN(progress)) return 0;
  return Math.min(1, Math.max(0, progress));
}

/** A value cached alongside the viewport width it was computed for. */
export interface WidthCachedValue<T> {
  width: number;
  value: T;
}

/**
 * Returns `cache` unchanged if it was already computed for `currentWidth`,
 * otherwise calls `compute` and returns a fresh cache entry.
 *
 * Exists so a pinned ScrollTrigger's end-distance can be pinned to the
 * viewport width alone: GSAP re-evaluates functional `end`/tween values on
 * every internal refresh, and refreshes can be triggered by things
 * unrelated to this section (a font swapping in, an image elsewhere on the
 * page finishing layout, GSAP's own ResizeObserver noise) while the user is
 * still actively scrolled inside the pin. If the underlying measurement
 * (track.scrollWidth) wobbles by even a sub-pixel amount across two of
 * those refreshes, the pin's end point silently shifts mid-scroll -- which
 * is exactly what produces a visible snap/jump right as the pin releases.
 * Keying the cache on viewport width means the distance is only ever
 * recomputed for a genuine resize/orientation change, never for refresh
 * noise, while still staying correct across real breakpoint changes.
 */
export function getCachedByWidth<T>(
  cache: WidthCachedValue<T> | null,
  currentWidth: number,
  compute: () => T
): WidthCachedValue<T> {
  if (cache && cache.width === currentWidth) return cache;
  return { width: currentWidth, value: compute() };
}
