import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Categories from '@/components/Categories';
import FeaturedMenu from '@/components/FeaturedMenu';
import Gallery from '@/components/Gallery';
import AmbianceSpaces from '@/components/AmbianceSpaces';
import { getMessages, isLocale, type Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export default function Home({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getMessages(locale);

  return (
    <>
      <Hero dict={dict} />
      <Stats locale={locale} dict={dict} />
      <Categories locale={locale} dict={dict} />
      <FeaturedMenu locale={locale} dict={dict} />
      <Gallery locale={locale} dict={dict} />
      <AmbianceSpaces locale={locale} dict={dict} />
    </>
  );
}
