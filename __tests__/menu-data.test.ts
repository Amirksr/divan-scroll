import {
  MENU_ITEMS,
  getFeaturedItems,
  getItemsByCategory,
  findMenuItemBySlug,
  MenuItem,
} from '@/lib/menu-data';

const sample: MenuItem[] = [
  { id: 'a', slug: 'a', labelFa: 'الف', labelEn: 'A', category: 'khoresh', image: '/a.webp', featured: true },
  { id: 'b', slug: 'b', labelFa: 'ب', labelEn: 'B', category: 'ash', image: '/b.webp', featured: false },
  { id: 'c', slug: 'c', labelFa: 'ج', labelEn: 'C', category: 'khoresh', image: '/c.webp', featured: false },
];

describe('getFeaturedItems', () => {
  it('returns only items with featured: true', () => {
    expect(getFeaturedItems(sample)).toEqual([sample[0]]);
  });

  it('defaults to MENU_ITEMS when no argument is passed', () => {
    expect(getFeaturedItems()).toEqual(MENU_ITEMS.filter((i) => i.featured));
  });

  it('returns an empty array when nothing is featured', () => {
    const noneFeatured = sample.map((i) => ({ ...i, featured: false }));
    expect(getFeaturedItems(noneFeatured)).toEqual([]);
  });
});

describe('getItemsByCategory', () => {
  it('groups items under their category key', () => {
    const grouped = getItemsByCategory(sample);
    expect(grouped.khoresh).toEqual([sample[0], sample[2]]);
    expect(grouped.ash).toEqual([sample[1]]);
  });

  it('does not create keys for categories with no items', () => {
    const grouped = getItemsByCategory(sample);
    expect(grouped.sobhane).toBeUndefined();
    expect(grouped.vije).toBeUndefined();
  });

  it('returns an empty object for an empty input array', () => {
    expect(getItemsByCategory([])).toEqual({});
  });
});

describe('findMenuItemBySlug', () => {
  it('finds an item by exact slug match', () => {
    expect(findMenuItemBySlug('b', sample)).toEqual(sample[1]);
  });

  it('returns undefined for an unknown slug', () => {
    expect(findMenuItemBySlug('does-not-exist', sample)).toBeUndefined();
  });

  it('is case-sensitive (documents current behavior)', () => {
    expect(findMenuItemBySlug('B', sample)).toBeUndefined();
  });
});
