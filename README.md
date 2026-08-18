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

- Sample menu data (`lib/menu-data.ts`) uses 6 real DivanCafe dish photos as a placeholder dataset — swap in the real ~93-item menu before this becomes a real page.
- Design tokens live in `app/globals.css` as plain CSS custom properties, matching DivanCafe's existing ink/parchment/copper/gold system. If DivanCafe's tokens change, update both places or extract them to a shared package.
- Fonts (Fraunces, Vazirmatn, Inter) are loaded via `next/font/google`, so the actual font files are only fetched during `next build`/`next dev` — no font files were downloaded in the environment this scaffold was generated in, so run `npm run build` locally once to confirm the font subsets resolve correctly.
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
