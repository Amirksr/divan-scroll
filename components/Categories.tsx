'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CATEGORY_META,
  CATEGORIES_EYEBROW,
  CATEGORIES_EYEBROW_EN,
  CATEGORIES_TITLE,
  CATEGORIES_TITLE_EN,
  CATEGORIES_DESC,
  CATEGORIES_DESC_EN,
  getCategoryItemCount,
  hasCategoryContent,
} from '@/lib/categories-data';
import { categoryIcons } from './icons';
import { translate, type Locale, type Messages } from '@/lib/i18n';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

gsap.registerPlugin(ScrollTrigger);

export default function Categories({ locale, dict }: { locale: Locale; dict: Messages }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const t = (key: string) => translate(dict, key);
  const isFa = locale === 'fa';

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
      <p className="eyebrow-static">{isFa ? CATEGORIES_EYEBROW : CATEGORIES_EYEBROW_EN}</p>
      <h2 className="categories-title">{isFa ? CATEGORIES_TITLE : CATEGORIES_TITLE_EN}</h2>
      <p className="categories-desc">{isFa ? CATEGORIES_DESC : CATEGORIES_DESC_EN}</p>

      <div ref={gridRef} className="categories-grid">
        {CATEGORY_META.map((cat) => {
          const count = getCategoryItemCount(cat.slug);
          const available = hasCategoryContent(cat.slug);
          const Icon = categoryIcons[cat.slug];
          const name = isFa ? cat.name : cat.nameEn;
          const unit = isFa ? cat.unit : cat.unitEn;
          const card = (
            <div
              className={available ? 'category-card' : 'category-card category-card--soon'}
              style={reducedMotion ? undefined : { opacity: 0 }}
            >
              <Icon aria-hidden="true" className="category-icon" />
              <h3>{name}</h3>
              <p>
                {available
                  ? `${count.toLocaleString(isFa ? 'fa-IR' : 'en-US')} ${unit}`
                  : t('common.coming_soon')}
              </p>
            </div>
          );

          return available ? (
            <Link
              key={cat.slug}
              href={`/${locale}/menu#cat-${cat.slug}`}
              className="category-card-link focus-ring"
              aria-label={t('common.view_category').replace('{name}', name)}
            >
              {card}
            </Link>
          ) : (
            <div key={cat.slug}>{card}</div>
          );
        })}
      </div>
    </section>
  );
}
