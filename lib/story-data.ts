export interface StoryValue {
  title: string;
  desc: string;
}

/**
 * Sourced from DivanCafe's messages/fa.json → about_page. English fields
 * kept alongside for a future bilingual toggle, but only the Farsi content
 * is rendered right now — consistent with Header/Footer, which are also
 * Farsi-only until real i18n routing exists (see README).
 */
export const STORY = {
  eyebrowFa: 'قصه‌ی دیوان',
  eyebrowEn: 'The Divan story',
  titleFa: 'از یک خانه‌ی قدیمی تا یک دفتر روزانه',
  titleEn: 'From an old house to a daily ledger',
  paragraphsFa: [
    'دیوان در سال ۱۴۰۱ در یکی از خانه‌های قدیمی اصفهان متولد شد. ایده‌ی اولیه ساده بود: قهوه‌ای در سطح جهانی، اما در فضایی که بوی خانه می‌دهد.',
    'نام «دیوان» از دفترهای شعر کهن فارسی گرفته شده؛ مجموعه‌ای از لحظات کوچک که کنار هم دفتری می‌سازند. هر منو، هر فنجان و هر میز، بخشی از همین دفتر است.',
    'دانه‌های ما را از سه منطقه‌ی مختلف — اتیوپی، کلمبیا و برزیل — انتخاب می‌کنیم و به‌صورت هفتگی در رست‌خانه‌ی شیشه‌ای خودمان برشته می‌کنیم.',
  ],
  valuesTitleFa: 'آنچه به آن پایبندیم',
  values: [
    { title: 'کیفیت بدون سازش', desc: 'دانه‌های تازه، شیر محلی و مواد اولیه‌ی روزانه.' },
    { title: 'صنعتگری آهسته', desc: 'هر نوشیدنی با دست و با دقت آماده می‌شود.' },
    { title: 'دورهمی', desc: 'شب‌های شعرخوانی و میزبانی هنرمندان محلی.' },
  ] satisfies StoryValue[],
};
