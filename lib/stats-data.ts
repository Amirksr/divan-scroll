export interface StatItem {
  key: 'cups' | 'beans' | 'rating' | 'years';
  value: number;
  suffix: string;
  decimals: number;
  labelFa: string;
}

/** Sourced from DivanCafe's src/lib/data.ts `stats` + messages/fa.json `stats`. */
export const STATS_TITLE_FA = 'دیوان به عدد';

export const STATS: StatItem[] = [
  { key: 'cups', value: 120000, suffix: '+', decimals: 0, labelFa: 'فنجان قهوه در سال' },
  { key: 'beans', value: 3, suffix: '', decimals: 0, labelFa: 'کشور مبدأ دانه' },
  { key: 'rating', value: 4.9, suffix: '', decimals: 1, labelFa: 'امتیاز مشتریان' },
  { key: 'years', value: 4, suffix: '+', decimals: 0, labelFa: 'سال تجربه' },
];

/**
 * Formats an in-progress count-up value the way DivanCafe's real CountUp
 * component does: fixed decimal places, Persian digit grouping, and the
 * stat's suffix appended. `current` is expected to already be eased/
 * interpolated by the caller (e.g. via a GSAP tween's onUpdate) — this
 * function only handles formatting, not the animation curve itself.
 */
export function formatStatValue(current: number, decimals: number, suffix: string): string {
  const rounded = Number(current.toFixed(decimals));
  const formatted = new Intl.NumberFormat('fa-IR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(rounded);
  return `${formatted}${suffix}`;
}
