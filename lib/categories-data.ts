import { MENU_ITEMS } from './menu-data';

export type CategorySlug = 'coffee' | 'tea' | 'breakfast' | 'pastry' | 'cold' | 'brunch';

export interface CategoryMeta {
  slug: CategorySlug;
  name: string;
  unit: string;
}

/** Sourced from DivanCafe's messages/fa.json -> categories. */
export const CATEGORIES_EYEBROW = 'دفتر دیوان';
export const CATEGORIES_TITLE = 'دسته‌بندی منو';
export const CATEGORIES_DESC =
  'از اسپرسوهای تک‌خاستگاه تا صبحانه‌ی کامل ایرانی؛ هرچه می‌خواهید، جایی در این دفتر دارد.';

export const CATEGORY_META: CategoryMeta[] = [
  { slug: 'coffee', name: 'قهوه و اسپرسو', unit: 'نوشیدنی' },
  { slug: 'tea', name: 'دمنوش و چای', unit: 'نوشیدنی' },
  { slug: 'breakfast', name: 'صبحانه', unit: 'مورد' },
  { slug: 'pastry', name: 'شیرینی و دسر', unit: 'مورد' },
  { slug: 'cold', name: 'نوشیدنی سرد', unit: 'نوشیدنی' },
  { slug: 'brunch', name: 'غذای اصلی', unit: 'مورد' },
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
