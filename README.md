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

## Accessibility / responsive review (this pass)

Fixed:
- **Broken scroll on touch devices**: `ScrollEdgeArrows` was originally clickable `<button>`s with `pointer-events: auto` sitting right at the edges of the scrollable card track. A touch swipe starting on/near one of those buttons got captured by the button instead of scrolling the track. Rewritten as fully decorative, non-interactive `<span>`s with `aria-hidden="true"` and zero pointer-events — they can never intercept input again.
- **Incorrect ARIA on the /menu category tabs**: they used `role="tablist"`/`role="tab"`/`aria-selected` despite having no keyboard navigation, no roving tabindex, and no `aria-controls`-linked panel — a screen reader user would hear "tab, 1 of 6" and expect interactive tab behavior that isn't there. Changed to a plain list with `aria-current` on the active item, which is the correct attribute for "current item in a set" without implying interactivity.
- **`aria-disabled` on a non-interactive `<div>`** (Categories' "coming soon" cards) — meaningless outside a widget role; removed. The "به‌زودی" text already communicates it via normal reading order.
- **English `alt` text on a `lang="fa"` page** — menu card images used `item.labelEn`; screen readers would read an English dish name in a Farsi-language context. Switched to `item.labelFa`.
- **No mobile navigation at all**: `.site-nav` is `display:none` below 1024px with no fallback that existed before this pass — `/menu` and `/about` were completely unreachable from the header on any phone or tablet (not just a visual gap — a real accessibility dead-end for keyboard/screen-reader users too, since the only way to reach those routes was scrolling all the way to the footer). Added a minimal accessible mobile nav: a toggle button (`aria-expanded`, `aria-controls`, dynamic `aria-label`) opening a dropdown panel, closes on Escape (returning focus to the toggle) or an outside click, focuses the first link on open.

Known, intentionally not fixed in this pass:
- The mobile nav panel doesn't trap focus (Tab can move past it into page content). For a lightweight disclosure panel (not a modal dialog) this is arguably the *correct* ARIA pattern, not a gap — modal dialogs should trap focus, simple dropdowns generally shouldn't.
- Category cards dimmed to `opacity: 0.45` for the "coming soon" state may not meet strict WCAG contrast ratios on their own — treated the same as a native disabled form control (commonly exempt), not remediated further here.

## Universal pinned scroll + fluid sizing (this pass)

Per direct feedback, removed the directional scroll-arrow indicators
entirely (they'd already caused one touch-scroll regression — see git
history) and reworked how the horizontal card tracks size themselves:

- **Pinned scroll-to-scrub now applies at every viewport width**, not
  just desktop (`min-width: 901px`) — the `gsap.matchMedia()` gate and
  the now-unused `PINNED_SCROLL_BREAKPOINT`/`shouldUsePinnedScroll`
  were removed from `lib/scroll-utils.ts`. Native scroll-snap is only
  used for `prefers-reduced-motion` now, not as a mobile fallback.
  **Known risk, flagged honestly**: pinning + a translating track on
  mobile can interact awkwardly with the browser chrome (address bar)
  resizing the viewport mid-scroll on some devices — Lenis and
  `anticipatePin`/`invalidateOnRefresh` mitigate this, but it's worth
  verifying on a few real phones, not just DevTools device emulation.
- **Card sizing replaced with a single fluid `clamp()` rule**
  (`flex: 0 0 clamp(11.5rem, 26vw, 18.75rem)`) instead of the
  patchwork of fixed breakpoint-specific widths (300px desktop / 220px
  "landscape tablet" / 72vw mobile) that kept needing new special
  cases patched in reactively. Card label/price/category font sizes
  also switched to `clamp()`.
- **Same fluid approach applied to the other sizes that jumped at a
  single breakpoint** instead of scaling smoothly: Hero's title-fa/
  title-en/title-stack height, About's title/paragraph, Categories'
  icon size and title, the /menu page's h1, and FeaturedMenu's h2 —
  audited every `@media` block in globals.css for hard font-size jumps
  and converted the ones that had them.

## Real photography for 5 of 6 categories (this pass)

35 new real dish/drink photos added, matched by name against DivanCafe's
full `src/lib/data.ts` (all 87 items, not just the brunch subset used
before) rather than assumed:

- **cold** (11 items), **tea** (9 items), **breakfast** (3 of 3 — fully
  covered), **pastry** (12 items) now have real local photography,
  joining **brunch** (20 items, unchanged). Only **coffee** (11 items)
  still has none.
- Every filename was cross-referenced against all 87 real item names
  (not just assumed from the filename) to get the exact real `id`,
  price, and bilingual name/description — and to catch cross-category
  name collisions (e.g. "آیس آمریکانو" matches both the hot `americano`
  *and* the real `iced-americano` id; picked the one matching what the
  photo actually shows).
- `lib/menu-data.ts`'s `MenuCategory` type widened from `'brunch'` to
  `'brunch' | 'cold' | 'tea' | 'breakfast' | 'pastry'` (still excluding
  `'coffee'`, matching what actually has data now).
- Removed `CATEGORY_LABELS` from `lib/menu-data.ts` — it was a second,
  drifted set of category display names duplicating
  `lib/categories-data.ts`'s `CATEGORY_META` (which already had the
  real names for all 6 categories, including the ones without photos
  yet, for the "coming soon" UI). `FeaturedMenu.tsx` switched to
  `CATEGORY_META`, matching what `FullMenuScroll.tsx` already did.
- **This is the first time the /menu page's category-tab highlighting
  has real multiple categories to switch between** — it was only
  possible to unit-test the picking logic in isolation before (see
  `lib/category-scroll-utils.ts`'s tests), not observe it actually
  switching live. Worth specifically checking on the deployed site:
  scrolling through tea -> breakfast -> pastry -> cold -> brunch (that's
  `CATEGORY_META`'s real order) should visibly move the highlighted tab
  along with the cards.

68/68 tests passing, tsc clean.

## All 6 categories now have real photography (this pass)

Per feedback, went back and checked DivanCafe's real repo for every
item *not* covered by the 35 uploaded photos, rather than assuming
those categories were done:

- Extracted every remaining item's `localPhoto` path from DivanCafe's
  `src/lib/data.ts` and checked (via HTTP, not assumption) whether a
  real file actually exists at that path in the live repo — 31 of 32
  remaining items did (only "ترکی" / Turkish coffee has no
  `localPhoto` defined in DivanCafe's own data at all).
- Downloaded and verified all 31 (real photos, 480x480, 10-77KB each —
  not placeholder gradients) and added them with their real
  name/price/description, same as every other item so far.
- **Coffee now has real photos too** (10 of 11 items) — this was
  previously the one category with zero local photography.
- `MenuCategory` widened one more time to include `'coffee'`.
- **All 6 real categories are now fully wired**: every category card
  on the homepage is clickable, every tab on `/menu` is active (none
  show "coming soon" anymore).

**Known UX consideration, not fixed here — worth deciding on
purpose**: the `/menu` page's horizontal track now holds 86 items
(previously 20), meaning the pinned scroll distance is roughly 4x
longer than before. This wasn't an explicit ask in this pass, so it's
left as-is, but it's worth checking how it actually feels to scroll
through on the deployed site — it may be worth splitting into
per-category pinned sections, adding a "jump to category" shortcut
beyond the tab highlight, or some other pacing change once you've felt
it live.

67/67 tests passing, tsc clean.
