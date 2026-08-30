'use client';

import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import { cartReducer, getCartItemCount, getCartTotal, getLineQuantity, type CartState } from '@/lib/cart-logic';
import { MENU_ITEMS } from '@/lib/menu-data';

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

/**
 * In-memory only for this prototype -- resets on a full page reload. Real
 * persistence (localStorage, a server cart) is a reasonable next step but
 * wasn't part of this request, and silently persisting a "cart" without a
 * real checkout to act on it would be misleading.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, [] as CartState);

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
