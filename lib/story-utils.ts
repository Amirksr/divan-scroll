/**
 * Pure helpers driving the About section's pinned, scroll-scrubbed
 * paragraph crossfade. Kept DOM/GSAP-free so the actual fade curve is
 * unit-testable without mocking ScrollTrigger.
 */

/**
 * Given overall scroll progress (0..1) through the pinned section and the
 * total paragraph count, returns which paragraph "owns" that point in the
 * scroll (i.e. is the primary/most-visible one).
 */
export function getActiveParagraphIndex(progress: number, count: number): number {
  if (count <= 0) throw new RangeError('getActiveParagraphIndex: count must be > 0');
  const clamped = Math.min(1, Math.max(0, progress));
  // progress === 1 would otherwise compute index === count (out of range).
  return Math.min(count - 1, Math.floor(clamped * count));
}

/**
 * Returns this paragraph's opacity (0..1) for a given overall scroll
 * progress. Each paragraph owns an equal-width segment of the scroll range;
 * it fades in over `crossfade` of that segment's width at the start and
 * fades out over `crossfade` at the end, so adjacent paragraphs overlap
 * instead of hard-cutting. The first paragraph starts fully visible
 * (nothing to fade in from) and the last stays fully visible at progress=1
 * (nothing to fade out to).
 */
export function getParagraphOpacity(
  progress: number,
  index: number,
  count: number,
  crossfade: number = 0.3
): number {
  if (count <= 0) throw new RangeError('getParagraphOpacity: count must be > 0');
  if (index < 0 || index >= count) throw new RangeError('getParagraphOpacity: index out of range');
  if (crossfade < 0 || crossfade > 1) throw new RangeError('getParagraphOpacity: crossfade must be 0..1');

  const p = Math.min(1, Math.max(0, progress));
  const segment = 1 / count;
  const start = index * segment;
  const end = start + segment;
  const fade = segment * crossfade;

  if (p < start - fade || p > end + fade) return 0;

  let opacity = 1;

  // Fade in, unless this is the first paragraph (always starts visible).
  if (index > 0 && p < start + fade) {
    opacity = Math.min(opacity, (p - (start - fade)) / (2 * fade));
  }
  // Fade out, unless this is the last paragraph (stays visible at the end).
  if (index < count - 1 && p > end - fade) {
    opacity = Math.min(opacity, ((end + fade) - p) / (2 * fade));
  }

  return Math.min(1, Math.max(0, opacity));
}
