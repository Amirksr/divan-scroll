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
  it('matches the real per-category counts now that 5 of 6 categories have local photos', () => {
    expect(getCategoryItemCount('brunch')).toBe(20);
    expect(getCategoryItemCount('cold')).toBe(11);
    expect(getCategoryItemCount('tea')).toBe(9);
    expect(getCategoryItemCount('pastry')).toBe(12);
    expect(getCategoryItemCount('breakfast')).toBe(3);
    for (const slug of ['brunch', 'cold', 'tea', 'pastry', 'breakfast'] as const) {
      expect(hasCategoryContent(slug)).toBe(true);
    }
  });

  it('coffee still has 0 items (no local photography for it yet)', () => {
    expect(getCategoryItemCount('coffee')).toBe(0);
    expect(hasCategoryContent('coffee')).toBe(false);
  });
});

describe('getOrderedAvailableCategories', () => {
  it('returns the 5 populated categories, not coffee', () => {
    const available = getOrderedAvailableCategories();
    expect(available).toHaveLength(5);
    expect(available.map((c) => c.slug)).not.toContain('coffee');
  });

  it('preserves CATEGORY_META order among available categories', () => {
    const metaOrder = CATEGORY_META.map((c) => c.slug);
    const available = getOrderedAvailableCategories().map((c) => c.slug);
    const filteredMetaOrder = metaOrder.filter((slug) => available.includes(slug));
    expect(available).toEqual(filteredMetaOrder);
  });
});
