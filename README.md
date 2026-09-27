# divan-scroll

*Cinematic portfolio prototype*

**[English](#english) · [فارسی](#فارسی)**

---

## English

A scroll-driven, bilingual café experience built on real Divan Café content — where a full-bleed hero video, a GSAP-choreographed menu, and locale-aware layout all answer to the scrollbar.

| | |
|---|---|
| **Stack** | Next.js 14 · TypeScript · GSAP |
| **Languages** | Persian (default) · English |
| **Tests** | 43 suites, Jest + ts-jest |
| **Deploy** | Vercel |

### Overview

divan-scroll is a private case-study build sitting alongside the production DivanCafé site — same design tokens, same photography, same menu data — rebuilt as a scroll-native experience. Every section of the site is a scene: the hero scrubs a looping interior shot as you scroll past it, the full menu pins itself and tracks category tabs to horizontal scroll position, and the whole layout mirrors itself correctly under both English (LTR) and Persian (RTL) without ever feeling like a translated afterthought.

The project doubles as a running log of real front-end debugging: viewport meta tags, GSAP ScrollTrigger cache invalidation, video keyframe intervals, and RTL flex-direction gotchas have all been found and fixed here — and the fixes are covered by tests, not just patched and forgotten.

### Key features

- **Scroll-scrubbed hero video** — The hero background is an 8-second interior clip whose playback position is driven directly by scroll progress via a pinned GSAP timeline, with a muted, faststart-remuxed, densely keyframed MP4 so seeking stays smooth on every frame. Reduced-motion visitors get the original static photograph instead, and iOS Safari gets a silent play/pause priming step so the first scrub actually renders.
- **Full bilingual routing** — Every route lives under `app/[locale]/`, resolved by middleware, with a shared dictionary in `lib/i18n.ts` and per-language message files. Switching languages swaps not just text but writing direction, font stack, and mirrored layout — cart panels, badges, and flex rows all use logical `inset-inline` properties instead of hardcoded left/right.
- **Scroll-driven full menu with category deep-linking** — The menu track pins to the viewport and scrubs horizontally with scroll, while category tabs jump to a precise scroll target derived directly from the live ScrollTrigger boundaries — never a stale cached distance — so jumps land correctly at both ends of the track, including from a URL hash deep link.
- **Cart that survives a language switch** — Because `<html>` renders inside `app/[locale]/layout.tsx`, changing locale remounts the entire layout tree. Cart state is mirrored into `sessionStorage` and restored on a hydration-safe effect, so items don't vanish when a visitor flips from Persian to English mid-order.
- **Visual variety engine** — `lib/visual-groups.ts` and `lib/menu-data.ts` algorithmically re-order menu and featured-strip items so visually similar photos (same plating, same cup, same overhead angle) never sit next to each other — without ever moving an item out of its own category.
- **Theming, navigation & contact** — Dark/light theme toggle, an off-canvas mobile drawer ported from the production DivanCafé site, a real About page with a team section, and a Contact page with a working reservation form and a live Google Maps embed.

### Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 14 · App Router |
| Language | TypeScript |
| Animation | GSAP + ScrollTrigger |
| Smooth scroll | Lenis |
| Styling | Plain CSS custom properties |
| Testing | Jest + ts-jest |

### Getting started

1. **Clone the repository**
   ```
   git clone https://github.com/Amirksr/divan-scroll.git
   ```
2. **Install dependencies**
   ```
   npm install
   ```
3. **Run the dev server**
   ```
   npm run dev
   ```
   Visit `http://localhost:3000` (redirects to `/fa`).
4. **Run the test suite**
   ```
   npm test
   ```
   or `npm run test:watch` while iterating.

### Project structure

```
app/[locale]/            # localized routes: home, menu, about, contact
app/[locale]/layout.tsx  # <html> lives here — remounts on locale switch
middleware.ts            # resolves and enforces the active locale
lib/
  i18n.ts                 # dictionary + translate() helper
  video-scrub.ts          # hero scroll-to-video-time sync
  scroll-utils.ts         # ScrollTrigger-safe distance/target helpers
  category-scroll-utils.ts
  cart-storage.ts         # sessionStorage mirror for cart state
  menu-data.ts, visual-groups.ts, featured-order.ts
  theme.ts, map-embed.ts
components/
  Hero.tsx, FullMenuScroll.tsx, MobileNav.tsx
  LanguageSwitcher.tsx, ThemeToggle.tsx
  CartButton.tsx, MenuItemModal.tsx, ContactForm.tsx
messages/               fa.json, en.json
public/videos/          divan-interior-hero.mp4
__tests__/              # 43 suites covering the above
```

### An architecture note worth knowing

> The root `<html>` tag is rendered inside `app/[locale]/layout.tsx`, not the top-level layout — required so the correct `lang`/`dir` attributes apply on first paint. The side effect: any React state that lives in that tree is destroyed whenever the locale segment changes.
>
> Cart persistence, scroll-position restoration, and a few other fixes in this repo all trace back to that single fact. If a future bug looks like "X resets when I change language," this is the first place to check.

### Testing philosophy

Every fix in this repo lands with a regression test, and several of the trickiest scroll bugs were only confirmed fixed by driving a real headless Chromium session (Playwright) through the live interaction — not by reasoning from source alone. Where a bug turned out to be layout- or timing-specific to a real device, that's noted directly in commit history rather than papered over.

### Status

| Area | State |
|---|---|
| Bilingual routing (fa/en) | **Shipped**, applied and verified |
| Hero scroll video | **Shipped** — faststart + dense keyframes |
| Cart persistence across locale switch | **Shipped** |
| Menu category deep-linking | **Shipped** |
| Mobile viewport correctness | **Shipped** — missing meta tag fixed |
| Real-device Safari/WebKit scroll edge case | Open — pending device re-test |

*divan-scroll · private case-study prototype · deployed via Vercel*

---

## فارسی

یک تجربهٔ کافه‌ای دوزبانه و مبتنی بر اسکرول، ساخته‌شده روی محتوای واقعی کافه دیوان — جایی که ویدیوی تمام‌صفحهٔ هیرو، منوی طراحی‌شده با GSAP، و چیدمان حساس به زبان، همگی به اسکرول‌بار پاسخ می‌دهند.

| | |
|---|---|
| **فناوری** | نکست‌جی‌اس ۱۴ · تایپ‌اسکریپت · GSAP |
| **زبان‌ها** | فارسی (پیش‌فرض) · انگلیسی |
| **تست** | ۴۳ سوییت، Jest + ts-jest |
| **استقرار** | Vercel |

### معرفی

divan-scroll یک نسخهٔ خصوصی و مطالعه‌موردی است که در کنار سایت تولیدی کافه دیوان ساخته شده — با همان توکن‌های طراحی، همان عکاسی، همان داده‌های منو — اما این‌بار به‌صورت یک تجربهٔ کاملاً مبتنی بر اسکرول بازسازی شده است. هر بخش از سایت یک صحنه است: هیرو با اسکرول‌کردن، یک نمای داخلی حلقه‌ای را جلو و عقب می‌برد، منوی کامل با اسکرول پین می‌شود و تب دسته‌بندی‌ها را متناسب با موقعیت افقی اسکرول دنبال می‌کند، و کل چیدمان، هم در انگلیسی (چپ‌به‌راست) و هم در فارسی (راست‌به‌چپ) درست بازتاب پیدا می‌کند، بدون این‌که حس یک ترجمهٔ بعداً اضافه‌شده را بدهد.

این پروژه هم‌زمان یک گزارش زنده از دیباگ واقعی فرانت‌اند است: تگ ویوپورت، نامعتبرشدن کش ScrollTrigger در GSAP، فاصلهٔ کی‌فریم‌های ویدیو، و مشکلات جهت فلکس در حالت راست‌به‌چپ، همگی در همین پروژه پیدا و رفع شده‌اند — و این رفع‌اشکال‌ها با تست پوشش داده شده‌اند، نه فقط یک پچ فراموش‌شده.

### ویژگی‌های کلیدی

- **ویدیوی هیرو هماهنگ با اسکرول** — پس‌زمینهٔ هیرو یک کلیپ ۸ ثانیه‌ای از داخل کافه است که موقعیت پخش آن مستقیماً با پیشرفت اسکرول، از طریق یک تایم‌لاین پین‌شدهٔ GSAP کنترل می‌شود؛ فایل MP4 بی‌صدا با ساختار faststart و کی‌فریم‌های متراکم بازتولید شده تا اسکراب روی هر فریم نرم بماند. برای کاربرانی که حرکت کاهش‌یافته را ترجیح می‌دهند، همان عکس ثابت اصلی نمایش داده می‌شود، و برای سافاری آی‌اواس یک مرحلهٔ پخش/توقف بی‌صدا برای آماده‌سازی اضافه شده تا اولین اسکراب واقعاً رندر شود.
- **مسیریابی کامل دوزبانه** — هر مسیر زیر `app/[locale]/` قرار دارد و توسط میان‌افزار (middleware) تشخیص داده می‌شود، با یک دیکشنری مشترک در `lib/i18n.ts` و فایل‌های پیام جداگانه برای هر زبان. تغییر زبان فقط متن را عوض نمی‌کند، بلکه جهت نوشتار، مجموعه فونت، و آینه‌شدن چیدمان را هم تغییر می‌دهد — پنل سبد خرید، نشان‌ها، و ردیف‌های فلکس همه از خاصیت‌های منطقی مثل `inset-inline` استفاده می‌کنند، نه چپ/راست ثابت.
- **منوی کامل مبتنی بر اسکرول با لینک مستقیم به هر دسته** — مسیر منو به ویوپورت پین می‌شود و با اسکرول به‌صورت افقی جابه‌جا می‌شود، در حالی که تب‌های دسته‌بندی مستقیماً از مرزهای زندهٔ ScrollTrigger — نه یک فاصلهٔ کش‌شدهٔ قدیمی — به هدف دقیق اسکرول می‌پرند؛ به همین دلیل پرش‌ها در هر دو انتهای مسیر، حتی از طریق لینک مستقیم هش در آدرس، درست می‌نشینند.
- **سبد خریدی که با تغییر زبان از بین نمی‌رود** — از آن‌جا که `<html>` داخل `app/[locale]/layout.tsx` رندر می‌شود، تغییر زبان کل درخت لایوت را دوباره مانت می‌کند. وضعیت سبد خرید در `sessionStorage` ذخیره و در یک افکت امن نسبت به هیدریشن بازیابی می‌شود، بنابراین وقتی کاربر وسط سفارش از فارسی به انگلیسی برود، آیتم‌ها ناپدید نمی‌شوند.
- **موتور تنوع بصری** — `lib/visual-groups.ts` و `lib/menu-data.ts` به‌صورت الگوریتمی ترتیب آیتم‌های منو و نوار ویژه را طوری تغییر می‌دهند که عکس‌های بصری مشابه (همان چیدمان، همان فنجان، همان زاویهٔ بالا) کنار هم قرار نگیرند — بدون این‌که هیچ آیتمی از دسته‌بندی خودش خارج شود.
- **تم، ناوبری و تماس** — دکمهٔ تغییر تم تیره/روشن، یک منوی کشویی موبایل خارج از صفحه که از سایت تولیدی کافه دیوان منتقل شده، یک صفحهٔ دربارهٔ ما واقعی با بخش تیم، و یک صفحهٔ تماس با فرم رزرو کارآمد و نقشهٔ گوگل زنده.

### فناوری‌های استفاده‌شده

| بخش | انتخاب |
|---|---|
| فریم‌ورک | نکست‌جی‌اس ۱۴ · App Router |
| زبان برنامه‌نویسی | تایپ‌اسکریپت |
| انیمیشن | GSAP + ScrollTrigger |
| اسکرول نرم | Lenis |
| استایل‌دهی | CSS خالص با متغیرهای سفارشی |
| تست | Jest + ts-jest |

### شروع کار

۱. **ریپازیتوری را کلون کنید**
   ```
   git clone https://github.com/Amirksr/divan-scroll.git
   ```
۲. **وابستگی‌ها را نصب کنید**
   ```
   npm install
   ```
۳. **سرور توسعه را اجرا کنید**
   ```
   npm run dev
   ```
   سپس به `http://localhost:3000` بروید (به‌صورت خودکار به `/fa` هدایت می‌شود).
۴. **مجموعه تست‌ها را اجرا کنید**
   ```
   npm test
   ```
   یا هنگام توسعه از `npm run test:watch` استفاده کنید.

### ساختار پروژه

```
app/[locale]/            # مسیرهای بومی‌سازی‌شده: خانه، منو، درباره، تماس
app/[locale]/layout.tsx  # <html> اینجاست — با تغییر زبان دوباره مانت می‌شود
middleware.ts            # زبان فعال را تشخیص و اعمال می‌کند
lib/
  i18n.ts                 # دیکشنری + تابع کمکی translate()
  video-scrub.ts          # هماهنگی اسکرول با زمان ویدیو در هیرو
  scroll-utils.ts         # توابع کمکی امن برای فاصله/هدف در ScrollTrigger
  category-scroll-utils.ts
  cart-storage.ts         # نگهداری وضعیت سبد خرید در sessionStorage
  menu-data.ts, visual-groups.ts, featured-order.ts
  theme.ts, map-embed.ts
components/
  Hero.tsx, FullMenuScroll.tsx, MobileNav.tsx
  LanguageSwitcher.tsx, ThemeToggle.tsx
  CartButton.tsx, MenuItemModal.tsx, ContactForm.tsx
messages/               fa.json, en.json
public/videos/          divan-interior-hero.mp4
__tests__/              # ۴۳ سوییت پوشش‌دهندهٔ موارد بالا
```

### یک نکتهٔ معماری که ارزش دانستن دارد

> تگ اصلی `<html>` داخل `app/[locale]/layout.tsx` رندر می‌شود، نه در لایوت سطح بالا — این کار لازم است تا ویژگی‌های درست `lang` و `dir` در همان اولین رندر اعمال شوند. اثر جانبی این تصمیم این است که هر state ری‌اکتی که داخل آن درخت زندگی می‌کند، با هر بار تغییر بخش locale از بین می‌رود.
>
> ماندگاری سبد خرید، بازیابی موقعیت اسکرول، و چند رفع‌اشکال دیگر در این ریپو، همگی ریشه در همین یک واقعیت دارند. اگر در آینده باگی شبیه «با تغییر زبان X ریست می‌شود» دیده شد، اول همین‌جا را بررسی کنید.

### فلسفهٔ تست‌نویسی

هر رفع‌اشکال در این ریپو همراه با یک تست رگرسیون ثبت می‌شود، و برخی از پیچیده‌ترین باگ‌های اسکرول فقط با اجرای واقعی یک نشست headless Chromium (با Playwright) روی تعامل زنده تأیید شدند — نه صرفاً با استدلال از روی کد. جایی که یک باگ به چیدمان یا زمان‌بندی یک دستگاه واقعی مرتبط بوده، این موضوع مستقیماً در تاریخچهٔ کامیت‌ها ثبت شده، نه پنهان.

### وضعیت

| بخش | وضعیت |
|---|---|
| مسیریابی دوزبانه (فارسی/انگلیسی) | **انجام‌شده**، اعمال و تأیید شده |
| ویدیوی اسکرول هیرو | **انجام‌شده** — faststart و کی‌فریم متراکم |
| ماندگاری سبد خرید هنگام تغییر زبان | **انجام‌شده** |
| لینک مستقیم به دسته‌بندی منو | **انجام‌شده** |
| درستی ویوپورت موبایل | **انجام‌شده** — تگ متا گم‌شده رفع شد |
| مورد خاص اسکرول در سافاری/وب‌کیت روی دستگاه واقعی | باز — در انتظار تست مجدد روی دستگاه |

*divan-scroll · پروتوتایپ خصوصی مطالعه‌موردی · مستقر‌شده روی Vercel*
