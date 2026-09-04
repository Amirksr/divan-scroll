import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AboutStory from '@/components/AboutStory';
import { STORY } from '@/lib/story-data';
import { isLocale, type Locale } from '@/lib/i18n';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const isFa = params.locale === 'fa';
  return {
    title: `${isFa ? 'درباره دیوان' : 'About Divan'} — Divan`,
    description: isFa ? STORY.titleFa : STORY.titleEn,
  };
}

export default function AboutPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  return <AboutStory locale={locale} />;
}
