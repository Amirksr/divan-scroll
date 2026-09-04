import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, locales } from '@/lib/i18n';

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
};

function pickLocale(request: NextRequest): string {
  const header = request.headers.get('accept-language') ?? '';
  const preferred = header.split(',')[0]?.split('-')[0]?.trim().toLowerCase();
  return (locales as readonly string[]).includes(preferred ?? '') ? (preferred as string) : defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];

  if ((locales as readonly string[]).includes(first ?? '')) {
    return NextResponse.next();
  }

  const locale = pickLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}
