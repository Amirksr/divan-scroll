import type { Metadata } from 'next';
import FullMenuScroll from '@/components/FullMenuScroll';

export const metadata: Metadata = {
  title: 'منوی دیوان — Divan',
  description: 'همه‌ی نوشیدنی‌ها و غذاهای دیوان، دسته به دسته.',
};

export default function MenuPage() {
  return (
    <>
      <div className="menu-page-intro">
        <p className="eyebrow-static">دفتر کامل</p>
        <h1>منوی دیوان</h1>
        <p>همه‌ی نوشیدنی‌ها و غذاهای دیوان، دسته به دسته، مثل ابیات یک غزل بلند.</p>
      </div>
      <FullMenuScroll />
    </>
  );
}
