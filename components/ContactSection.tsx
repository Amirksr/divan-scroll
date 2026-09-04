'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { toTelHref } from '@/lib/format';
import { buildMapEmbedUrl } from '@/lib/map-embed';
import ContactForm from './ContactForm';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { translate, type Locale, type Messages } from '@/lib/i18n';

gsap.registerPlugin(ScrollTrigger);

// Fictional street/alley in dict.footer.address won't geocode; embed the
// real, recognizable landmark contact_page.map_note already points to.
const MAP_QUERY = 'Sheikh Lotfollah Mosque, Isfahan, Iran';

export default function ContactSection({ locale, dict }: { locale: Locale; dict: Messages }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const t = (key: string) => translate(dict, key);

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
        <p className="eyebrow-static">{t('contact_page.eyebrow')}</p>
        <h1 className="contact-title">{t('contact_page.title')}</h1>
        <p className="contact-description">{t('contact_page.description')}</p>

        <div ref={gridRef} className="contact-grid">
          <div className="contact-reveal" style={reducedMotion ? undefined : { opacity: 0 }}>
            <ContactForm dict={dict} />
          </div>

          <div className="contact-reveal" style={reducedMotion ? undefined : { opacity: 0 }}>
            <h2 className="contact-info-title">{t('contact_page.info_title')}</h2>
            <ul className="contact-info-list">
              <li>{dict.footer.address}</li>
              <li dir="ltr">
                <a href={toTelHref(dict.footer.phone_intl)} className="focus-ring">
                  {dict.footer.phone}
                </a>
              </li>
              <li dir="ltr">
                <a href={`mailto:${dict.footer.email}`} className="focus-ring">
                  {dict.footer.email}
                </a>
              </li>
            </ul>

            <div className="contact-map">
              <iframe
                title={locale === 'fa' ? 'نقشه‌ی موقعیت دیوان' : "Map of Divan's location"}
                src={buildMapEmbedUrl(MAP_QUERY)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="contact-map-note">{t('contact_page.map_note')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
