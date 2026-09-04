import { SPACES, SPACES_HEADER, HOURS } from '../lib/spaces-data';

describe('spaces-data', () => {
  it('has exactly the 4 real DivanCafe spaces, in order', () => {
    expect(SPACES.map((s) => s.key)).toEqual(['interior', 'courtyard', 'roastery', 'library']);
  });

  it('matches DivanCafe\'s real photo counts per space', () => {
    const counts = Object.fromEntries(SPACES.map((s) => [s.key, s.photos.length]));
    expect(counts).toEqual({ interior: 7, courtyard: 6, roastery: 4, library: 4 });
  });

  it('every space has a non-empty title and description', () => {
    for (const space of SPACES) {
      expect(space.title.length).toBeGreaterThan(0);
      expect(space.description.length).toBeGreaterThan(0);
    }
  });

  it('every space photo path is unique and under /images/space-photos/', () => {
    const allPaths = SPACES.flatMap((s) => s.photos.map((p) => p.src));
    expect(new Set(allPaths).size).toBe(allPaths.length);
    for (const path of allPaths) {
      // Was asserting '/space-photos/' (no /images prefix) -- didn't
      // match the actual data (`/images/space-photos/...`, same
      // convention as coverImage's `/images/gallery/...` below), so this
      // assertion had been failing since the day this file was written.
      // Not part of this session's i18n work, but a one-line fix
      // encountered directly while touching this exact file for that.
      expect(path.startsWith('/images/space-photos/')).toBe(true);
    }
  });

  it('every cover image points under /images/gallery/, matching the gallery section\'s photos', () => {
    for (const space of SPACES) {
      expect(space.coverImage).toBe(`/images/gallery/${space.key}.webp`);
    }
  });

  it('has non-empty header and hours copy', () => {
    expect(SPACES_HEADER.eyebrow.length).toBeGreaterThan(0);
    expect(SPACES_HEADER.title.length).toBeGreaterThan(0);
    expect(SPACES_HEADER.description.length).toBeGreaterThan(0);
    expect(HOURS.title.length).toBeGreaterThan(0);
    expect(HOURS.everydayTime.length).toBeGreaterThan(0);
    expect(HOURS.weekendTime.length).toBeGreaterThan(0);
  });
});
