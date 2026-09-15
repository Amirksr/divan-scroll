import type { CartState } from './cart-logic';

export const CART_STORAGE_KEY = 'divan.cart.v1';

/**
 * Narrows arbitrary parsed JSON to a valid CartState.
 *
 * Anything stored can come back stale or malformed -- a cart saved before
 * a menu edit, a hand-edited storage value, or a half-written entry -- so
 * every line is checked rather than trusted. `validIds` is the current
 * menu's id set: lines referencing an item that no longer exists are
 * dropped here, so the rest of the app never has to render a cart line it
 * can't look up. Quantities must be positive integers, matching the
 * invariant cartReducer already maintains.
 *
 * Returns [] for anything unusable, which is also the correct empty-cart
 * state -- there's no error to surface to the reader for a cart that
 * simply couldn't be restored.
 */
export function parseStoredCart(raw: unknown, validIds: ReadonlySet<string>): CartState {
  if (!Array.isArray(raw)) return [];

  const seen = new Set<string>();
  const lines: CartState = [];

  for (const entry of raw) {
    if (typeof entry !== 'object' || entry === null) continue;
    const { id, quantity } = entry as { id?: unknown; quantity?: unknown };
    if (typeof id !== 'string' || !validIds.has(id)) continue;
    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity <= 0) continue;
    // A duplicate id would break the reducer's one-line-per-item
    // assumption, so keep the first occurrence only.
    if (seen.has(id)) continue;
    seen.add(id);
    lines.push({ id, quantity });
  }

  return lines;
}

/**
 * Reads and validates the persisted cart. Every storage access is wrapped
 * because `sessionStorage` itself can throw, not just return null --
 * Safari's private mode and some embedded/locked-down browsers raise on
 * access. A cart that can't be restored is not worth breaking the page
 * over, so all failures degrade to an empty cart.
 */
export function readStoredCart(storage: Storage | null, validIds: ReadonlySet<string>): CartState {
  if (!storage) return [];
  try {
    const raw = storage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    return parseStoredCart(JSON.parse(raw), validIds);
  } catch {
    return [];
  }
}

/** Persists the cart, ignoring quota/permission failures for the same reason. */
export function writeStoredCart(storage: Storage | null, cart: CartState): void {
  if (!storage) return;
  try {
    storage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // Storage full or blocked -- the in-memory cart still works for this
    // page view, it just won't survive the next locale switch.
  }
}

/** sessionStorage if it's reachable, else null (SSR, or access throws). */
export function getCartStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.sessionStorage;
  } catch {
    return null;
  }
}
