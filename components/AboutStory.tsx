'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STORY } from '@/lib/story-data';
import { getParagraphOpacity } from '@/lib/story-utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import type { Locale } from '@/lib/i18n';

gsap.registerPlugin(ScrollTrigger);

const PARAGRAPH_COUNT = STORY.paragraphsFa.length;

export default function AboutStory({ locale }: { locale: Locale }) {
  const sectionRef = useRef<HTMLElement>(null);
  const paragraphRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const valueRefs = useRef<Array<HTMLDivElement | null>>([]);
  const teamRefs = useRef<Array<HTMLDivElement | null>>([]);
  const reducedMotion = useReducedMotion();
  const isFa = locale === 'fa';
  const paragraphs = isFa ? STORY.paragraphsFa : STORY.paragraphsEn;
  const values = isFa ? STORY.values : STORY.valuesEn;
  const team = isFa ? STORY.team : STORY.teamEn;

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
          // Was '+=120%', then '+=95%': with 3 paragraphs and a 0.3
          // crossfade, the third paragraph finishes fading in by ~77%
          // progress and then just sits there, fully visible and
          // unchanging, for the rest of the pin. Even at 95% that
          // "settled" stretch was still ~22vh of scrolling with no visual
          // feedback before the values section could appear -- still read
          // as a dead gap. Cutting further to 55% shrinks that same
          // trailing stretch to ~13vh; per-paragraph crossfade
          // proportions are still untouched either way
          // (getParagraphOpacity is progress-based, not distance-based).
          end: '+=55%',
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

      // Individual per-card ScrollTriggers don't work here: all 3 cards
      // sit in one row on desktop (same CSS grid row = same vertical
      // scroll position), so they'd all cross "top 85%" in the same
      // instant and only the ~100ms `delay` offset would separate them —
      // too subtle to read as "one at a time". ScrollTrigger.batch is the
      // built-in tool for exactly this: it groups elements that enter
      // together and lets a single tween's `stagger` sequence them
      // explicitly, independent of their actual layout position.
      const cards = valueRefs.current.filter((el): el is HTMLDivElement => el !== null);
      if (cards.length > 0) {
        ScrollTrigger.batch(cards, {
          start: 'top 85%',
          onEnter: (batch) =>
            gsap.fromTo(
              batch,
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', stagger: 0.3 }
            ),
        });
      }

      // Team cards get their own batch, same reveal language as the value
      // cards above, so the two grids read as one consistent motion system
      // rather than two different scroll behaviors stacked on the page.
      const teamCards = teamRefs.current.filter((el): el is HTMLDivElement => el !== null);
      if (teamCards.length > 0) {
        ScrollTrigger.batch(teamCards, {
          start: 'top 85%',
          onEnter: (batch) =>
            gsap.fromTo(
              batch,
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', stagger: 0.3 }
            ),
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="about-story" id="about">
      <div className="about-pin">
        <p className="eyebrow-static">{isFa ? STORY.eyebrowFa : STORY.eyebrowEn}</p>
        <h2 className="about-title">{isFa ? STORY.titleFa : STORY.titleEn}</h2>
        <div className={reducedMotion ? 'about-paragraphs about-paragraphs--static' : 'about-paragraphs'}>
          {paragraphs.map((text, i) => (
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
        <p className="about-values-title">{isFa ? STORY.valuesTitleFa : STORY.valuesTitleEn}</p>
        <div className="about-values-grid">
          {values.map((value, i) => (
            <div
              key={value.title}
              ref={(el) => {
                valueRefs.current[i] = el;
              }}
              className="about-value-card"
              style={reducedMotion ? undefined : { opacity: 0 }}
            >
              <h3>{value.title}</h3>
              <p>{value.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="about-team">
        <p className="about-team-title">{isFa ? STORY.teamTitleFa : STORY.teamTitleEn}</p>
        <div className="about-team-grid">
          {team.map((member, i) => (
            <div
              key={member.name}
              ref={(el) => {
                teamRefs.current[i] = el;
              }}
              className="about-team-card"
              style={reducedMotion ? undefined : { opacity: 0 }}
            >
              <span aria-hidden="true" className="about-team-avatar">
                {member.name.slice(0, 1)}
              </span>
              <div>
                <p className="about-team-name">{member.name}</p>
                <p className="about-team-role">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
