import { buildMapEmbedUrl } from '../lib/map-embed';

describe('buildMapEmbedUrl', () => {
  it('builds a no-API-key Google Maps embed URL', () => {
    expect(buildMapEmbedUrl('Sheikh Lotfollah Mosque, Isfahan')).toBe(
      'https://www.google.com/maps?q=Sheikh%20Lotfollah%20Mosque%2C%20Isfahan&output=embed'
    );
  });

  it('URL-encodes special characters and non-Latin scripts', () => {
    const url = buildMapEmbedUrl('میدان نقش جهان, اصفهان');
    expect(url.startsWith('https://www.google.com/maps?q=')).toBe(true);
    expect(url.endsWith('&output=embed')).toBe(true);
    expect(decodeURIComponent(url)).toContain('میدان نقش جهان');
  });

  it('trims surrounding whitespace before encoding', () => {
    expect(buildMapEmbedUrl('  Isfahan  ')).toBe('https://www.google.com/maps?q=Isfahan&output=embed');
  });

  it('throws on an empty query', () => {
    expect(() => buildMapEmbedUrl('')).toThrow(RangeError);
    expect(() => buildMapEmbedUrl('   ')).toThrow(RangeError);
  });
});
