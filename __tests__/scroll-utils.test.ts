import { getHorizontalScrollDistance, clampProgress, getCachedByWidth } from '@/lib/scroll-utils';

describe('getHorizontalScrollDistance', () => {
  it('returns track width minus viewport plus padding when track is wider', () => {
    expect(getHorizontalScrollDistance(3000, 1200, 96)).toBe(3000 - 1200 + 96);
  });

  it('clamps to 0 when the track is narrower than the viewport', () => {
    expect(getHorizontalScrollDistance(500, 1200, 96)).toBe(0);
  });

  it('handles zero padding', () => {
    expect(getHorizontalScrollDistance(2000, 1000, 0)).toBe(1000);
  });

  it('returns 0 for an exact-fit track', () => {
    expect(getHorizontalScrollDistance(1200, 1200, 0)).toBe(0);
  });

  it('throws on negative inputs', () => {
    expect(() => getHorizontalScrollDistance(-10, 1200, 0)).toThrow(RangeError);
    expect(() => getHorizontalScrollDistance(1000, -1, 0)).toThrow(RangeError);
    expect(() => getHorizontalScrollDistance(1000, 1200, -5)).toThrow(RangeError);
  });
});

describe('clampProgress', () => {
  it('passes through in-range values', () => {
    expect(clampProgress(0.5)).toBe(0.5);
  });

  it('clamps values above 1 (scrub overshoot)', () => {
    expect(clampProgress(1.2)).toBe(1);
  });

  it('clamps values below 0 (rubber-banding)', () => {
    expect(clampProgress(-0.3)).toBe(0);
  });

  it('treats NaN as 0 rather than propagating it into a tween', () => {
    expect(clampProgress(NaN)).toBe(0);
  });
});

describe('getCachedByWidth', () => {
  it('computes and caches a value when there is no prior cache', () => {
    const compute = jest.fn(() => 1234);
    const result = getCachedByWidth(null, 1200, compute);
    expect(result).toEqual({ width: 1200, value: 1234 });
    expect(compute).toHaveBeenCalledTimes(1);
  });

  it('returns the same cache entry without recomputing when the width is unchanged', () => {
    const compute = jest.fn(() => 9999);
    const first = getCachedByWidth(null, 1200, compute);
    const second = getCachedByWidth(first, 1200, compute);
    expect(second).toBe(first); // same object reference, not just equal value
    expect(compute).toHaveBeenCalledTimes(1);
  });

  it('recomputes when the width has genuinely changed (real resize/orientation change)', () => {
    const compute = jest
      .fn()
      .mockReturnValueOnce(1234)
      .mockReturnValueOnce(5678);
    const first = getCachedByWidth(null, 1200, compute);
    const second = getCachedByWidth(first, 800, compute);
    expect(second).toEqual({ width: 800, value: 5678 });
    expect(compute).toHaveBeenCalledTimes(2);
  });

  it('does not recompute for refresh noise at the same width even across many calls', () => {
    // Simulates many spurious ScrollTrigger refreshes firing mid-scroll
    // while the viewport itself never actually changed size.
    const compute = jest.fn(() => 42);
    let cache = getCachedByWidth(null, 1440, compute);
    for (let i = 0; i < 20; i++) {
      cache = getCachedByWidth(cache, 1440, compute);
    }
    expect(compute).toHaveBeenCalledTimes(1);
    expect(cache.value).toBe(42);
  });

  it('treats width 0 as a valid, cacheable width rather than "no cache"', () => {
    const compute = jest.fn(() => 'value-at-zero');
    const first = getCachedByWidth(null, 0, compute);
    const second = getCachedByWidth(first, 0, compute);
    expect(second).toBe(first);
    expect(compute).toHaveBeenCalledTimes(1);
  });
});
