'use client';

import { useEffect, useLayoutEffect } from 'react';

/**
 * useLayoutEffect on the client (runs synchronously before paint — needed
 * for GSAP setup so nothing flashes in the wrong state), useEffect on the
 * server (useLayoutEffect logs a warning during SSR since there's no paint
 * to run before).
 */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
