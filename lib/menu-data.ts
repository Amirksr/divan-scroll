export type MenuCategory = 'khoresh' | 'ash' | 'sobhane' | 'vije';

export interface MenuItem {
  id: string;
  slug: string;
  labelFa: string;
  labelEn: string;
  category: MenuCategory;
  /** Path relative to /public, e.g. "/images/menu/fesenjan.webp" */
  image: string;
  /** Show in the hero gallery (small curated set) vs. only in the full menu scroll */
  featured: boolean;
}

export const CATEGORY_LABELS: Record<MenuCategory, { fa: string; en: string }> = {
  khoresh: { fa: 'خورش‌ها', en: 'Stews' },
  ash: { fa: 'آش‌ها', en: 'Soups' },
  sobhane: { fa: 'صبحانه', en: 'Breakfast' },
  vije: { fa: 'ویژه', en: 'Specials' },
};

// Sample subset. Replace with the real 93-item menu dataset (or fetch it
// from wherever DivanCafe already stores it) before shipping.
export const MENU_ITEMS: MenuItem[] = [
  { id: '1', slug: 'fesenjan', labelFa: 'خورشت فسنجان', labelEn: 'Fesenjān Stew', category: 'khoresh', image: '/images/menu/fesenjan.webp', featured: true },
  { id: '2', slug: 'ghormeh', labelFa: 'قورمه سبزی', labelEn: 'Ghormeh Sabzi', category: 'khoresh', image: '/images/menu/ghormeh.webp', featured: true },
  { id: '3', slug: 'ashreshteh', labelFa: 'آش رشته', labelEn: 'Ash Reshteh', category: 'ash', image: '/images/menu/ashreshteh.webp', featured: true },
  { id: '4', slug: 'kalampolo', labelFa: 'کلم پلو شیرازی', labelEn: 'Kalam Polo Shirazi', category: 'khoresh', image: '/images/menu/kalampolo.webp', featured: true },
  { id: '5', slug: 'komaj', labelFa: 'کماج', labelEn: 'Komaj Bread', category: 'sobhane', image: '/images/menu/komaj.webp', featured: true },
  { id: '6', slug: 'farni', labelFa: 'فرنی', labelEn: 'Farni', category: 'sobhane', image: '/images/menu/farni.webp', featured: true },
];

export function getFeaturedItems(items: MenuItem[] = MENU_ITEMS): MenuItem[] {
  return items.filter((item) => item.featured);
}

export function getItemsByCategory(
  items: MenuItem[] = MENU_ITEMS
): Record<MenuCategory, MenuItem[]> {
  const grouped = {} as Record<MenuCategory, MenuItem[]>;
  for (const item of items) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }
  return grouped;
}

export function findMenuItemBySlug(
  slug: string,
  items: MenuItem[] = MENU_ITEMS
): MenuItem | undefined {
  return items.find((item) => item.slug === slug);
}
