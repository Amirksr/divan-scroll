export interface StatItem {
  key: 'cups' | 'beans' | 'rating' | 'years';
  value: number;
  suffix: string;
  decimals: number;
  labelFa: string;
  labelEn: string;
}

/** Sourced from DivanCafe's src/lib/data.ts `stats` + messages/{fa,en}.json `stats`. */
export const STATS_TITLE_FA = 'دیوان به عدد';
export const STATS_TITLE_EN = 'Divan, in numbers';

export const STATS: StatItem[] = [
  { key: 'cups', value: 120000, suffix: '+', decimals: 0, labelFa: 'فنجان قهوه در سال', labelEn: 'cups poured a year' },
  { key: 'beans', value: 3, suffix: '', decimals: 0, labelFa: 'کشور مبدأ دانه', labelEn: 'origin countries' },
  { key: 'rating', value: 4.9, suffix: '', decimals: 1, labelFa: 'امتیاز مشتریان', labelEn: 'average rating' },
  { key: 'years', value: 4, suffix: '+', decimals: 0, labelFa: 'سال تجربه', labelEn: 'years of craft' },
];

/**
 * Formats an in-progress count-up value the way DivanCafe's real CountUp
 * component does: fixed decimal places, locale-appropriate digit
 * grouping/numerals, and the stat's suffix appended. `current` is
 * expected to already be eased/interpolated by the caller (e.g. via a
 * GSAP tween's onUpdate) — this function only handles formatting, not the
 * animation curve itself. `locale` defaults to 'fa' (Persian numerals),
 * matching this function's original, pre-i18n behavior exactly.
 */
export function formatStatValue(
  current: number,
  decimals: number,
  suffix: string,
  locale: 'fa' | 'en' = 'fa'
): string {
  const rounded = Number(current.toFixed(decimals));
  const formatted = new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(rounded);
  return `${formatted}${suffix}`;
}
