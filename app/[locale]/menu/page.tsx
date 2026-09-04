import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FullMenuScroll from '@/components/FullMenuScroll';
import { getMessages, isLocale, translate, type Locale } from '@/lib/i18n';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const dict = getMessages(params.locale);
  return { title: `${dict.menu_page.title} — Divan`, description: dict.menu_page.description };
}

export default function MenuPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getMessages(locale);
  const t = (key: string) => translate(dict, key);

  return (
    <>
      <div className="menu-page-intro">
        <p className="eyebrow-static">{t('menu_page.eyebrow')}</p>
        <h1>{t('menu_page.title')}</h1>
        <p>{t('menu_page.description')}</p>
      </div>
      <FullMenuScroll locale={locale} dict={dict} />
    </>
  );
}
