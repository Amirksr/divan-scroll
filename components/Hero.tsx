'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SmokeCanvas from './SmokeCanvas';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current) return;

    // gsap.context scopes every tween/ScrollTrigger created inside to this
    // component's DOM subtree, so ctx.revert() on unmount (route change,
    // fast refresh) cleans everything up automatically -- no manual
    // ScrollTrigger.getAll().forEach(kill) bookkeeping needed.
    const ctx = gsap.context((self) => {
      const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } });
      entrance
        .to('.eyebrow', { opacity: 1, y: -4, duration: 0.8 }, 0.1)
        .to('.title-fa', { opacity: 1, duration: 0.9 }, 0.15)
        .to('.hero-line', { height: '3.2rem', duration: 0.8 }, 0.5)
        .to('.subline', { opacity: 1, y: -4, duration: 0.8 }, 0.7)
        .to('.scroll-cue', { opacity: 1, duration: 0.6 }, 1.0);

      if (!reducedMotion) {
        gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: '+=90%',
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
          },
        })
          .to('.title-fa', { opacity: 0, filter: 'blur(8px)', y: -24, scale: 0.92, duration: 1 })
          .to('.title-en', { opacity: 1, filter: 'blur(0px)', duration: 1 }, '<0.15')
          .to('.scroll-cue', { opacity: 0, duration: 0.3 }, 0);
      } else {
        gsap.set('.title-fa', { opacity: 0.4 });
        gsap.set('.title-en', { opacity: 1, filter: 'blur(0px)' });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={rootRef} className="hero" id="hero">
      <SmokeCanvas active={!reducedMotion} className="smoke-canvas" />
      <div className="hero-inner">
        <div className="eyebrow">Case Study — Bilingual by Design</div>
        <div className="title-stack">
          <div className="title-fa">دیوان</div>
          <div className="title-en">DIVAN</div>
        </div>
        <div className="hero-line" />
        <div className="subline">
          A café menu that reads right-to-left and left-to-right — without ever feeling translated.
        </div>
      </div>
      <div className="scroll-cue">Scroll</div>
    </section>
  );
}
