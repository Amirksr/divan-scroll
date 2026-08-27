import type { Metadata } from 'next';
import { Newsreader, Vazirmatn, Inter, JetBrains_Mono } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import './globals.css';

// DivanCafe itself loads these via a <link> to fonts.googleapis.com rather
// than next/font (see src/app/[locale]/layout.tsx). We use next/font here
// instead since it self-hosts + subsets automatically, which is strictly
// better for a Vercel-deployed Next.js app — same font families, safer
// loading strategy.
const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
});

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  weight: ['400', '600', '800'],
  variable: '--font-vazirmatn',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Divan — Cinematic Scroll Case Study',
  description: 'A bilingual, scroll-driven case study prototype for DivanCafe.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${newsreader.variable} ${vazirmatn.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      >
        <a href="#main" className="skip-link focus-ring">
          رفتن به محتوای اصلی
        </a>
        <SmoothScroll />
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
