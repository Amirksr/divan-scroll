'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SPACES } from '@/lib/spaces-data';
import { translate, type Locale, type Messages } from '@/lib/i18n';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import SpaceLightbox from '@/components/SpaceLightbox';

gsap.registerPlugin(ScrollTrigger);

export default function AmbianceSpaces({ locale, dict }: { locale: Locale; dict: Messages }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const t = (key: string) => translate(dict, key);
  const isFa = locale === 'fa';
  const [activeSpace, setActiveSpace] = useState<(typeof SPACES)[number] | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from('.space-card', {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.space-card-grid',
          start: 'top 82%',
          toggleActions: 'play none none none',
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="ambiance" ref={sectionRef} id="ambiance">
      <div className="ambiance-inner" dir={isFa ? 'rtl' : 'ltr'}>
        <div className="ambiance-intro">
          <p className="ambiance-eyebrow">{t('ambiance.eyebrow')}</p>
          <h2 className="ambiance-title">{t('ambiance.title')}</h2>
          <p className="ambiance-description">{t('ambiance.description')}</p>

          <dl className="ambiance-hours">
            <dt className="ambiance-hours-title">{t('hours.title')}</dt>
            <div className="ambiance-hours-row">
              <span>{t('hours.everyday')}</span>
              <span className="ambiance-hours-time">{t('hours.everyday_time')}</span>
            </div>
            <div className="ambiance-hours-row">
              <span>{t('hours.weekend')}</span>
              <span className="ambiance-hours-time">{t('hours.weekend_time')}</span>
            </div>
          </dl>
        </div>

        <div className="space-card-grid">
          {SPACES.map((space) => (
            <button
              key={space.key}
              type="button"
              className="space-card"
              onClick={() => setActiveSpace(space)}
            >
              <Image
                src={space.coverImage}
                alt=""
                fill
                sizes="(min-width: 640px) 25vw, 50vw"
                className="space-card-img"
              />
              <div className="space-card-scrim" aria-hidden="true" />
              <span className="space-card-body">
                <span className="space-card-title">{isFa ? space.title : space.titleEn}</span>
                <span className="space-card-desc">{isFa ? space.description : space.descriptionEn}</span>
                <span className="space-card-count">
                  {t('ambiance.photo_count').replace('{count}', String(space.photos.length))}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <SpaceLightbox space={activeSpace} onClose={() => setActiveSpace(null)} locale={locale} dict={dict} />
    </section>
  );
}
