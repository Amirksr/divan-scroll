import type { MenuItem } from './menu-data';

export interface CartLine {
  id: string;
  quantity: number;
}

export type CartState = CartLine[];

export type CartAction =
  | { type: 'ADD_ITEM'; id: string; quantity?: number }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'SET_QUANTITY'; id: string; quantity: number }
  | { type: 'REPLACE'; cart: CartState }
  | { type: 'CLEAR' };

/**
 * Pure reducer -- no side effects, no DOM. Quantities are always kept a
 * positive integer; SET_QUANTITY (and ADD_ITEM with a negative/zero
 * quantity, though that shouldn't normally happen from the UI) removes the
 * line entirely rather than leaving a zero/negative entry behind, so
 * consumers never have to separately filter the cart before rendering it.
 */
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const amount = action.quantity ?? 1;
      const existing = state.find((line) => line.id === action.id);
      if (!existing) {
        // Adding a non-positive amount for an item not yet in the cart is
        // a no-op, not a negative-quantity line.
        return amount > 0 ? [...state, { id: action.id, quantity: amount }] : state;
      }
      const nextQuantity = existing.quantity + amount;
      if (nextQuantity <= 0) {
        return state.filter((line) => line.id !== action.id);
      }
      return state.map((line) =>
        line.id === action.id ? { ...line, quantity: nextQuantity } : line
      );
    }
    case 'REMOVE_ITEM':
      return state.filter((line) => line.id !== action.id);
    case 'SET_QUANTITY': {
      if (action.quantity <= 0) {
        return state.filter((line) => line.id !== action.id);
      }
      const existing = state.find((line) => line.id === action.id);
      if (!existing) {
        return [...state, { id: action.id, quantity: action.quantity }];
      }
      return state.map((line) =>
        line.id === action.id ? { ...line, quantity: action.quantity } : line
      );
    }
    case 'REPLACE':
      // Wholesale swap, used to restore a persisted cart on mount. The
      // incoming array is assumed already validated (see
      // lib/cart-storage.ts) -- this reducer stays pure and does no
      // filtering of its own, matching how the other cases treat their
      // payloads.
      return action.cart;
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

/** Total number of individual items across all lines (for a header badge). */
export function getCartItemCount(state: CartState): number {
  return state.reduce((sum, line) => sum + line.quantity, 0);
}

/**
 * Total price in Toman. Lines referencing an id no longer present in
 * `menuItems` (e.g. a stale cart from before a menu edit) are silently
 * skipped rather than throwing or counting as 0 * price incorrectly.
 */
export function getCartTotal(state: CartState, menuItems: MenuItem[]): number {
  const priceById = new Map(menuItems.map((item) => [item.id, item.price]));
  return state.reduce((sum, line) => {
    const price = priceById.get(line.id);
    return price === undefined ? sum : sum + price * line.quantity;
  }, 0);
}

/** Convenience lookup for a single line's current quantity (0 if absent). */
export function getLineQuantity(state: CartState, id: string): number {
  return state.find((line) => line.id === id)?.quantity ?? 0;
}
