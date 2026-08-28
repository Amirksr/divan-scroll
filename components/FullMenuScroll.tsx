'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MENU_ITEMS, formatToman } from '@/lib/menu-data';
import { CATEGORY_META, getOrderedAvailableCategories, type CategorySlug } from '@/lib/categories-data';
import { getHorizontalScrollDistance, getCachedByWidth, type WidthCachedValue } from '@/lib/scroll-utils';
import { pickActiveCategory, type CategoryProbe } from '@/lib/category-scroll-utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { lenisInstance } from '@/lib/lenis-instance';

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
  // — used both by the IntersectionObserver (which category is active)
  // and by the tab click handler (where to scroll/jump to).
  const probeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // The ScrollTrigger driving the pin, so the click handler can convert a
  // target card position into an absolute page scroll position. Null
  // under reduced motion, where there's no pin at all.
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  // Caches the computed pin distance by viewport width -- see
  // getCachedByWidth's doc comment. Without this, GSAP's `end`/`x`
  // functional values get re-evaluated on every refresh (including ones
  // triggered by things unrelated to this section, mid-scroll), and any
  // sub-pixel wobble in track.scrollWidth between two of those calls
  // silently shifts the pin's end point -- producing the footer/card
  // snap right as the pin releases.
  const distanceCacheRef = useRef<WidthCachedValue<number> | null>(null);
  const reducedMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<string | undefined>(
    availableCategories[0]?.slug
  );

  const getSidePadding = () => {
    const el = viewportRef.current;
    return el ? parseFloat(getComputedStyle(el).paddingLeft) || 0 : 0;
  };

  const getDistance = () => {
    const track = trackRef.current;
    if (!track) return 0;
    const width = window.innerWidth;
    const previous = distanceCacheRef.current;
    distanceCacheRef.current = getCachedByWidth(previous, width, () =>
      Math.round(getHorizontalScrollDistance(track.scrollWidth, width, getSidePadding()))
    );
    if (debugMode && distanceCacheRef.current !== previous) {
      // eslint-disable-next-line no-console
      console.log('[full-menu-scroll] distance recomputed (width changed)', {
        previousWidth: previous?.width,
        newWidth: width,
        distance: distanceCacheRef.current.value,
        time: performance.now(),
      });
    }
    return distanceCacheRef.current.value;
  };

  // Debug-only, opt-in via ?debug=1 -- lets GSAP's own visual markers and a
  // console log of every end-distance recalculation show directly whether
  // the pin's end point is shifting mid-scroll (which would explain the
  // footer/card snap-back reported on a real device), instead of guessing
  // again. No effect at all without the query param.
  const debugMode =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug');

  // Pinned scroll-to-scrub, at every viewport width (see FeaturedMenu for
  // the same pattern and rationale) -- native scroll-snap now only kicks
  // in for prefers-reduced-motion via .h-viewport--static below.
  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current || !trackRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => {
            const distance = getDistance();
            if (debugMode) {
              // eslint-disable-next-line no-console
              console.log('[full-menu-scroll] end recalculated', {
                distance,
                trackScrollWidth: track.scrollWidth,
                windowInnerWidth: window.innerWidth,
                time: performance.now(),
              });
            }
            return '+=' + distance;
          },
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // Lets the eased scrub tween fast-forward to its end value when
          // the user scrolls quickly instead of continuing to ease toward
          // it after the raw scroll position has already passed the
          // trigger's end -- that lag is what let the pin release (raw
          // scroll past `end`) while the track's x was still a few cards
          // behind, producing the visible card/footer snap. Documented
          // GSAP fix for this exact class of pin+scrub end jump.
          fastScrollEnd: true,
          markers: debugMode,
        },
      });

      scrollTriggerRef.current = tween.scrollTrigger ?? null;
    }, sectionRef);

    return () => {
      scrollTriggerRef.current = null;
      // Discard the cached distance too -- a stale width-keyed entry from
      // before this effect re-ran (e.g. prefers-reduced-motion toggling
      // live) could otherwise be reused even though the track's own
      // scrollWidth may now measure differently (h-viewport--static
      // changes .h-track's layout mode).
      distanceCacheRef.current = null;
      ctx.revert();
    };
  }, [reducedMotion]);

  // Tab highlighting: watch each category's first-card probe element and
  // pick the leftmost currently-visible one as active. Works the same way
  // whether the track is being translated by GSAP (the normal case now,
  // at every width) or natively scrolled (reduced-motion only), since in
  // both cases the probe elements' actual on-screen position is what
  // IntersectionObserver measures — no need to branch this logic by mode.
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

  // Click-to-jump: bring a category's first card into view. Doesn't lock
  // out free scrolling/mouse-wheel afterward -- it's just a shortcut that
  // lands the user at the same scroll position they'd reach by scrolling
  // there themselves, so everything else (tab highlighting, further
  // horizontal scroll) keeps working exactly as before.
  const handleTabClick = (slug: CategorySlug) => {
    const probe = probeRefs.current[slug];
    if (!probe) return;

    if (reducedMotion || !scrollTriggerRef.current) {
      // No pin in this mode -- scroll the native horizontal container
      // directly (not probe.scrollIntoView, which could also scroll the
      // page vertically, which we don't want here).
      const viewportEl = viewportRef.current;
      if (!viewportEl) return;
      viewportEl.scrollTo({ left: probe.offsetLeft - getSidePadding(), behavior: 'smooth' });
      return;
    }

    const distance = getDistance();
    if (distance <= 0) return;

    const progress = Math.min(1, Math.max(0, probe.offsetLeft / distance));
    const st = scrollTriggerRef.current;
    const targetY = st.start + (st.end - st.start) * progress;

    // Lenis owns scroll state once active -- a raw window.scrollTo here
    // would fight its internal target/velocity and jank or snap back.
    if (lenisInstance.current) {
      lenisInstance.current.scrollTo(targetY, { duration: 1.2 });
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  return (
    <>
    <section ref={sectionRef} className="full-menu">
      <div
        className={'full-menu-tabs' + (reducedMotion ? ' full-menu-tabs--sticky' : '')}
        role="group"
        aria-label="پرش به دسته‌بندی منو"
      >
        {CATEGORY_META.map((cat) => {
          const available = availableCategories.some((c) => c.slug === cat.slug);
          const isActive = available && activeCategory === cat.slug;
          if (!available) return null; // all 6 categories have content now; kept as a guard for future categories added without photos yet
          return (
            <button
              key={cat.slug}
              type="button"
              aria-current={isActive ? 'true' : undefined}
              id={`cat-${cat.slug}`}
              className={'full-menu-tab focus-ring' + (isActive ? ' full-menu-tab--active' : '')}
              onClick={() => handleTabClick(cat.slug)}
            >
              {cat.name}
            </button>
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
            );
          })}
        </div>
      </div>
    </section>
    {/* Deliberate breathing room between the pinned section releasing
        (last card already fully shown, section back in normal flow) and
        the footer's top edge reaching the viewport. Without this, the
        footer began entering on the very next scroll pixel after the pin
        let go, with no defined gap -- which read as the footer colliding
        with the still-settling cards and jumping. This is plain
        unpinned document flow, no GSAP timing involved. */}
    <div className="full-menu-end-spacer" aria-hidden="true" />
    </>
  );
}
