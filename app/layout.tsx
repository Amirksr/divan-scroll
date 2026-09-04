import type { ReactNode } from 'react';
import './globals.css';

/**
 * Thin passthrough, matching DivanCafe's src/app/layout.tsx exactly: the
 * real <html>/<head>/<body> now lives in app/[locale]/layout.tsx, since
 * that's the one that actually knows the locale. Next.js requires a
 * layout.tsx at app/ root, but it doesn't have to render the document
 * shell itself as long as no *other* ancestor layout does either.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
