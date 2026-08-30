'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, TouchEvent } from 'react';
import Image from 'next/image';
import type { Space } from '@/lib/spaces-data';

/**
 * Full-bleed photo viewer opened from a space card. RTL note: since the
 * whole page reads right-to-left, ArrowLeft is treated as "forward" (next
 * photo) and ArrowRight as "back" (previous) -- the opposite of an LTR
 * gallery's arrow mapping, but the one that matches how content flows on
 * this site. Swipe follows the same logic: a left-swipe advances.
 */
export default function SpaceLightbox({
  space,
  onClose,
}: {
  space: Space | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (space) {
      setIndex(0);
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [space]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  if (!space) {
    // Dialog stays mounted (so the close animation/native <dialog> close
    // transition has something to animate) but content is empty -- avoids
    // indexing into a null space below.
    return <dialog ref={dialogRef} className="space-lightbox" />;
  }

  const count = space.photos.length;
  const goTo = (next: number) => setIndex(((next % count) + count) % count);
  const goNext = () => goTo(index + 1);
  const goPrev = () => goTo(index - 1);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goNext();
    if (e.key === 'ArrowRight') goPrev();
  };

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    const SWIPE_THRESHOLD = 40;
    if (delta < -SWIPE_THRESHOLD) goNext();
    else if (delta > SWIPE_THRESHOLD) goPrev();
    touchStartX.current = null;
  };

  const current = space.photos[index];

  return (
    <dialog
      ref={dialogRef}
      className="space-lightbox"
      onKeyDown={onKeyDown}
      aria-label={space.title}
    >
      <div dir="rtl" className="space-lightbox-content">
        <button
          type="button"
          className="space-lightbox-close"
          onClick={() => dialogRef.current?.close()}
          aria-label="بستن"
        >
          ✕
        </button>

        <p className="space-lightbox-eyebrow">نمای نزدیک</p>
        <h3 className="space-lightbox-title">{space.title}</h3>

        <div
          className="space-lightbox-stage"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {count > 1 && (
            <button
              type="button"
              className="space-lightbox-nav space-lightbox-nav--prev"
              onClick={goPrev}
              aria-label="عکس قبلی"
            >
              ‹
            </button>
          )}
          {/* key={index} forces a fresh element per photo so the Ken Burns
              animation (CSS, starts at 0% on mount) restarts on every
              photo change instead of continuing mid-cycle. */}
          <div className="space-lightbox-image-wrap" key={index}>
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="(min-width: 1024px) 900px, 100vw"
              className="space-lightbox-image"
              priority
            />
          </div>
          {count > 1 && (
            <button
              type="button"
              className="space-lightbox-nav space-lightbox-nav--next"
              onClick={goNext}
              aria-label="عکس بعدی"
            >
              ›
            </button>
          )}
        </div>

        {count > 1 && (
          <div className="space-lightbox-filmstrip" role="tablist" aria-label="عکس‌های بیشتر">
            {space.photos.map((photo, i) => (
              <button
                key={photo.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`عکس ${i + 1} از ${count}`}
                className="space-lightbox-thumb"
                data-active={i === index}
                onClick={() => goTo(i)}
              >
                <Image src={photo.src} alt="" fill sizes="64px" className="space-lightbox-thumb-img" />
              </button>
            ))}
          </div>
        )}
      </div>
    </dialog>
  );
}
