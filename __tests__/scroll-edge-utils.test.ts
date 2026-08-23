import { getScrollEdgeState } from '@/lib/scroll-edge-utils';

describe('getScrollEdgeState', () => {
  it('at the very start: only forward is possible', () => {
    expect(getScrollEdgeState(0, 2000, 800)).toEqual({
      canScrollForward: true,
      canScrollBackward: false,
    });
  });

  it('at the very end: only backward is possible', () => {
    expect(getScrollEdgeState(1200, 2000, 800)).toEqual({
      canScrollForward: false,
      canScrollBackward: true,
    });
  });

  it('in the middle: both directions are possible', () => {
    expect(getScrollEdgeState(600, 2000, 800)).toEqual({
      canScrollForward: true,
      canScrollBackward: true,
    });
  });

  it('when content fits entirely (nothing to scroll): neither direction', () => {
    expect(getScrollEdgeState(0, 500, 800)).toEqual({
      canScrollForward: false,
      canScrollBackward: false,
    });
  });

  it('absorbs sub-pixel rounding near the start via the threshold', () => {
    expect(getScrollEdgeState(2.5, 2000, 800)).toEqual({
      canScrollForward: true,
      canScrollBackward: false,
    });
  });

  it('absorbs sub-pixel rounding near the end via the threshold', () => {
    expect(getScrollEdgeState(1197.7, 2000, 800)).toEqual({
      canScrollForward: false,
      canScrollBackward: true,
    });
  });

  it('respects a custom threshold', () => {
    expect(getScrollEdgeState(10, 2000, 800, 20)).toEqual({
      canScrollForward: true,
      canScrollBackward: false,
    });
  });

  it('treats scrollWidth exactly equal to clientWidth as nothing-to-scroll', () => {
    expect(getScrollEdgeState(0, 800, 800)).toEqual({
      canScrollForward: false,
      canScrollBackward: false,
    });
  });
});
