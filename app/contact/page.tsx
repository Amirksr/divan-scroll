import type { Metadata } from 'next';
import ContactSection from '@/components/ContactSection';

export const metadata: Metadata = {
  title: 'ارتباط با دیوان — Divan',
  description: 'رزرو میز، رویدادهای خصوصی یا فقط یک سلام — با دیوان در تماس باشید.',
};

export default function ContactPage() {
  return <ContactSection />;
}
