'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getFeaturedItems, CATEGORY_LABELS, formatToman } from '@/lib/menu-data';
import { getHorizontalScrollDistance } from '@/lib/scroll-utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

gsap.registerPlugin(ScrollTrigger);

const items = getFeaturedItems();

export default function FeaturedMenu() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current || !trackRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const viewportEl = viewportRef.current;

      // Read the real rendered side padding instead of assuming 6vw
      // resolves to a fixed pixel value (it doesn't, above/below 1600px).
      const getSidePadding = () =>
        viewportEl ? parseFloat(getComputedStyle(viewportEl).paddingLeft) || 0 : 0;

      const getDistance = () =>
        getHorizontalScrollDistance(track.scrollWidth, window.innerWidth, getSidePadding());

      // Pinned scroll-to-scrub applies at every viewport width now (not
      // just desktop) -- the fluid clamp()-based card sizing in
      // globals.css means there's no width where this technique doesn't
      // fit reasonably, and Lenis (see SmoothScroll.tsx) keeps it smooth
      // on touch too.
      gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => '+=' + getDistance(),
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="h-scroll" id="menu-scroll">
      <div className="h-intro">
        <p className="eyebrow-static">برگزیده‌های دفتر</p>
        <h2>محبوب‌ترین‌ها</h2>
      </div>
      <div
        ref={viewportRef}
        className={reducedMotion ? 'h-viewport h-viewport--static' : 'h-viewport'}
        dir="ltr"
      >
        <div ref={trackRef} className="h-track">
          {items.map((item, i) => (
            <div className="h-card" key={item.id} dir="rtl">
              <Image
                src={item.image}
                alt={item.labelFa}
                fill
                sizes="(min-width: 1280px) 300px, 26vw"
                style={{ objectFit: 'cover' }}
                priority={i < 3}
              />
              <div className="h-scrim" />
              <span className="h-cat">{CATEGORY_LABELS[item.category].fa}</span>
              <span className="h-price">{formatToman(item.price)}</span>
              <span className="h-label">{item.labelFa}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="h-cta-wrap">
        <Link href="/menu" className="h-cta focus-ring">
          مشاهده‌ی کل منو ←
        </Link>
      </div>
    </section>
  );
}
