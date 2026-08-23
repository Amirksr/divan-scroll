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
- **Now a multi-page app**: `/` (homepage) and `/menu` (full menu with category tabs). This is the first real Next.js routing in this repo — everything before this was a single page.
- **Hero background is real**: DivanCafe's actual `/gallery-photos/exterior.webp` (the café's exterior), ported here as `public/images/hero/exterior.webp`. Subtitle copy ("هر فنجان، یک بیت از دفتر روزانه‌ی ماست") is DivanCafe's real hero subtitle from `messages/fa.json`.
- **Categories section is real**: DivanCafe's actual 6 category names/units from `messages/fa.json` → `categories`. Only "برانچ" (the 20 Persian dishes) is clickable/populated; the other 5 show a "به‌زودی" badge and aren't links, since they don't have local photography yet.
- **Homepage menu section is now "Featured menu" (6 items) + a button to the full menu**, matching DivanCafe's real homepage structure (`/menu-scroll` on the homepage → CTA → `/menu`), instead of showing all 20 items on the homepage.
- **`/menu` page**: sticky category tabs above the same horizontal pinned-scroll technique, now showing all available items grouped by category. Tabs highlight via `IntersectionObserver` + a tested `pickActiveCategory()` (in `lib/category-scroll-utils.ts`) as you scroll into each category's group — currently only "برانچ" has content, so only one tab will ever highlight; the mechanism itself works for N categories, it just has nothing to switch between yet.
- **Section order now follows the real DivanCafe homepage**: Header → Hero → Stats → About/story → Categories → Featured menu → Footer. (Real DivanCafe's full order also includes a gallery and a "فضای دیوان" card grid linking to sub-pages — not yet built here.)
- **Not yet ported from DivanCafe:** cart, Quick View modal, light/dark theme toggle, language switcher, i18n routing, the team section, the photo gallery, the "فضای دیوان" space cards, and the other 67 menu items (coffee/tea/pastry/cold/breakfast) — until those have local photos, their category tabs on `/menu` stay disabled and their category cards on the homepage stay non-clickable.
- **Smooth scroll via Lenis** now drives the whole site (see `components/SmoothScroll.tsx`), fixing a visible jump at the start of Hero's pinned scroll caused by native scroll events not lining up with ScrollTrigger's per-frame math. Skipped under `prefers-reduced-motion`. Known follow-up: anchor-link clicks (`<a href="#...">`) now jump instantly instead of smoothly, since CSS `scroll-behavior: smooth` was removed (it would double up with Lenis) and Lenis isn't wired to intercept anchor clicks yet.
- **Landscape/breakpoint fixes (640-768px range)**: Hero's subline and description now crossfade (reusing AboutStory's tested `getParagraphOpacity`) instead of stacking, since the title alone claims most of the vertical space at this width; the decorative gold line above them is hidden here too. Featured/full menu cards get a smaller size override in this range (the existing 72vw mobile card size assumed a tall/narrow portrait screen, producing an oversized ~553x737px card here). Below 640px specifically, the /menu page's floating tab bar switches from a full pill shape with side margins to corners-only rounding + a tiny internal horizontal scroll, so 6 category pills never wrap to 2 lines and obscure the cards underneath.
- **Native horizontal scrollbars replaced with directional arrow indicators** (`components/ScrollEdgeArrows.tsx` + tested `lib/scroll-edge-utils.ts`) on every native-scroll card track (mobile/reduced-motion fallback) and the /menu tab bar's own mini-scroll: only "forward" shows at the very start, only "backward" at the end, both in the middle.
- **About/story content moved to its own `/about` page** (was a homepage section) — same `AboutStory` component, just relocated per feedback that it didn't belong on the homepage yet.
- **Category cards have real animated icons**, ported from DivanCafe's `src/components/icons.tsx` + the exact keyframes from `tailwind.config.ts` (steam/sway/wiggle/jiggle/glint), triggered on hover via plain CSS instead of Tailwind's `group-hover:animate-*` utilities.
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
