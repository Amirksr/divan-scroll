'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GALLERY_PHOTOS, GALLERY_BENTO_SPANS, GALLERY_HEADER, type GalleryBentoSpan } from '@/lib/gallery-data';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

gsap.registerPlugin(ScrollTrigger);

// Matches each span's actual rendered width share at the sm+ breakpoint
// (see .gallery-grid in globals.css: a 4-column grid), so next/image
// requests an appropriately-sized source per cell instead of one blanket
// guess -- the featured cell is roughly twice as wide as a solo cell.
const SIZES_BY_SPAN: Record<GalleryBentoSpan, string> = {
  featured: '(min-width: 640px) 50vw, 50vw',
  wide: '(min-width: 640px) 50vw, 50vw',
  solo: '(min-width: 640px) 25vw, 50vw',
};

/**
 * "دفتر ورق‌خور" (page-turn notebook) reveal: each cell starts covered by a
 * solid panel (.gallery-cell-cover) the same color as the page background,
 * as if looking at the back of a notebook page. On scroll into view, the
 * cover collapses away from a fixed edge (scaleX 1 -> 0, transform-origin
 * on the trailing edge) uncovering the photo underneath -- a wipe rather
 * than a literal 3D page flip, which stays cheap to animate (no
 * perspective/backface-visibility juggling) while still reading as "a page
 * opening" because of the hard-edged reveal and slight photo settle-scale
 * underneath it.
 *
 * The Ken Burns hover/focus zoom is plain CSS (see .gallery-cell-img in
 * globals.css) -- a long, slow transition is simpler and cheaper as a CSS
 * transition than as a GSAP tween, and doesn't need scroll-position
 * awareness the way the cover reveal does.
 */
export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      const cells = gsap.utils.toArray<HTMLElement>('.gallery-cell');

      cells.forEach((cell, i) => {
        const cover = cell.querySelector('.gallery-cell-cover');
        const img = cell.querySelector('.gallery-cell-img');
        if (!cover) return;

        gsap.timeline({
          scrollTrigger: {
            trigger: cell,
            start: 'top 85%',
            toggleActions: 'play none none none',
            // Each cell fires once, independent of the others -- no
            // batching needed since there's no shared timeline/spacing
            // math like FullMenuScroll's pin, just per-cell reveals.
            once: true,
          },
          // Small per-cell offset only matters when several cells cross
          // the 85%-viewport threshold in the same scroll frame (a fast
          // flick); capped low so it reads as a soft ripple, not a
          // deliberate reading-order sequence -- the bento grid's cells
          // aren't a uniform row/column order (the featured cell alone
          // occupies a 2x2 footprint), so there's no single "correct"
          // index-based order to stagger by.
          delay: Math.min(i, 3) * 0.06,
        })
          .fromTo(
            cover,
            { scaleX: 1 },
            { scaleX: 0, duration: 0.85, ease: 'power3.inOut' },
            0
          )
          .fromTo(img, { scale: 1.12 }, { scale: 1, duration: 0.85, ease: 'power3.out' }, 0);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="gallery" ref={sectionRef}>
      <div className="gallery-inner" dir="rtl">
        <p className="gallery-eyebrow">{GALLERY_HEADER.eyebrow}</p>
        <h2 className="gallery-title">{GALLERY_HEADER.title}</h2>
        <p className="gallery-description">{GALLERY_HEADER.description}</p>

        <div className="gallery-grid">
          {GALLERY_PHOTOS.map((photo, i) => (
            <figure
              className={`gallery-cell gallery-cell--${GALLERY_BENTO_SPANS[i]}`}
              key={photo.id}
            >
              <Image
                src={photo.image}
                alt={photo.caption}
                fill
                sizes={SIZES_BY_SPAN[GALLERY_BENTO_SPANS[i]]}
                className="gallery-cell-img"
              />
              <div className="gallery-cell-scrim" aria-hidden="true" />
              {/* Reduced motion: cover renders but never animates (no
                  ScrollTrigger registered above), so it would permanently
                  hide the photo -- skip rendering it entirely in that case
                  instead of trying to animate under prefers-reduced-motion. */}
              {!reducedMotion && <div className="gallery-cell-cover" aria-hidden="true" />}
              <figcaption className="gallery-cell-caption">{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
