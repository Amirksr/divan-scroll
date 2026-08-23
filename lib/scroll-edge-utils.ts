export interface ScrollEdgeState {
  /** Can the user scroll further forward (right, since the track is always dir="ltr")? */
  canScrollForward: boolean;
  /** Can the user scroll back (left)? */
  canScrollBackward: boolean;
}

/**
 * Given a scrollable element's current metrics, decides which directional
 * arrow indicators should be visible. Used to replace the native OS
 * scrollbar under the horizontal card tracks (FeaturedMenu, FullMenuScroll,
 * and the /menu tab bar's own mini-scroll) with a simpler two-arrow cue:
 * only the "forward" arrow at the very start, only "backward" at the very
 * end, both in between.
 *
 * `threshold` absorbs sub-pixel scroll rounding so "exactly at the edge"
 * reliably reads as exactly at the edge across browsers.
 */
export function getScrollEdgeState(
  scrollLeft: number,
  scrollWidth: number,
  clientWidth: number,
  threshold: number = 4
): ScrollEdgeState {
  if (scrollWidth <= clientWidth + threshold) {
    // Nothing to scroll at all (e.g. content fits, or not yet measured).
    return { canScrollForward: false, canScrollBackward: false };
  }
  const maxScrollLeft = scrollWidth - clientWidth;
  return {
    canScrollBackward: scrollLeft > threshold,
    canScrollForward: scrollLeft < maxScrollLeft - threshold,
  };
}
