export type MenuCategory = 'brunch';  // only category with local photography for now


export interface MenuItem {
  id: string;
  slug: string;
  labelFa: string;
  labelEn: string;
  descFa: string;
  descEn: string;
  /** Toman */
  price: number;
  popular: boolean;
  vegetarian: boolean;
  category: MenuCategory;
  /** Path relative to /public, e.g. "/images/menu/fesenjan.webp" */
  image: string;
  featured: boolean;
}

export const CATEGORY_LABELS: Record<MenuCategory, { fa: string; en: string }> = {
  brunch: { fa: 'سفره‌ی ایرانی', en: 'Persian Table' },
};


/**
 * Sourced directly from DivanCafe's src/lib/data.ts (the "brunch" category —
 * the only category with real, licensed local photography as of this
 * export). Keep this in sync manually if the real menu changes; there's no
 * shared package between the two repos yet.
 */
export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'loobia-polo',
    slug: 'loobia',
    labelFa: 'لوبیا پلو با گوشت',
    labelEn: 'Green Bean Rice with Beef',
    descFa: 'لوبیا سبز، گوجه‌فرنگی، گوشت چرخ‌کرده، زعفران',
    descEn: 'Green beans, tomato, ground beef, saffron',
    price: 310000,
    popular: false,
    vegetarian: false,
    category: 'brunch',
    image: '/images/menu/loobia.webp',
    featured: false,
  },
  {
    id: 'khoresh-havij',
    slug: 'havij',
    labelFa: 'چلو خورشت هویج',
    labelEn: 'Carrot Stew with Rice',
    descFa: 'خورش هویج و گوشت با زعفران و لیمو عمانی',
    descEn: 'Carrot and beef stew, saffron, dried lime',
    price: 300000,
    popular: false,
    vegetarian: false,
    category: 'brunch',
    image: '/images/menu/havij.webp',
    featured: false,
  },
  {
    id: 'khoresh-karafs',
    slug: 'karafs',
    labelFa: 'چلو خورشت کرفس',
    labelEn: 'Celery Stew with Rice',
    descFa: 'کرفس، گوشت، رب گوجه‌فرنگی و زردچوبه',
    descEn: 'Celery, beef, tomato paste, turmeric',
    price: 300000,
    popular: false,
    vegetarian: false,
    category: 'brunch',
    image: '/images/menu/karafs.webp',
    featured: false,
  },
  {
    id: 'ferni',
    slug: 'farni',
    labelFa: 'فرنی',
    labelEn: 'Ferni (Rice Pudding)',
    descFa: 'شیر، برنج، گلاب، دارچین و پسته خلالی',
    descEn: 'Milk, rice, rosewater, cinnamon, slivered pistachio',
    price: 95000,
    popular: false,
    vegetarian: true,
    category: 'brunch',
    image: '/images/menu/farni.webp',
    featured: true,
  },
  {
    id: 'khoresh-lapeh',
    slug: 'lape',
    labelFa: 'چلو خورشت لپه',
    labelEn: 'Split Pea Stew with Rice',
    descFa: 'لپه، گوشت، پیاز و دارچین',
    descEn: 'Split peas, beef, onion, cinnamon',
    price: 295000,
    popular: false,
    vegetarian: false,
    category: 'brunch',
    image: '/images/menu/lape.webp',
    featured: false,
  },
  {
    id: 'khoresh-aloo-esfenaj',
    slug: 'aloo_esfenaj',
    labelFa: 'چلو خورشت آلو اسفناج',
    labelEn: 'Prune & Spinach Stew with Rice',
    descFa: 'اسفناج، آلو، گوشت و لیموترش',
    descEn: 'Spinach, prunes, beef, sour lime',
    price: 305000,
    popular: false,
    vegetarian: false,
    category: 'brunch',
    image: '/images/menu/aloo_esfenaj.webp',
    featured: false,
  },
  {
    id: 'omlet-sabzijat',
    slug: 'sabzijat',
    labelFa: 'املت سبزیجات',
    labelEn: 'Vegetable Omelet',
    descFa: 'تخم‌مرغ، سبزی تازه و کمی فلفل سیاه',
    descEn: 'Eggs, fresh herbs, black pepper',
    price: 175000,
    popular: false,
    vegetarian: true,
    category: 'brunch',
    image: '/images/menu/sabzijat.webp',
    featured: false,
  },
  {
    id: 'khoresh-khalal-badam',
    slug: 'khalal',
    labelFa: 'چلو خورشت خلال بادام',
    labelEn: 'Almond Sliver Stew with Rice',
    descFa: 'گوشت، خلال بادام و زعفران',
    descEn: 'Beef, slivered almonds, saffron',
    price: 330000,
    popular: false,
    vegetarian: false,
    category: 'brunch',
    image: '/images/menu/khalal.webp',
    featured: false,
  },
  {
    id: 'kashk-bademjan',
    slug: 'kashk',
    labelFa: 'کشک بادمجان',
    labelEn: 'Kashk-e Bademjan',
    descFa: 'بادمجان سرخ‌شده، کشک، پیازداغ و نعناع داغ',
    descEn: 'Fried eggplant, kashk, fried onion and mint',
    price: 185000,
    popular: false,
    vegetarian: true,
    category: 'brunch',
    image: '/images/menu/kashk.webp',
    featured: false,
  },
  {
    id: 'komaj',
    slug: 'komaj',
    labelFa: 'کماج',
    labelEn: 'Komaj Bread',
    descFa: 'نان سنتی جنوبی با خرما، هل و دارچین',
    descEn: 'Traditional southern bread with date, cardamom, cinnamon',
    price: 65000,
    popular: false,
    vegetarian: true,
    category: 'brunch',
    image: '/images/menu/komaj.webp',
    featured: true,
  },
  {
    id: 'ash-shole-ghalamkar',
    slug: 'shole',
    labelFa: 'آش شله‌قلمکار',
    labelEn: 'Ash-e Sholeh Qalamkar',
    descFa: 'لپه، برنج، سبزی معطر و کوفته ریز',
    descEn: 'Split peas, rice, fresh herbs, tiny meatballs',
    price: 165000,
    popular: false,
    vegetarian: false,
    category: 'brunch',
    image: '/images/menu/shole.webp',
    featured: false,
  },
  {
    id: 'ash-reshteh',
    slug: 'ashreshteh',
    labelFa: 'آش رشته',
    labelEn: 'Ash Reshteh',
    descFa: 'رشته، حبوبات، سبزی آش، کشک و نعناع داغ',
    descEn: 'Noodles, legumes, herbs, kashk, fried mint',
    price: 155000,
    popular: false,
    vegetarian: true,
    category: 'brunch',
    image: '/images/menu/ashreshteh.webp',
    featured: true,
  },
  {
    id: 'ash-jo',
    slug: 'jo',
    labelFa: 'آش جو',
    labelEn: 'Barley Soup',
    descFa: 'جو پرک، مرغ، هویج و نعناع داغ',
    descEn: 'Pearl barley, chicken, carrot, fried mint',
    price: 145000,
    popular: false,
    vegetarian: false,
    category: 'brunch',
    image: '/images/menu/jo.webp',
    featured: false,
  },
  {
    id: 'khoresh-gheimeh',
    slug: 'gheimeh',
    labelFa: 'چلو خورشت قیمه',
    labelEn: 'Gheimeh Stew with Rice',
    descFa: 'لپه، گوشت، سیب‌زمینی سرخ‌کرده و لیمو عمانی',
    descEn: 'Split peas, beef, crispy potato, dried lime',
    price: 300000,
    popular: true,
    vegetarian: false,
    category: 'brunch',
    image: '/images/menu/gheimeh.webp',
    featured: false,
  },
  {
    id: 'omlet-gharch',
    slug: 'gharch',
    labelFa: 'املت قارچ',
    labelEn: 'Mushroom Omelet',
    descFa: 'تخم‌مرغ، قارچ تازه و پیاز قرمز',
    descEn: 'Eggs, fresh mushroom, red onion',
    price: 180000,
    popular: false,
    vegetarian: true,
    category: 'brunch',
    image: '/images/menu/gharch.webp',
    featured: false,
  },
  {
    id: 'khoresh-fesenjan',
    slug: 'fesenjan',
    labelFa: 'چلو خورشت فسنجان',
    labelEn: 'Fesenjan Stew with Rice',
    descFa: 'مرغ، رب انار، گردو و زعفران',
    descEn: 'Chicken, pomegranate molasses, walnuts, saffron',
    price: 340000,
    popular: true,
    vegetarian: false,
    category: 'brunch',
    image: '/images/menu/fesenjan.webp',
    featured: true,
  },
  {
    id: 'kalam-polo-shirazi',
    slug: 'kalampolo',
    labelFa: 'کلم پلو شیرازی',
    labelEn: 'Shirazi Cabbage Rice',
    descFa: 'برنج، کلم سفید، سبزی معطر و آلو',
    descEn: 'Rice, white cabbage, fresh herbs, dried plum',
    price: 285000,
    popular: false,
    vegetarian: true,
    category: 'brunch',
    image: '/images/menu/kalampolo.webp',
    featured: true,
  },
  {
    id: 'khoresh-aloo',
    slug: 'aloo',
    labelFa: 'چلو خورشت آلو',
    labelEn: 'Prune Stew with Rice',
    descFa: 'گوشت، آلو، خلال بادام و زعفران',
    descEn: 'Beef, prunes, slivered almonds, saffron',
    price: 315000,
    popular: false,
    vegetarian: false,
    category: 'brunch',
    image: '/images/menu/aloo.webp',
    featured: false,
  },
  {
    id: 'khoresh-ghormeh-sabzi',
    slug: 'ghormeh',
    labelFa: 'چلو خورشت قورمه سبزی',
    labelEn: 'Ghormeh Sabzi Stew with Rice',
    descFa: 'سبزی قورمه، لوبیا قرمز، گوشت و لیمو عمانی',
    descEn: 'Fresh herbs, red beans, beef, dried lime',
    price: 320000,
    popular: true,
    vegetarian: false,
    category: 'brunch',
    image: '/images/menu/ghormeh.webp',
    featured: true,
  },
  {
    id: 'khoresh-bamieh',
    slug: 'bamie',
    labelFa: 'چلو خورشت بامیه',
    labelEn: 'Okra Stew with Rice',
    descFa: 'بامیه، مرغ، گوجه‌فرنگی و زردچوبه',
    descEn: 'Okra, chicken, tomato, turmeric',
    price: 300000,
    popular: false,
    vegetarian: false,
    category: 'brunch',
    image: '/images/menu/bamie.webp',
    featured: false,
  },
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

/** Formats a Toman price the way DivanCafe's own ledger/ticket UI does. */
export function formatToman(price: number, locale: 'fa' | 'en' = 'fa'): string {
  const formatted = new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US').format(price);
  return locale === 'fa' ? `${formatted} تومان` : `${formatted} Toman`;
}
