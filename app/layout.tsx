import type { Metadata } from 'next';
import { Newsreader, Vazirmatn, Inter } from 'next/font/google';
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

export const metadata: Metadata = {
  title: 'Divan — Cinematic Scroll Case Study',
  description: 'A bilingual, scroll-driven case study prototype for DivanCafe.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${newsreader.variable} ${vazirmatn.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
