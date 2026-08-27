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
