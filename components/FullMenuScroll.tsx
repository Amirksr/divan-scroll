'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MENU_ITEMS, formatToman } from '@/lib/menu-data';
import { CATEGORY_META, getOrderedAvailableCategories, type CategorySlug } from '@/lib/categories-data';
import { getHorizontalScrollDistance, PINNED_SCROLL_BREAKPOINT } from '@/lib/scroll-utils';
import { pickActiveCategory, type CategoryProbe } from '@/lib/category-scroll-utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

gsap.registerPlugin(ScrollTrigger);

const availableCategories = getOrderedAvailableCategories();
const items = availableCategories.flatMap((cat) =>
  MENU_ITEMS.filter((item) => item.category === cat.slug)
);

export default function FullMenuScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  // One ref per available category, pointing at that category's first card
  // — the element an IntersectionObserver watches to know when we've
  // scrolled into that category's group.
  const probeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const reducedMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<string | undefined>(
    availableCategories[0]?.slug
  );

  // Horizontal pinned scroll (desktop) / native scroll-snap fallback
  // (mobile + reduced motion) — same pattern as FeaturedMenu.
  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current || !trackRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(`(min-width: ${PINNED_SCROLL_BREAKPOINT}px)`, () => {
        const track = trackRef.current!;
        const viewportEl = viewportRef.current;

        const getSidePadding = () =>
          viewportEl ? parseFloat(getComputedStyle(viewportEl).paddingLeft) || 0 : 0;

        const getDistance = () =>
          getHorizontalScrollDistance(track.scrollWidth, window.innerWidth, getSidePadding());

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => '+=' + getDistance(),
            scrub: 0.5,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        return () => tween.kill();
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Tab highlighting: watch each category's first-card probe element and
  // pick the leftmost currently-visible one as active. Works the same way
  // whether the track is being translated by GSAP (desktop pin) or
  // natively scrolled (mobile/reduced-motion), since in both cases the
  // probe elements' actual on-screen position is what IntersectionObserver
  // measures — no need to branch this logic by mode.
  useEffect(() => {
    if (availableCategories.length <= 1) return; // nothing to highlight between

    const probeEntries = Object.entries(probeRefs.current).filter(
      (entry): entry is [string, HTMLDivElement] => entry[1] !== null
    );
    if (probeEntries.length === 0) return;

    const state = new Map<string, CategoryProbe>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const category = (entry.target as HTMLElement).dataset.category;
          if (!category) continue;
          state.set(category, {
            category,
            isIntersecting: entry.isIntersecting,
            left: entry.boundingClientRect.left,
          });
        }
        setActiveCategory((prev) => pickActiveCategory(Array.from(state.values()), prev));
      },
      { root: null, threshold: 0.1 }
    );

    probeEntries.forEach(([, el]) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="full-menu">
      <div className="full-menu-tabs" role="tablist" aria-label="دسته‌بندی منو">
        {CATEGORY_META.map((cat) => {
          const available = availableCategories.some((c) => c.slug === cat.slug);
          const isActive = available && activeCategory === cat.slug;
          return (
            <span
              key={cat.slug}
              role="tab"
              aria-selected={isActive}
              aria-disabled={!available}
              id={`cat-${cat.slug}`}
              className={
                'full-menu-tab' +
                (isActive ? ' full-menu-tab--active' : '') +
                (!available ? ' full-menu-tab--soon' : '')
              }
            >
              {cat.name}
            </span>
          );
        })}
      </div>

      <div
        ref={viewportRef}
        className={reducedMotion ? 'h-viewport h-viewport--static' : 'h-viewport'}
        dir="ltr"
      >
        <div ref={trackRef} className="h-track">
          {items.map((item, i) => {
            const isFirstInCategory = items.findIndex((it) => it.category === item.category) === i;
            return (
              <div
                className="h-card"
                key={item.id}
                dir="rtl"
                ref={
                  isFirstInCategory
                    ? (el) => {
                        probeRefs.current[item.category] = el;
                      }
                    : undefined
                }
                data-category={isFirstInCategory ? item.category : undefined}
              >
                <Image
                  src={item.image}
                  alt={item.labelEn}
                  fill
                  sizes="(max-width: 900px) 72vw, 300px"
                  style={{ objectFit: 'cover' }}
                  priority={i < 3}
                />
                <div className="h-scrim" />
                <span className="h-cat">{CATEGORY_META.find((c) => c.slug === item.category)?.name}</span>
                <span className="h-price">{formatToman(item.price)}</span>
                <span className="h-label">{item.labelFa}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
