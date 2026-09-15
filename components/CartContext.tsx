'use client';

import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { cartReducer, getCartItemCount, getCartTotal, getLineQuantity, type CartState } from '@/lib/cart-logic';
import { MENU_ITEMS } from '@/lib/menu-data';
import { getCartStorage, readStoredCart, writeStoredCart } from '@/lib/cart-storage';

interface CartContextValue {
  cart: CartState;
  itemCount: number;
  total: number;
  addItem: (id: string, quantity?: number) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  getQuantity: (id: string) => number;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const MENU_ITEM_IDS: ReadonlySet<string> = new Set(MENU_ITEMS.map((item) => item.id));

/**
 * Cart state lives here and is mirrored into sessionStorage.
 *
 * The persistence is not a "remember my cart forever" feature -- it exists
 * because <html> (and therefore this provider) is rendered inside
 * app/[locale]/layout.tsx, so switching language changes the [locale]
 * route segment and Next.js remounts the whole layout. That wiped the
 * cart every time the reader changed language mid-order. sessionStorage
 * survives that remount (and a reload of the same tab) while still
 * clearing when the tab closes, which keeps it honest for a prototype
 * with no real checkout behind it.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, [] as CartState);
  // Deliberately NOT a lazy useReducer initialiser: the server renders an
  // empty cart, so reading storage during the first client render would
  // produce markup that doesn't match and trip a hydration error. Restore
  // in an effect instead, after hydration has settled.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStoredCart(getCartStorage(), MENU_ITEM_IDS);
    if (stored.length > 0) dispatch({ type: 'REPLACE', cart: stored });
    setHydrated(true);
  }, []);

  useEffect(() => {
    // Gated on `hydrated` so the initial empty state can't overwrite a
    // stored cart before the restore above has had a chance to run.
    // Using state (not a ref) makes that ordering explicit rather than
    // dependent on the order these two effects happen to be declared in.
    if (!hydrated) return;
    writeStoredCart(getCartStorage(), cart);
  }, [cart, hydrated]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      itemCount: getCartItemCount(cart),
      total: getCartTotal(cart, MENU_ITEMS),
      addItem: (id, quantity = 1) => dispatch({ type: 'ADD_ITEM', id, quantity }),
      removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', id }),
      setQuantity: (id, quantity) => dispatch({ type: 'SET_QUANTITY', id, quantity }),
      getQuantity: (id) => getLineQuantity(cart, id),
      clear: () => dispatch({ type: 'CLEAR' }),
    }),
    [cart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider (mounted in app/layout.tsx)');
  }
  return ctx;
}
