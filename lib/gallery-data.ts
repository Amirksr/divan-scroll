/**
 * Ported directly from DivanCafe's src/lib/data.ts (`galleryPhotos`) +
 * messages/fa.json (`gallery`, `ambiance.features`, `categories.items`).
 * Same 6 photos, same captions, same order (interior, courtyard, roastery,
 * library, coffee, pastry) as the real site's "دفتر تصاویر" section.
 *
 * 5 of 6 are DivanCafe's real local photography (see
 * public/images/gallery/); "coffee" has no local photo in DivanCafe either
 * (it's the one item still sourced from Unsplash there), so it's kept as
 * the same remote Unsplash URL rather than substituting a different image.
 */

export interface GalleryPhoto {
  id: string;
  caption: string;
  captionEn: string;
  image: string;
}

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  { id: 'interior', caption: 'فضای داخلی', captionEn: 'Interior', image: '/images/gallery/interior.webp' },
  { id: 'courtyard', caption: 'حیاط مرکزی', captionEn: 'Courtyard', image: '/images/gallery/courtyard.webp' },
  {
    id: 'roastery',
    caption: 'رست‌خانه‌ی شیشه‌ای',
    captionEn: 'Glass roastery',
    image: '/images/gallery/roastery.webp',
  },
  { id: 'library', caption: 'گوشه‌ی کتاب', captionEn: 'Reading corner', image: '/images/gallery/library.webp' },
  {
    id: 'coffee',
    caption: 'قهوه و اسپرسو',
    captionEn: 'Coffee & Espresso',
    image: 'https://images.unsplash.com/photo-1426174840074-541ae41efdb9?w=800&q=80&auto=format&fit=crop',
  },
  { id: 'pastry', caption: 'شیرینی و دسر', captionEn: 'Pastry & Dessert', image: '/images/gallery/pastry.webp' },
];

/**
 * Bento cell sizing, one entry per GALLERY_PHOTOS index (same visual
 * arrangement as DivanCafe's BENTO_SPANS): interior is the large featured
 * cell, courtyard/coffee/pastry are wide cells, roastery/library are the
 * two small square cells. Applies at the sm breakpoint and up -- mobile
 * uses a plain uniform 2-column grid regardless of this mapping.
 */
export type GalleryBentoSpan = 'featured' | 'wide' | 'solo';

export const GALLERY_BENTO_SPANS: GalleryBentoSpan[] = [
  'featured', // interior
  'wide', // courtyard
  'solo', // roastery
  'solo', // library
  'wide', // coffee
  'wide', // pastry
];

export const GALLERY_HEADER = {
  eyebrow: 'دفتر تصاویر',
  title: 'نمایی از دیوان',
  description: 'نوری که از پنجره‌های قدیمی خانه می‌تابد، بخار قهوه و صدای آرام گفت‌وگو.',
};
