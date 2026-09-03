export interface StoryValue {
  title: string;
  desc: string;
}

export interface TeamMember {
  name: string;
  role: string;
}

/**
 * Sourced from DivanCafe's messages/{fa,en}.json -> about_page. Both
 * language fields are now used (see AboutStory.tsx / app/[locale]/about),
 * not just Farsi -- kept as a plain data object rather than moving into
 * messages/*.json since it's structured (values/team arrays), same
 * reasoning as menu-data.ts and stats-data.ts.
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
  paragraphsEn: [
    "Divan opened in 2022 inside one of Isfahan's old houses. The idea was simple: coffee at a world-class level, served in a room that still smells like home.",
    'The name "Divan" comes from classical Persian poetry collections — small moments gathered into a single volume. Every menu, every cup, every table is a page of that volume.',
    'We source beans from three regions — Ethiopia, Colombia, and Brazil — and roast weekly in our own glass-walled roastery.',
  ],
  valuesTitleFa: 'آنچه به آن پایبندیم',
  valuesTitleEn: 'What we hold to',
  values: [
    { title: 'کیفیت بدون سازش', desc: 'دانه‌های تازه، شیر محلی و مواد اولیه‌ی روزانه.' },
    { title: 'صنعتگری آهسته', desc: 'هر نوشیدنی با دست و با دقت آماده می‌شود.' },
    { title: 'دورهمی', desc: 'شب‌های شعرخوانی و میزبانی هنرمندان محلی.' },
  ] satisfies StoryValue[],
  valuesEn: [
    { title: 'No compromise on quality', desc: 'Fresh beans, local dairy, and produce sourced daily.' },
    { title: 'Slow craft', desc: 'Every drink is made by hand, with attention.' },
    { title: 'A gathering place', desc: 'Poetry nights and local artists, hosted regularly.' },
  ] satisfies StoryValue[],
  teamTitleFa: 'چهره‌های دیوان',
  teamTitleEn: 'The people of Divan',
  team: [
    { name: 'سارا احمدی', role: 'سرآشپز قهوه و رست‌مستر' },
    { name: 'امیرحسین رضایی', role: 'سرآشپز آشپزخانه' },
    { name: 'نگار کریمی', role: 'مدیر میهمان‌داری' },
  ] satisfies TeamMember[],
  teamEn: [
    { name: 'Sara Ahmadi', role: 'Head of Coffee & Roastmaster' },
    { name: 'Amirhossein Rezaei', role: 'Executive Chef' },
    { name: 'Negar Karimi', role: 'Guest Experience Lead' },
  ] satisfies TeamMember[],
};
