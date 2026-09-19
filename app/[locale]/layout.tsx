import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Newsreader, Vazirmatn, Inter, JetBrains_Mono } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { CartProvider } from '@/components/CartContext';
import { themeInitScript } from '@/lib/theme';
import { getMessages, isLocale, localeDirection, locales, type Locale } from '@/lib/i18n';

// DivanCafe itself loads these via a <link> to fonts.googleapis.com rather
// than next/font (see DivanCafe's src/app/[locale]/layout.tsx). We use
// next/font here instead since it self-hosts + subsets automatically,
// which is strictly better for a Vercel-deployed Next.js app — same font
// families, safer loading strategy. Unaffected by locale.
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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Without this, the page had NO <meta name="viewport"> tag at all --
 * Next.js's Metadata API only emits one if a `viewport` export tells it
 * to, and this layout never had one. A mobile browser with no viewport
 * tag falls back to laying the page out at its own desktop-simulation
 * width (historically ~980px, and confirmed live in headless Chromium's
 * mobile emulation here as well) and then zooming the whole thing out to
 * fit the physical screen, rather than rendering at the device's actual
 * CSS pixel width. Every `vw`-based measurement in this app (.h-card's
 * width, .h-viewport's side padding, and so on) and every JS scroll
 * calculation that reads window.innerWidth or getBoundingClientRect()
 * (FullMenuScroll's whole click-to-jump math) would then be computed
 * against that wrong, wide layout viewport instead of the real one --
 * which is a far more fundamental explanation for "this only breaks on
 * an actual phone" than anything in the scroll logic itself, and was
 * never ruled out until this was found missing.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const dict = getMessages(params.locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      languages: { fa: '/fa', en: '/en' },
    },
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getMessages(locale);
  const dir = localeDirection[locale];

  return (
    <html lang={locale} dir={dir}>
      <head>
        {/* Applies the saved/preferred theme before hydration, so the page
            never flashes dark-then-light (or vice versa) on load. Ported
            from DivanCafe's themeInitScript (src/lib/theme.ts). */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${newsreader.variable} ${vazirmatn.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      >
        <a href="#main" className="skip-link focus-ring">
          {locale === 'fa' ? 'رفتن به محتوای اصلی' : 'Skip to content'}
        </a>
        <SmoothScroll />
        <CartProvider>
          <Header locale={locale} dict={dict} />
          <main id="main">{children}</main>
          <Footer locale={locale} dict={dict} />
        </CartProvider>
      </body>
    </html>
  );
}
