'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CATEGORY_META,
  CATEGORIES_EYEBROW,
  CATEGORIES_TITLE,
  CATEGORIES_DESC,
  getCategoryItemCount,
  hasCategoryContent,
} from '@/lib/categories-data';
import { categoryIcons } from './icons';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

gsap.registerPlugin(ScrollTrigger);

export default function Categories() {
  const gridRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!gridRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.category-card');
      ScrollTrigger.batch(cards, {
        start: 'top 88%',
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', stagger: 0.25 }
          ),
      });
    }, gridRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="categories" id="categories">
      <p className="eyebrow-static">{CATEGORIES_EYEBROW}</p>
      <h2 className="categories-title">{CATEGORIES_TITLE}</h2>
      <p className="categories-desc">{CATEGORIES_DESC}</p>

      <div ref={gridRef} className="categories-grid">
        {CATEGORY_META.map((cat) => {
          const count = getCategoryItemCount(cat.slug);
          const available = hasCategoryContent(cat.slug);
          const Icon = categoryIcons[cat.slug];
          const card = (
            <div
              className={available ? 'category-card' : 'category-card category-card--soon'}
              style={reducedMotion ? undefined : { opacity: 0 }}
            >
              <Icon aria-hidden="true" className="category-icon" />
              <h3>{cat.name}</h3>
              <p>
                {available
                  ? `${count.toLocaleString('fa-IR')} ${cat.unit}`
                  : 'به‌زودی'}
              </p>
            </div>
          );

          return available ? (
            <Link
              key={cat.slug}
              href={`/menu#cat-${cat.slug}`}
              className="category-card-link focus-ring"
              aria-label={`مشاهده‌ی دسته‌ی ${cat.name}`}
            >
              {card}
            </Link>
          ) : (
            <div key={cat.slug} aria-disabled="true">
              {card}
            </div>
          );
        })}
      </div>
    </section>
  );
}
