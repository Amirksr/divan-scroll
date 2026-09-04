import { MENU_ITEMS } from './menu-data';

export type CategorySlug = 'coffee' | 'tea' | 'breakfast' | 'pastry' | 'cold' | 'brunch';

export interface CategoryMeta {
  slug: CategorySlug;
  name: string;
  nameEn: string;
  unit: string;
  unitEn: string;
}

/** Sourced from DivanCafe's messages/{fa,en}.json -> categories. */
export const CATEGORIES_EYEBROW = 'دفتر دیوان';
export const CATEGORIES_EYEBROW_EN = 'The Ledger';
export const CATEGORIES_TITLE = 'دسته‌بندی منو';
export const CATEGORIES_TITLE_EN = 'Browse the menu';
export const CATEGORIES_DESC =
  'از اسپرسوهای تک‌خاستگاه تا صبحانه‌ی کامل ایرانی؛ هرچه می‌خواهید، جایی در این دفتر دارد.';
export const CATEGORIES_DESC_EN =
  'From single-origin espresso to a full Persian breakfast — everything has its page in this ledger.';

export const CATEGORY_META: CategoryMeta[] = [
  { slug: 'coffee', name: 'قهوه و اسپرسو', nameEn: 'Coffee & Espresso', unit: 'نوشیدنی', unitEn: 'drinks' },
  { slug: 'tea', name: 'دمنوش و چای', nameEn: 'Tea & Infusions', unit: 'نوشیدنی', unitEn: 'drinks' },
  { slug: 'breakfast', name: 'صبحانه', nameEn: 'Breakfast', unit: 'مورد', unitEn: 'dishes' },
  { slug: 'pastry', name: 'شیرینی و دسر', nameEn: 'Pastry & Dessert', unit: 'مورد', unitEn: 'items' },
  { slug: 'cold', name: 'نوشیدنی سرد', nameEn: 'Cold Drinks', unit: 'نوشیدنی', unitEn: 'drinks' },
  { slug: 'brunch', name: 'غذای اصلی', nameEn: 'Mains', unit: 'مورد', unitEn: 'dishes' },
];

/**
 * How many local-photo items divan-scroll actually has per category. Real
 * DivanCafe has 87 items across all 6; this repo only has photography for
 * the 20 "brunch" items, so the other 5 categories are structurally
 * present (real names, real ordering) but show as "coming soon" until
 * their photos are added.
 */
export function getCategoryItemCount(slug: CategorySlug): number {
  return MENU_ITEMS.filter((item) => item.category === slug).length;
}

export function hasCategoryContent(slug: CategorySlug): boolean {
  return getCategoryItemCount(slug) > 0;
}

/** CATEGORY_META filtered to only categories that currently have local
 * photography, preserving CATEGORY_META's real display order. Used to
 * drive both the /menu page's tab bar and its horizontal item track. */
export function getOrderedAvailableCategories(): CategoryMeta[] {
  return CATEGORY_META.filter((cat) => hasCategoryContent(cat.slug));
}
