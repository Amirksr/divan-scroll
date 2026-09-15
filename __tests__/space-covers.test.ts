import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { SPACES } from '@/lib/spaces-data';

const publicDir = path.join(__dirname, '..', 'public');
const hash = (relSrc: string) =>
  crypto.createHash('md5').update(fs.readFileSync(path.join(publicDir, relSrc))).digest('hex');

/**
 * Regression test for a real issue: every "فضای دیوان" card background
 * pointed at public/images/gallery/<key>.webp, which is byte-identical to
 * space-photos/<key>-1.webp. The result was the same four photographs
 * appearing twice on one page -- once as space cards, once in the
 * "دفتر تصاویر" gallery strip.
 */
describe('space card covers are distinct from the gallery photos', () => {
  it('every cover file exists', () => {
    for (const space of SPACES) {
      expect(fs.existsSync(path.join(publicDir, space.coverImage))).toBe(true);
    }
  });

  it('no cover is the same image as any gallery photo', () => {
    const galleryDir = path.join(publicDir, 'images', 'gallery');
    const galleryHashes = new Set(
      fs
        .readdirSync(galleryDir)
        .filter((f) => f.endsWith('.webp'))
        .map((f) => hash(path.posix.join('/images/gallery', f)))
    );
    expect(galleryHashes.size).toBeGreaterThan(0);

    for (const space of SPACES) {
      expect([space.key, galleryHashes.has(hash(space.coverImage))]).toEqual([space.key, false]);
    }
  });

  it('no two spaces share a cover', () => {
    const hashes = SPACES.map((s) => hash(s.coverImage));
    expect(new Set(hashes).size).toBe(SPACES.length);
  });

  it('each cover is drawn from that space\u2019s own photo set', () => {
    for (const space of SPACES) {
      expect([space.key, space.coverImage.includes(`/${space.key}-`)]).toEqual([space.key, true]);
    }
  });

  it('lists the cover first so the lightbox opens on the clicked image', () => {
    for (const space of SPACES) {
      expect([space.key, space.photos[0].src]).toEqual([space.key, space.coverImage]);
    }
  });

  it('still includes every photo of each space exactly once', () => {
    for (const space of SPACES) {
      const srcs = space.photos.map((p) => p.src);
      expect(new Set(srcs).size).toBe(srcs.length);
      for (const src of srcs) {
        expect([src, fs.existsSync(path.join(publicDir, src))]).toEqual([src, true]);
      }
    }
  });
});
