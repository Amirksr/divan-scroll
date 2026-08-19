'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STORY } from '@/lib/story-data';
import { getParagraphOpacity } from '@/lib/story-utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

gsap.registerPlugin(ScrollTrigger);

const PARAGRAPH_COUNT = STORY.paragraphsFa.length;

export default function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const paragraphRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const valueRefs = useRef<Array<HTMLDivElement | null>>([]);
  const reducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        // No pin, no scrub: every paragraph and value just sits fully
        // visible in normal document flow (see the CSS's reduced-motion
        // fallback layout).
        return;
      }

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            paragraphRefs.current.forEach((el, i) => {
              if (!el) return;
              const opacity = getParagraphOpacity(self.progress, i, PARAGRAPH_COUNT);
              gsap.set(el, { opacity, y: (1 - opacity) * 12 });
            });
          },
        },
      });

      valueRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="about-story" id="about">
      <div className="about-pin">
        <p className="eyebrow-static">{STORY.eyebrowFa}</p>
        <h2 className="about-title">{STORY.titleFa}</h2>
        <div className={reducedMotion ? 'about-paragraphs about-paragraphs--static' : 'about-paragraphs'}>
          {STORY.paragraphsFa.map((text, i) => (
            <p
              key={i}
              ref={(el) => {
                paragraphRefs.current[i] = el;
              }}
              className="about-paragraph"
              style={reducedMotion ? undefined : { opacity: i === 0 ? 1 : 0 }}
            >
              {text}
            </p>
          ))}
        </div>
      </div>

      <div className="about-values">
        <p className="about-values-title">{STORY.valuesTitleFa}</p>
        <div className="about-values-grid">
          {STORY.values.map((value, i) => (
            <div
              key={value.title}
              ref={(el) => {
                valueRefs.current[i] = el;
              }}
              className="about-value-card"
            >
              <h3>{value.title}</h3>
              <p>{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
