'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { lenisInstance } from '@/lib/lenis-instance';

gsap.registerPlugin(ScrollTrigger);

// Known GSAP fix for pinned sections seeming to "run away"/oscillate near
// the end of their scroll range on mobile browsers and device simulators:
// the address bar (or a simulator's viewport chrome) showing/hiding
// mid-scroll fires resize events, which by default trigger
// ScrollTrigger to recalculate every pin's distance -- including ones
// the user is actively scrolled into. Each recalculation nudges the
// target end position, so scrolling toward it can feel like it keeps
// retreating. This tells ScrollTrigger to ignore exactly that class of
// resize event.
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * Mounted once in the root layout. Native browser scroll fires in discrete
 * jumps that don't line up perfectly with ScrollTrigger's per-frame pin/
 * scrub math — that mismatch is what caused the visible "jump" right as a
 * pinned section (like Hero) engaged. Lenis intercepts the wheel/touch
 * input and feeds GSAP's ticker a continuously interpolated scroll value
 * instead, so every ScrollTrigger-driven animation (pin, scrub, batch)
 * reads a smooth position from the very first frame.
 *
 * Skipped entirely under prefers-reduced-motion: smoothing/inertia is a
 * motion effect, and native instant scroll is what that preference asks for.
 */
export default function SmoothScroll() {
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });
    lenisRef.current = lenis;
    lenisInstance.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      lenisInstance.current = null;
    };
  }, [reducedMotion]);

  // This component lives in the root layout, so it stays mounted (and its
  // single Lenis instance persists) across client-side route changes
  // between / , /menu, and /about. Next.js resets native scrollTop to 0 on
  // navigation, but Lenis's own internal target/velocity state doesn't
  // know that happened — without this, the first scroll gesture on a
  // freshly-navigated page can jump or fight the leftover state from the
  // previous page. Force an immediate (non-animated) resync on every
  // pathname change.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
