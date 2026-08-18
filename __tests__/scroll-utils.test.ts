import {
  getHorizontalScrollDistance,
  clampProgress,
  shouldUsePinnedScroll,
} from '@/lib/scroll-utils';

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

describe('shouldUsePinnedScroll', () => {
  it('is true at/above the default breakpoint', () => {
    expect(shouldUsePinnedScroll(901)).toBe(true);
    expect(shouldUsePinnedScroll(1440)).toBe(true);
  });

  it('is false below the default breakpoint (tablet/mobile)', () => {
    expect(shouldUsePinnedScroll(900)).toBe(false);
    expect(shouldUsePinnedScroll(375)).toBe(false);
  });

  it('respects a custom breakpoint', () => {
    expect(shouldUsePinnedScroll(700, 600)).toBe(true);
    expect(shouldUsePinnedScroll(500, 600)).toBe(false);
  });
});
