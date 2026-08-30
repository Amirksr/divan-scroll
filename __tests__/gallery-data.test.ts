import { GALLERY_PHOTOS, GALLERY_BENTO_SPANS, GALLERY_HEADER } from '../lib/gallery-data';

describe('gallery-data', () => {
  it('has exactly 6 photos, matching DivanCafe\'s real gallery order', () => {
    expect(GALLERY_PHOTOS.map((p) => p.id)).toEqual([
      'interior',
      'courtyard',
      'roastery',
      'library',
      'coffee',
      'pastry',
    ]);
  });

  it('every photo has a non-empty Farsi caption', () => {
    for (const photo of GALLERY_PHOTOS) {
      expect(photo.caption.length).toBeGreaterThan(0);
    }
  });

  it('local photos point under /images/gallery/, and the one remote photo is a valid https URL', () => {
    for (const photo of GALLERY_PHOTOS) {
      if (photo.id === 'coffee') {
        expect(photo.image.startsWith('https://')).toBe(true);
      } else {
        expect(photo.image.startsWith('/images/gallery/')).toBe(true);
      }
    }
  });

  it('has one bento span per photo, and every span is a recognized size', () => {
    expect(GALLERY_BENTO_SPANS.length).toBe(GALLERY_PHOTOS.length);
    for (const span of GALLERY_BENTO_SPANS) {
      expect(['featured', 'wide', 'solo']).toContain(span);
    }
  });

  it('has exactly one featured (large) cell', () => {
    const featuredCount = GALLERY_BENTO_SPANS.filter((s) => s === 'featured').length;
    expect(featuredCount).toBe(1);
  });

  it('has non-empty header copy', () => {
    expect(GALLERY_HEADER.eyebrow.length).toBeGreaterThan(0);
    expect(GALLERY_HEADER.title.length).toBeGreaterThan(0);
    expect(GALLERY_HEADER.description.length).toBeGreaterThan(0);
  });
});
