import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ContactSection from '@/components/ContactSection';
import { getMessages, isLocale, type Locale } from '@/lib/i18n';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const dict = getMessages(params.locale);
  return {
    title: `${dict.nav.contact} — Divan`,
    description: dict.contact_page.description,
  };
}

export default function ContactPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getMessages(locale);
  return <ContactSection locale={locale} dict={dict} />;
}
