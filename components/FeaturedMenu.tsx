'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getFeaturedItems, formatToman } from '@/lib/menu-data';
import { CATEGORY_META } from '@/lib/categories-data';
import { getHorizontalScrollDistance, getCachedByWidth, type WidthCachedValue } from '@/lib/scroll-utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

gsap.registerPlugin(ScrollTrigger);

const items = getFeaturedItems();

export default function FeaturedMenu() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  // Caches the pin distance by viewport width -- see FullMenuScroll.tsx
  // and getCachedByWidth's doc comment for the full rationale (same
  // pinned scroll-to-scrub pattern, same latent risk of the pin's end
  // point silently shifting mid-scroll if a spurious refresh recomputes
  // it from a slightly different track.scrollWidth reading).
  const distanceCacheRef = useRef<WidthCachedValue<number> | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current || !trackRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const viewportEl = viewportRef.current;

      // Read the real rendered side padding instead of assuming 6vw
      // resolves to a fixed pixel value (it doesn't, above/below 1600px).
      const getSidePadding = () =>
        viewportEl ? parseFloat(getComputedStyle(viewportEl).paddingLeft) || 0 : 0;

      const getDistance = () => {
        const width = window.innerWidth;
        distanceCacheRef.current = getCachedByWidth(distanceCacheRef.current, width, () =>
          Math.round(getHorizontalScrollDistance(track.scrollWidth, width, getSidePadding()))
        );
        return distanceCacheRef.current.value;
      };

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
          // See FullMenuScroll.tsx -- lets the eased scrub tween
          // fast-forward when the raw scroll position outruns it, instead
          // of releasing the pin before the track has visually caught up.
          fastScrollEnd: true,
        },
      });
    }, sectionRef);

    return () => {
      distanceCacheRef.current = null;
      ctx.revert();
    };
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
              <span className="h-cat">{CATEGORY_META.find((c) => c.slug === item.category)?.name}</span>
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
