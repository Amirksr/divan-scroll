'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SPACES, SPACES_HEADER, HOURS } from '@/lib/spaces-data';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import SpaceLightbox from '@/components/SpaceLightbox';

gsap.registerPlugin(ScrollTrigger);

export default function AmbianceSpaces() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
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
      <div className="ambiance-inner" dir="rtl">
        <div className="ambiance-intro">
          <p className="ambiance-eyebrow">{SPACES_HEADER.eyebrow}</p>
          <h2 className="ambiance-title">{SPACES_HEADER.title}</h2>
          <p className="ambiance-description">{SPACES_HEADER.description}</p>

          <dl className="ambiance-hours">
            <dt className="ambiance-hours-title">{HOURS.title}</dt>
            <div className="ambiance-hours-row">
              <span>{HOURS.everyday}</span>
              <span className="ambiance-hours-time">{HOURS.everydayTime}</span>
            </div>
            <div className="ambiance-hours-row">
              <span>{HOURS.weekend}</span>
              <span className="ambiance-hours-time">{HOURS.weekendTime}</span>
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
                <span className="space-card-title">{space.title}</span>
                <span className="space-card-desc">{space.description}</span>
                <span className="space-card-count">{space.photos.length} عکس</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <SpaceLightbox space={activeSpace} onClose={() => setActiveSpace(null)} />
    </section>
  );
}
