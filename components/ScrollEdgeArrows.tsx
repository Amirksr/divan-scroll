'use client';

import { useEffect, useState, type RefObject } from 'react';
import { getScrollEdgeState } from '@/lib/scroll-edge-utils';

interface ScrollEdgeArrowsProps {
  viewportRef: RefObject<HTMLElement>;
  /** Recompute when this changes (e.g. after images load and track width settles). */
  watch?: unknown;
}

/**
 * Two directional glyphs showing whether there's more to scroll to in each
 * direction: only "forward" at the very start, only "backward" at the
 * very end, both in the middle. Purely decorative -- no click-to-scroll,
 * no pointer-events, no focusable elements. An earlier version made these
 * clickable <button>s with pointer-events: auto sitting near the track's
 * edges; on touch devices, a swipe gesture starting on/near one of those
 * buttons got captured by the button instead of scrolling the track,
 * effectively breaking horizontal scroll right where this indicator was
 * visible. Never repeat that -- this component must never be able to
 * intercept input meant for the scrollable track underneath it.
 */
export default function ScrollEdgeArrows({ viewportRef, watch }: ScrollEdgeArrowsProps) {
  const [state, setState] = useState({ canScrollForward: true, canScrollBackward: false });

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const update = () => {
      setState(getScrollEdgeState(el.scrollLeft, el.scrollWidth, el.clientWidth));
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewportRef, watch]);

  return (
    <div className="scroll-edge-arrows" aria-hidden="true">
      <span className={`scroll-arrow${state.canScrollBackward ? '' : ' scroll-arrow--hidden'}`}>
        ‹
      </span>
      <span className={`scroll-arrow${state.canScrollForward ? '' : ' scroll-arrow--hidden'}`}>
        ›
      </span>
    </div>
  );
}
