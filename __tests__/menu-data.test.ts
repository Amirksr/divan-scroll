import {
  MENU_ITEMS,
  getFeaturedItems,
  getItemsByCategory,
  findMenuItemBySlug,
  formatToman,
  MenuItem,
} from '@/lib/menu-data';

function makeItem(overrides: Partial<MenuItem> = {}): MenuItem {
  return {
    id: 'sample-item',
    slug: 'sample',
    labelFa: 'نمونه',
    labelEn: 'Sample',
    descFa: 'توضیح نمونه',
    descEn: 'Sample description',
    price: 100000,
    popular: false,
    vegetarian: false,
    category: 'brunch',
    image: '/images/menu/sample.webp',
    featured: false,
    ...overrides,
  };
}

const sample: MenuItem[] = [
  makeItem({ id: 'a', slug: 'a', labelFa: 'الف', featured: true }),
  makeItem({ id: 'b', slug: 'b', labelFa: 'ب', featured: false, popular: true }),
  makeItem({ id: 'c', slug: 'c', labelFa: 'ج', featured: false }),
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
    expect(grouped.brunch).toEqual(sample);
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

describe('formatToman', () => {
  it('formats a price with Persian digits and the fa suffix by default', () => {
    // Intl.NumberFormat('fa-IR') renders Persian (Extended Arabic-Indic) digits.
    expect(formatToman(310000)).toBe('۳۱۰٬۰۰۰ تومان');
  });

  it('formats a price with Latin digits and the en suffix when locale is en', () => {
    expect(formatToman(310000, 'en')).toBe('310,000 Toman');
  });

  it('handles zero', () => {
    expect(formatToman(0, 'en')).toBe('0 Toman');
  });
});

describe('MENU_ITEMS (real data sanity checks)', () => {
  it('has exactly 86 items, matching the real photos currently in public/images/menu (all 87 real DivanCafe items except "ترکی", which has no localPhoto in DivanCafe\'s own data.ts)', () => {
    expect(MENU_ITEMS).toHaveLength(86);
  });

  it('every item has a unique id and slug', () => {
    const ids = MENU_ITEMS.map((i) => i.id);
    const slugs = MENU_ITEMS.map((i) => i.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every item has a positive Toman price', () => {
    for (const item of MENU_ITEMS) {
      expect(item.price).toBeGreaterThan(0);
    }
  });

  it('has exactly 20 featured items, spanning all 6 categories (raised from 6 for the featured/popular carousel)', () => {
    const featured = getFeaturedItems();
    expect(featured.length).toBe(20);
    const categoriesRepresented = new Set(featured.map((item) => item.category));
    expect(categoriesRepresented.size).toBe(6);
  });
});
