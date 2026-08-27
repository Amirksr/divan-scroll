import type { Metadata } from 'next';
import AboutStory from '@/components/AboutStory';

export const metadata: Metadata = {
  title: 'درباره دیوان — Divan',
  description: 'قصه‌ی دیوان: از یک خانه‌ی قدیمی تا یک دفتر روزانه.',
};

export default function AboutPage() {
  return <AboutStory />;
}
