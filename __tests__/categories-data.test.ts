import { CATEGORY_META, getCategoryItemCount, hasCategoryContent, getOrderedAvailableCategories } from '@/lib/categories-data';

describe('CATEGORY_META', () => {
  it('has exactly 6 categories, matching DivanCafe/messages/fa.json', () => {
    expect(CATEGORY_META).toHaveLength(6);
  });

  it('every category has a unique slug', () => {
    const slugs = CATEGORY_META.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('getCategoryItemCount / hasCategoryContent', () => {
  it('matches the real per-category counts -- all 6 categories now have local photos', () => {
    expect(getCategoryItemCount('brunch')).toBe(33);
    expect(getCategoryItemCount('cold')).toBe(11);
    expect(getCategoryItemCount('tea')).toBe(11);
    expect(getCategoryItemCount('pastry')).toBe(18);
    expect(getCategoryItemCount('breakfast')).toBe(3);
    // 10, not the real category's full 11 -- DivanCafe's own data.ts has
    // no localPhoto path defined for "ترکی" (Turkish coffee).
    expect(getCategoryItemCount('coffee')).toBe(10);
    for (const slug of ['brunch', 'cold', 'tea', 'pastry', 'breakfast', 'coffee'] as const) {
      expect(hasCategoryContent(slug)).toBe(true);
    }
  });
});

describe('getOrderedAvailableCategories', () => {
  it('returns all 6 categories now that every one has at least one photo', () => {
    const available = getOrderedAvailableCategories();
    expect(available).toHaveLength(6);
  });

  it('preserves CATEGORY_META order', () => {
    const metaOrder = CATEGORY_META.map((c) => c.slug);
    const available = getOrderedAvailableCategories().map((c) => c.slug);
    expect(available).toEqual(metaOrder);
  });
});
