import type Lenis from 'lenis';

/**
 * A plain mutable holder, not a React context, because the only consumers
 * are imperative event handlers (a button's onClick) that need one-off
 * access to call `.scrollTo()` — not a value that drives rendering. Set by
 * SmoothScroll.tsx when it creates/destroys its Lenis instance; read by
 * anything that needs to programmatically scroll (e.g. "jump to category").
 *
 * Never call `window.scrollTo()` directly anywhere in this app once Lenis
 * is active: Lenis tracks its own target/velocity state, and a raw native
 * scrollTo fights it, producing jank or a snap-back. Always go through
 * `lenisInstance.current?.scrollTo(...)` (and fall back to native
 * scrollIntoView/scrollTo only when `lenisInstance.current` is null, e.g.
 * under prefers-reduced-motion where SmoothScroll never creates one).
 */
export const lenisInstance: { current: Lenis | null } = { current: null };
