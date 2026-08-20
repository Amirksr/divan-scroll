import { formatStatValue, STATS } from '@/lib/stats-data';

describe('formatStatValue', () => {
  it('formats a whole number with no decimals and a + suffix', () => {
    expect(formatStatValue(120000, 0, '+')).toBe('۱۲۰٬۰۰۰+');
  });

  it('formats a decimal value with 1 decimal place, no suffix', () => {
    // fa-IR uses the Arabic decimal separator (U+066B, "٫"), not a period.
    expect(formatStatValue(4.9, 1, '')).toBe('۴٫۹');
  });

  it('rounds a mid-animation float to the target decimal count', () => {
    // e.g. partway through a tween from 0 -> 4.9 at t=0.6123...
    expect(formatStatValue(3.00147, 1, '')).toBe('۳٫۰');
  });

  it('handles zero (start of the count-up animation)', () => {
    expect(formatStatValue(0, 0, '+')).toBe('۰+');
  });

  it('pads to the requested decimal count even when the value is a whole number', () => {
    expect(formatStatValue(4, 1, '')).toBe('۴٫۰');
  });
});

describe('STATS (real data sanity checks)', () => {
  it('has exactly 4 stats, matching DivanCafe/src/lib/data.ts', () => {
    expect(STATS).toHaveLength(4);
  });

  it('every stat has a unique key', () => {
    const keys = STATS.map((s) => s.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('every stat has a non-negative value', () => {
    for (const stat of STATS) {
      expect(stat.value).toBeGreaterThanOrEqual(0);
    }
  });
});
