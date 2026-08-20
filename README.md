# divan-scroll

A cinematic, scroll-driven case-study prototype built for DivanCafe — kept as its own repo so experimentation here never risks the production DivanCafe codebase.

**Stack:** Next.js 14 (App Router) · TypeScript · GSAP + ScrollTrigger · Jest + Testing Library

## What's in here

- **`components/Hero.tsx`** — pinned hero section with a scroll-scrubbed bilingual title morph (`دیوان` → `DIVAN`), a canvas smoke effect, and full `prefers-reduced-motion` support.
- **`components/MenuScroll.tsx`** — a horizontal, pinned "full menu" scroll section on desktop that degrades to native swipeable scroll-snap on mobile and under reduced motion.
- **`components/SmokeCanvas.tsx`** — isolated canvas particle effect, self-contained and reusable.
- **`lib/scroll-utils.ts`** / **`lib/menu-data.ts`** — pure, framework-free logic (scroll math, menu data helpers), unit tested.
- **`hooks/useReducedMotion.ts`** — reactive `prefers-reduced-motion` hook, resolved before paint to avoid a full-motion flash.

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
npm test          # run the Jest suite
```

## Notes on the current state

- **Menu data is real**, pulled directly from DivanCafe's `src/lib/data.ts` — the 20 "brunch" (Persian home-cooking) items, the only category with local photography as of this export. Prices, Farsi/English names and descriptions all match the live DivanCafe menu. The other 67 items (coffee/tea/pastry/cold/breakfast) aren't ported yet since they don't have matching local photos.
- **Design tokens are real**, ported from DivanCafe's `tailwind.config.ts` + `src/app/globals.css`: `charcoal`/`bone`/`copper`/`gold`/`sage`, dark theme only (DivanCafe also has a light theme + a `.light` class toggle — not implemented here yet). Font is Newsreader (display) + Vazirmatn (Farsi) + Inter (body), matching DivanCafe's actual font stack — loaded via `next/font/google` instead of DivanCafe's `<link>` tag approach, since next/font self-hosts and subsets automatically.
- **Section order now follows the real DivanCafe homepage**: Header → Hero → Stats → About/story → Menu → Footer. (Real DivanCafe's full order also includes a category-card grid within "دفتر دیوان", a gallery, and a "فضای دیوان" card grid linking to sub-pages — not yet built here, see below.)
- **Stats section is real**, sourced from DivanCafe's `src/lib/data.ts` (`stats` array) + `messages/fa.json` (`stats` labels): 120,000+ cups/year, 3 origin countries, 4.9 rating, 4+ years. Count-up animation triggers via `ScrollTrigger.batch` (same fix pattern as the values cards below) so all 4 numbers animate in sequence, not simultaneously.
- **About/story section is real**, sourced from DivanCafe's `messages/fa.json` → `about_page` (the actual 3-paragraph story, values, real founding year). English fields are kept in `lib/story-data.ts` for a future bilingual toggle but not rendered yet.
- **Not yet ported from DivanCafe:** cart, Quick View modal, light/dark theme toggle, language switcher, i18n routing, the team section (`about_page.team`), the "دفتر دیوان" category-card grid, the photo gallery, the "فضای دیوان" space cards, and the other 67 menu items.
- **Known limitation:** the menu-scroll section's mobile fallback uses native horizontal scroll-snap, which hasn't been verified under `dir="rtl"` (the whole document is RTL now that Header/Footer have real Persian content). Worth a manual check on a real RTL mobile browser before this goes further.
- This repo is intentionally private while it's still a prototype. It'll go public once there's a full case-study narrative to go with it (see the linked case study section in `app/page.tsx`).

---

## نسخه‌ی فارسی

یه پروتوتایپ سینماتیک و اسکرول‌محور که برای دیوان‌کافه ساخته شده — توی یه ریپوی جدا نگه داشته شده تا آزمایش‌کردن روش، پروژه‌ی اصلی دیوان‌کافه رو به خطر نندازه.

**استک:** Next.js 14 (App Router) · TypeScript · GSAP + ScrollTrigger · Jest + Testing Library

### توی این ریپو چی هست

- **`components/Hero.tsx`** — بخش هیروی پین‌شده با مورف عنوان دوزبانه هم‌زمان با اسکرول («دیوان» → «DIVAN»)، افکت دود روی کانواس، و پشتیبانی کامل از `prefers-reduced-motion`
- **`components/MenuScroll.tsx`** — بخش «منوی کامل» با اسکرول افقی پین‌شده روی دسکتاپ که روی موبایل و حالت reduced-motion به اسکرول افقی لمسی معمولی تبدیل می‌شه
- **`lib/scroll-utils.ts`** و **`lib/menu-data.ts`** — منطق خالص و مستقل از فریم‌ورک، با تست یونیت
- **`hooks/useReducedMotion.ts`** — هوک واکنش‌گرا برای تنظیمات reduced-motion

### شروع کار

```bash
npm install
npm run dev
npm test
```

نکته: دیتای منو فعلاً یه نمونه‌ی ۶تایی‌ست؛ قبل از استفاده‌ی واقعی باید به دیتای کامل منوی دیوان‌کافه وصل بشه.
