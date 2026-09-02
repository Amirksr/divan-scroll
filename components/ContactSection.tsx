'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { toTelHref } from '@/lib/format';
import { buildMapEmbedUrl } from '@/lib/map-embed';
import ContactForm from './ContactForm';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

gsap.registerPlugin(ScrollTrigger);

/**
 * Same real DivanCafe values Footer.tsx uses — duplicated here rather than
 * imported, matching Footer.tsx's own convention (it hardcodes these
 * inline with an explanatory comment rather than pulling from a shared
 * lib module).
 */
const ADDRESS = 'اصفهان، خیابان چهارباغ عباسی، کوچه‌ی نارنجستان، پلاک ۱۲';
const PHONE = '۰۳۱-۳۲۲۰۱۵۵۵';
const PHONE_INTL = '+98 31 3220 1555';
const EMAIL = 'hello@divan-cafe.ir';
const MAP_NOTE = 'روی نقشه، دیوان درست پشت مسجد شیخ لطف‌الله قرار دارد.';
// Fictional street/alley in ADDRESS won't geocode; embed the real,
// recognizable landmark the note above already points to instead.
const MAP_QUERY = 'Sheikh Lotfollah Mosque, Isfahan, Iran';

export default function ContactSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!gridRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      const columns = gsap.utils.toArray<HTMLElement>('.contact-reveal');
      ScrollTrigger.batch(columns, {
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
    <section className="contact-section" id="contact">
      <div className="contact-section-inner">
        <p className="eyebrow-static">در تماس باشید</p>
        <h1 className="contact-title">دیوان را پیدا کنید</h1>
        <p className="contact-description">
          برای رزرو میز، رویدادهای خصوصی یا فقط یک سلام، پیام بگذارید یا با ما تماس بگیرید.
        </p>

        <div ref={gridRef} className="contact-grid">
          <div className="contact-reveal" style={reducedMotion ? undefined : { opacity: 0 }}>
            <ContactForm />
          </div>

          <div className="contact-reveal" style={reducedMotion ? undefined : { opacity: 0 }}>
            <h2 className="contact-info-title">راه‌های ارتباطی</h2>
            <ul className="contact-info-list">
              <li>{ADDRESS}</li>
              <li dir="ltr">
                <a href={toTelHref(PHONE_INTL)} className="focus-ring">
                  {PHONE}
                </a>
              </li>
              <li dir="ltr">
                <a href={`mailto:${EMAIL}`} className="focus-ring">
                  {EMAIL}
                </a>
              </li>
            </ul>

            <div className="contact-map">
              <iframe
                title="نقشه‌ی موقعیت دیوان"
                src={buildMapEmbedUrl(MAP_QUERY)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="contact-map-note">{MAP_NOTE}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
