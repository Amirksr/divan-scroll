'use client';

import { useEffect, useState, type RefObject } from 'react';
import { getScrollEdgeState } from '@/lib/scroll-edge-utils';

interface ScrollEdgeArrowsProps {
  viewportRef: RefObject<HTMLElement>;
  /** Recompute when this changes (e.g. after images load and track width settles). */
  watch?: unknown;
}

/**
 * Two directional indicators (not the native OS scrollbar) showing whether
 * there's more to scroll to in each direction: only "forward" at the very
 * start, only "backward" at the very end, both in the middle. Purely
 * indicative — clicking still works as a normal scroll-into-view shortcut,
 * but the primary interaction remains touch/wheel scroll.
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

  const scrollBy = (dir: 1 | -1) => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div className="scroll-edge-arrows" aria-hidden="true">
      <button
        type="button"
        className={`scroll-arrow scroll-arrow--back${state.canScrollBackward ? '' : ' scroll-arrow--hidden'}`}
        onClick={() => scrollBy(-1)}
        tabIndex={-1}
      >
        ‹
      </button>
      <button
        type="button"
        className={`scroll-arrow scroll-arrow--fwd${state.canScrollForward ? '' : ' scroll-arrow--hidden'}`}
        onClick={() => scrollBy(1)}
        tabIndex={-1}
      >
        ›
      </button>
    </div>
  );
}
