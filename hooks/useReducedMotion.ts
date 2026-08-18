'use client';

import { useState } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/**
 * Tracks the user's prefers-reduced-motion setting reactively (it can change
 * mid-session, e.g. via OS accessibility shortcuts on macOS/iOS).
 * Returns false during SSR/first paint to avoid a hydration mismatch; on the
 * client the real value is resolved synchronously before paint so consumers
 * never briefly mount a full-motion animation before reverting it.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mql.matches);

    const handleChange = (e: MediaQueryListEvent) => setReduced(e.matches);

    // Safari < 14 only supports addListener/removeListener.
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', handleChange);
      return () => mql.removeEventListener('change', handleChange);
    } else {
      mql.addListener(handleChange);
      return () => mql.removeListener(handleChange);
    }
  }, []);

  return reduced;
}
