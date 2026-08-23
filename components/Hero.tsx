'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SmokeCanvas from './SmokeCanvas';
import { getParagraphOpacity } from '@/lib/story-utils';
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
        .to('.hero-description', { opacity: 1, y: -4, duration: 0.8 }, 0.85)
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

        // Landscape phones / small tablets (640-767px): the eyebrow +
        // title alone already claim most of the short viewport height, so
        // the subline and description can't both sit statically without
        // crowding or clipping. Reusing AboutStory's tested crossfade math
        // here instead of stacking them: subline is fully visible at
        // scroll-start, description takes over by scroll-end. A second
        // (non-pinning) ScrollTrigger tracks the exact same range as the
        // pin above so both animations move in lockstep.
        const mm = gsap.matchMedia();
        mm.add('(min-width: 640px) and (max-width: 767.98px)', () => {
          const crossfadeTrigger = ScrollTrigger.create({
            trigger: rootRef.current,
            start: 'top top',
            end: '+=90%',
            scrub: 0.6,
            onUpdate: (self) => {
              gsap.set('.subline', { opacity: getParagraphOpacity(self.progress, 0, 2) });
              gsap.set('.hero-description', { opacity: getParagraphOpacity(self.progress, 1, 2) });
            },
          });
          return () => crossfadeTrigger.kill();
        });
      } else {
        gsap.set('.title-fa', { opacity: 0.4 });
        gsap.set('.title-en', { opacity: 1, filter: 'blur(0px)' });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={rootRef} className="hero" id="hero">
      <Image
        src="/images/hero/exterior.webp"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="hero-bg-photo"
      />
      <div className="hero-bg-scrim" aria-hidden="true" />
      <SmokeCanvas active={!reducedMotion} className="smoke-canvas" />
      <div className="hero-inner">
        <div className="eyebrow">کافه و آشپزخانه — تأسیس ۱۴۰۱</div>
        <div className="title-stack">
          <div className="title-fa">دیوان</div>
          <div className="title-en">DIVAN</div>
        </div>
        <div className="hero-line" />
        <div className="hero-crossfade">
          <div className="subline">هر فنجان، یک بیت از دفتر روزانه‌ی ماست</div>
          <p className="hero-description">
            در دیوان، دم‌کردن قهوه را مثل خواندن یک غزل می‌بینیم؛ آهسته، دقیق و با معنا. دانه‌های
            تازه‌برشته، نان‌های خانگی و فضایی برای نشستن و ماندن.
          </p>
        </div>
      </div>
      <div className="scroll-cue">اسکرول کنید</div>
    </section>
  );
}
