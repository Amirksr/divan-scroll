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
  it('brunch has exactly 20 items (the only category with local photos)', () => {
    expect(getCategoryItemCount('brunch')).toBe(20);
    expect(hasCategoryContent('brunch')).toBe(true);
  });

  it('categories without local photography currently have 0 items', () => {
    for (const slug of ['coffee', 'tea', 'breakfast', 'pastry', 'cold'] as const) {
      expect(getCategoryItemCount(slug)).toBe(0);
      expect(hasCategoryContent(slug)).toBe(false);
    }
  });
});

describe('getOrderedAvailableCategories', () => {
  it('currently returns only brunch', () => {
    const available = getOrderedAvailableCategories();
    expect(available).toHaveLength(1);
    expect(available[0].slug).toBe('brunch');
  });

  it('preserves CATEGORY_META order among available categories', () => {
    // Sanity check that this doesn't just return an arbitrary order —
    // once more categories get photos, this test's premise (single result)
    // will need updating, which is intentional: it documents the current
    // data limitation rather than silently tolerating it forever.
    const metaOrder = CATEGORY_META.map((c) => c.slug);
    const available = getOrderedAvailableCategories().map((c) => c.slug);
    const filteredMetaOrder = metaOrder.filter((slug) => available.includes(slug));
    expect(available).toEqual(filteredMetaOrder);
  });
});
