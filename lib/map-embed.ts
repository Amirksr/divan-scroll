/**
 * Builds a Google Maps "no API key" embed URL
 * (https://www.google.com/maps?q=...&output=embed), used for the
 * decorative-SVG-placeholder replacement on the Contact page. DivanCafe
 * itself doesn't have a real map embed anywhere -- this is a genuinely new
 * addition, not a port -- so it gets the same lib/component split and test
 * coverage as the rest of this project's logic.
 */
export function buildMapEmbedUrl(query: string): string {
  const trimmed = query.trim();
  if (!trimmed) throw new RangeError('buildMapEmbedUrl: query must not be empty');
  return `https://www.google.com/maps?q=${encodeURIComponent(trimmed)}&output=embed`;
}
