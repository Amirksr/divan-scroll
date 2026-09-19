import { pickActiveCategory, CategoryProbe, categoryScrollTarget } from '@/lib/category-scroll-utils';

describe('pickActiveCategory', () => {
  it('picks the only intersecting category', () => {
    const probes: CategoryProbe[] = [
      { category: 'coffee', isIntersecting: true, left: 100 },
      { category: 'tea', isIntersecting: false, left: 500 },
    ];
    expect(pickActiveCategory(probes)).toBe('coffee');
  });

  it('picks the leftmost among multiple intersecting categories', () => {
    const probes: CategoryProbe[] = [
      { category: 'tea', isIntersecting: true, left: 300 },
      { category: 'coffee', isIntersecting: true, left: 50 },
      { category: 'brunch', isIntersecting: true, left: 800 },
    ];
    expect(pickActiveCategory(probes)).toBe('coffee');
  });

  it('falls back when nothing is intersecting', () => {
    const probes: CategoryProbe[] = [
      { category: 'coffee', isIntersecting: false, left: 100 },
      { category: 'tea', isIntersecting: false, left: 500 },
    ];
    expect(pickActiveCategory(probes, 'brunch')).toBe('brunch');
  });

  it('returns undefined when nothing intersects and there is no fallback', () => {
    const probes: CategoryProbe[] = [{ category: 'coffee', isIntersecting: false, left: 100 }];
    expect(pickActiveCategory(probes)).toBeUndefined();
  });

  it('returns undefined for an empty probe list with no fallback', () => {
    expect(pickActiveCategory([])).toBeUndefined();
  });

  it('handles a single category with a negative left (scrolled slightly past)', () => {
    const probes: CategoryProbe[] = [
      { category: 'coffee', isIntersecting: true, left: -20 },
      { category: 'tea', isIntersecting: true, left: 40 },
    ];
    expect(pickActiveCategory(probes)).toBe('coffee');
  });
});

describe('categoryScrollTarget', () => {
  // A representative pin: 15000px of horizontal travel, released at page
  // scrollY 16000 having started at 1000.
  const pinStart = 1000;
  const pinEnd = 16000;
  const distance = 15000;

  // Regression test for a real bug: jumping to the FIRST category
  // (Coffee & Espresso) landed scrolled exactly to the pin's engage
  // boundary, which is the same class of ambiguous territory as landing
  // exactly on the release boundary (see the pinEnd test below) -- this
  // is what continued to reproduce, on an actual device, after only the
  // pinEnd side of this had been fixed.
  it('never returns exactly pinStart, even when offset is 0', () => {
    const target = categoryScrollTarget(0, distance, pinStart, pinEnd);
    expect(target).toBeGreaterThan(pinStart);
    expect(target - pinStart).toBeLessThanOrEqual(1);
  });

  it('never returns exactly pinStart even when offset is negative', () => {
    const target = categoryScrollTarget(-500, distance, pinStart, pinEnd);
    expect(target).toBeGreaterThan(pinStart);
    expect(target - pinStart).toBeLessThanOrEqual(1);
  });

  it('maps a mid-track offset to the proportional point between start and end', () => {
    // Halfway through the track -> halfway through the pin's scroll range.
    expect(categoryScrollTarget(distance / 2, distance, pinStart, pinEnd)).toBe(
      pinStart + (pinEnd - pinStart) / 2
    );
  });

  // Regression test for a real bug: jumping to the LAST category (coffee)
  // landed scrolled exactly to the pin's release point, which un-pins the
  // section right as the jump completes -- the track then shows its
  // un-scrubbed resting position instead of the coffee cards, and the
  // reader had to scroll back up into the still-pinned range to see them.
  it('never returns exactly pinEnd, even when offset reaches the full track distance', () => {
    const target = categoryScrollTarget(distance, distance, pinStart, pinEnd);
    expect(target).toBeLessThan(pinEnd);
    // ...but stays negligibly close, not merely "somewhere before it".
    expect(pinEnd - target).toBeLessThanOrEqual(1);
  });

  it('never returns exactly pinEnd even when offset overshoots past the track distance', () => {
    // A category near the end of the track can have an offset greater
    // than `distance` -- there isn't enough remaining track after it to
    // align it to the viewport's left edge without over-scrolling past
    // the last card. Progress clamps to 1 either way.
    const target = categoryScrollTarget(distance * 1.4, distance, pinStart, pinEnd);
    expect(target).toBeLessThan(pinEnd);
    expect(pinEnd - target).toBeLessThanOrEqual(1);
  });

  it('clamps a negative offset toward the pin start rather than undershooting past it', () => {
    const target = categoryScrollTarget(-500, distance, pinStart, pinEnd);
    expect(target).toBeGreaterThanOrEqual(pinStart);
    expect(target - pinStart).toBeLessThanOrEqual(1);
  });

  it('stays inside (pinStart, pinEnd) when distance is 0 (nothing to scroll)', () => {
    expect(categoryScrollTarget(0, 0, pinStart, pinEnd)).toBe(pinStart + 1);
    expect(categoryScrollTarget(100, 0, pinStart, pinEnd)).toBe(pinStart + 1);
  });

  it('stays correct for a very short pin range (small distance)', () => {
    const target = categoryScrollTarget(50, 100, 0, 10);
    expect(target).toBeGreaterThanOrEqual(0);
    expect(target).toBeLessThan(10);
  });
});
