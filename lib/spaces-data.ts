/**
 * Ported from DivanCafe's src/lib/data.ts (`ambianceFeatures`, `spacePhotos`)
 * and messages/fa.json (`ambiance`, `ambiance.features`, `space_page`).
 *
 * DivanCafe shows these 4 spaces as text-only cards linking to a separate
 * /spaces/[key] route with a hero photo + thumbnail grid. divan-scroll has
 * no page routing -- it's a single continuous scroll -- so the equivalent
 * here is a same-page lightbox (see SpaceLightbox.tsx) rather than a
 * navigation. Card backgrounds reuse the same 4 photos already ported for
 * the "دفتر تصاویر" gallery section (public/images/gallery/), since
 * DivanCafe's own /spaces hero photo for each key is literally that same
 * source image (spacePhotos[key][0] and galleryPhotos both point at the
 * same photography); the remaining spacePhotos entries become the
 * lightbox's additional shots.
 */

export interface SpacePhoto {
  /** Path under /public. */
  src: string;
  alt: string;
}

export interface Space {
  key: 'interior' | 'courtyard' | 'roastery' | 'library';
  title: string;
  description: string;
  /** Card background -- same photo as the gallery section's version of this space. */
  coverImage: string;
  /** Everything the lightbox can page through, cover photo included first. */
  photos: SpacePhoto[];
}

export const SPACES: Space[] = [
  {
    key: 'interior',
    title: 'فضای داخلی',
    description: 'طاق‌های آجری اصیل با میزهای چوب گردو',
    coverImage: '/images/gallery/interior.webp',
    photos: [1, 2, 3, 4, 5, 6, 7].map((n) => ({
      src: `/images/space-photos/interior-${n}.webp`,
      alt: 'فضای داخلی',
    })),
  },
  {
    key: 'courtyard',
    title: 'حیاط مرکزی',
    description: 'نشستن زیر درخت نارنج در فصل بهار',
    coverImage: '/images/gallery/courtyard.webp',
    photos: [1, 2, 3, 4, 5, 6].map((n) => ({
      src: `/images/space-photos/courtyard-${n}.webp`,
      alt: 'حیاط مرکزی',
    })),
  },
  {
    key: 'roastery',
    title: 'رست‌خانه‌ی شیشه‌ای',
    description: 'تماشای برشته‌کاری دانه‌ها از نزدیک',
    coverImage: '/images/gallery/roastery.webp',
    photos: [1, 2, 3, 4].map((n) => ({
      src: `/images/space-photos/roastery-${n}.webp`,
      alt: 'رست‌خانه‌ی شیشه‌ای',
    })),
  },
  {
    key: 'library',
    title: 'گوشه‌ی کتاب',
    description: 'قفسه‌ای از شعر کلاسیک و مدرن فارسی',
    coverImage: '/images/gallery/library.webp',
    photos: [1, 2, 3, 4].map((n) => ({
      src: `/images/space-photos/library-${n}.webp`,
      alt: 'گوشه‌ی کتاب',
    })),
  },
];

export const SPACES_HEADER = {
  eyebrow: 'فضای دیوان',
  title: 'خانه‌ای برای ماندن',
  description:
    'دیوان در دل یک خانه‌ی قدیمی اصفهانی جا گرفته؛ طاق‌های آجری، حیاط مرکزی و نوری که ساعت به ساعت رنگ عوض می‌کند. جایی برای کار، دیدار دوستان یا فقط نشستن با یک کتاب.',
};

export const HOURS = {
  title: 'ساعات کاری',
  everyday: 'شنبه تا پنجشنبه',
  everydayTime: '۷:۳۰ صبح — ۲۳:۰۰',
  weekend: 'جمعه',
  weekendTime: '۹:۰۰ صبح — ۲۴:۰۰',
};
