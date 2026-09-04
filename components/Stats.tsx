'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STATS, STATS_TITLE_FA, STATS_TITLE_EN, formatStatValue } from '@/lib/stats-data';
import { translate, type Locale, type Messages } from '@/lib/i18n';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

gsap.registerPlugin(ScrollTrigger);

export default function Stats({ locale, dict }: { locale: Locale; dict: Messages }) {
  const sectionRef = useRef<HTMLElement>(null);
  const valueRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const reducedMotion = useReducedMotion();
  const title = locale === 'fa' ? STATS_TITLE_FA : STATS_TITLE_EN;

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;

    const els = valueRefs.current.filter((el): el is HTMLParagraphElement => el !== null);

    if (reducedMotion) {
      // Skip the count-up animation entirely and just render final values —
      // still uses formatStatValue so the displayed text matches exactly
      // what the animated version would land on.
      els.forEach((el, i) => {
        el.textContent = formatStatValue(STATS[i].value, STATS[i].decimals, STATS[i].suffix, locale);
      });
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.batch(els, {
        start: 'top 88%',
        onEnter: (batch) => {
          batch.forEach((el) => {
            const i = els.indexOf(el as HTMLParagraphElement);
            const stat = STATS[i];
            const counter = { value: 0 };
            gsap.to(counter, {
              value: stat.value,
              duration: 1.6,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = formatStatValue(counter.value, stat.decimals, stat.suffix, locale);
              },
            });
          });
          gsap.fromTo(batch, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, locale]);

  return (
    <section ref={sectionRef} className="stats" aria-label={title}>
      <div className="stats-grid">
        {STATS.map((stat, i) => (
          <div key={stat.key} className="stat-item">
            <p
              ref={(el) => {
                valueRefs.current[i] = el;
              }}
              className="stat-value"
              style={reducedMotion ? undefined : { opacity: 0 }}
            >
              {formatStatValue(0, stat.decimals, '', locale)}
            </p>
            <p className="stat-label">{locale === 'fa' ? stat.labelFa : stat.labelEn}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
