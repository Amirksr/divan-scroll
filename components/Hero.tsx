'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SmokeCanvas from './SmokeCanvas';
import { getParagraphOpacity } from '@/lib/story-utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { translate, type Messages } from '@/lib/i18n';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ dict }: { dict: Messages }) {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const t = (key: string) => translate(dict, key);

  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current) return;

    // gsap.context scopes every tween/ScrollTrigger created inside to this
    // component's DOM subtree, so ctx.revert() on unmount (route change,
    // fast refresh) cleans everything up automatically -- no manual
    // ScrollTrigger.getAll().forEach(kill) bookkeeping needed.
    const ctx = gsap.context((self) => {
      const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } });
      entrance
        .to('.eyebrow', { opacity: 1, y: -4, duration: 0.8 }, 0.1)
        .to('.title-fa', { opacity: 1, duration: 0.9 }, 0.15)
        .to('.hero-line', { height: '3.2rem', duration: 0.8 }, 0.5)
        .to('.subline', { opacity: 1, y: -4, duration: 0.8 }, 0.7)
        .to('.hero-description', { opacity: 1, y: -4, duration: 0.8 }, 0.85)
        .to('.scroll-cue', { opacity: 1, duration: 0.6 }, 1.0);

      if (!reducedMotion) {
        const videoProgress = { value: 0 };
        const syncVideo = () => {
          const video = videoRef.current;
          if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
          video.currentTime = videoProgress.value * video.duration;
        };
        const video = videoRef.current;
        video?.addEventListener('loadedmetadata', syncVideo);
        syncVideo();

        const scrollTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: '+=180%',
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
          },
        });

        scrollTimeline
          .to(videoProgress, { value: 1, duration: 1, ease: 'none', onUpdate: syncVideo }, 0)
          .to('.title-fa', { opacity: 0, filter: 'blur(8px)', y: -24, scale: 0.92, duration: 1 }, 0)
          .to('.title-en', { opacity: 1, filter: 'blur(0px)', duration: 1 }, '<0.15')
          .to('.scroll-cue', { opacity: 0, duration: 0.3 }, 0);

        // Landscape phones / small tablets (640-767px): the eyebrow +
        // title alone already claim most of the short viewport height, so
        // the subline and description can't both sit statically without
        // crowding or clipping. Reusing AboutStory's tested crossfade math
        // here instead of stacking them: subline is fully visible at
        // scroll-start, description takes over by scroll-end. A second
        // (non-pinning) ScrollTrigger tracks the exact same range as the
        // pin above so both animations move in lockstep.
        const mm = gsap.matchMedia();
        mm.add('(min-width: 640px) and (max-width: 767.98px)', () => {
          const crossfadeTrigger = ScrollTrigger.create({
            trigger: rootRef.current,
            start: 'top top',
            end: '+=180%',
            scrub: 0.6,
            onUpdate: (self) => {
              gsap.set('.subline', { opacity: getParagraphOpacity(self.progress, 0, 2) });
              gsap.set('.hero-description', { opacity: getParagraphOpacity(self.progress, 1, 2) });
            },
          });
          return () => crossfadeTrigger.kill();
        });

        return () => {
          video?.removeEventListener('loadedmetadata', syncVideo);
        };
      } else {
        gsap.set('.title-fa', { opacity: 0.4 });
        gsap.set('.title-en', { opacity: 1, filter: 'blur(0px)' });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={rootRef} className="hero" id="hero">
      {reducedMotion ? (
        <Image
          src="/images/hero/exterior.webp"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="hero-bg-photo"
        />
      ) : (
        <video
          ref={videoRef}
          className="hero-bg-photo"
          src="/videos/divan-interior-hero.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      )}
      <div className="hero-bg-scrim" aria-hidden="true" />
      <SmokeCanvas active={!reducedMotion} className="smoke-canvas" />
      <div className="hero-inner">
        <div className="eyebrow">{t('hero.eyebrow')}</div>
        <div className="title-stack">
          <div className="title-fa">دیوان</div>
          <div className="title-en">DIVAN</div>
        </div>
        <div className="hero-line" />
        <div className="hero-crossfade">
          <div className="subline">{t('hero.subtitle')}</div>
          <p className="hero-description">{t('hero.description')}</p>
        </div>
      </div>
      <div className="scroll-cue">{t('hero.scroll_cue')}</div>
    </section>
  );
}
