import {
  cartReducer,
  getCartItemCount,
  getCartTotal,
  getLineQuantity,
  type CartState,
} from '@/lib/cart-logic';
import type { MenuItem } from '@/lib/menu-data';

function makeMenuItem(overrides: Partial<MenuItem> = {}): MenuItem {
  return {
    id: 'sample',
    slug: 'sample',
    labelFa: 'نمونه',
    labelEn: 'Sample',
    descFa: 'توضیح نمونه',
    descEn: 'Sample description',
    price: 100000,
    popular: false,
    vegetarian: false,
    category: 'brunch',
    image: '/images/menu/sample.webp',
    featured: false,
    ...overrides,
  };
}

describe('cartReducer', () => {
  it('adds a new item with quantity 1 by default', () => {
    const next = cartReducer([], { type: 'ADD_ITEM', id: 'a' });
    expect(next).toEqual([{ id: 'a', quantity: 1 }]);
  });

  it('adds a new item with an explicit quantity', () => {
    const next = cartReducer([], { type: 'ADD_ITEM', id: 'a', quantity: 3 });
    expect(next).toEqual([{ id: 'a', quantity: 3 }]);
  });

  it('increments an existing item rather than duplicating the line', () => {
    const state: CartState = [{ id: 'a', quantity: 2 }];
    const next = cartReducer(state, { type: 'ADD_ITEM', id: 'a' });
    expect(next).toEqual([{ id: 'a', quantity: 3 }]);
  });

  it('leaves other lines untouched when adding to one item', () => {
    const state: CartState = [
      { id: 'a', quantity: 1 },
      { id: 'b', quantity: 5 },
    ];
    const next = cartReducer(state, { type: 'ADD_ITEM', id: 'a' });
    expect(next).toEqual([
      { id: 'a', quantity: 2 },
      { id: 'b', quantity: 5 },
    ]);
  });

  it('does not mutate the original state array (immutability)', () => {
    const state: CartState = [{ id: 'a', quantity: 1 }];
    const frozen = Object.freeze(state.map((l) => Object.freeze({ ...l })));
    expect(() => cartReducer(frozen as CartState, { type: 'ADD_ITEM', id: 'a' })).not.toThrow();
  });

  it('a zero/negative quantity ADD_ITEM for an item not in the cart is a no-op', () => {
    const next = cartReducer([], { type: 'ADD_ITEM', id: 'a', quantity: 0 });
    expect(next).toEqual([]);
    const next2 = cartReducer([], { type: 'ADD_ITEM', id: 'a', quantity: -2 });
    expect(next2).toEqual([]);
  });

  it('ADD_ITEM with a negative amount that brings an existing line to <= 0 removes it', () => {
    const state: CartState = [{ id: 'a', quantity: 2 }];
    const next = cartReducer(state, { type: 'ADD_ITEM', id: 'a', quantity: -5 });
    expect(next).toEqual([]);
  });

  it('REMOVE_ITEM removes the matching line and leaves others alone', () => {
    const state: CartState = [
      { id: 'a', quantity: 1 },
      { id: 'b', quantity: 2 },
    ];
    const next = cartReducer(state, { type: 'REMOVE_ITEM', id: 'a' });
    expect(next).toEqual([{ id: 'b', quantity: 2 }]);
  });

  it('REMOVE_ITEM for an id not present is a no-op', () => {
    const state: CartState = [{ id: 'a', quantity: 1 }];
    const next = cartReducer(state, { type: 'REMOVE_ITEM', id: 'zzz' });
    expect(next).toEqual(state);
  });

  it('SET_QUANTITY updates an existing line to the exact value', () => {
    const state: CartState = [{ id: 'a', quantity: 1 }];
    const next = cartReducer(state, { type: 'SET_QUANTITY', id: 'a', quantity: 9 });
    expect(next).toEqual([{ id: 'a', quantity: 9 }]);
  });

  it('SET_QUANTITY adds the line if it does not exist yet', () => {
    const next = cartReducer([], { type: 'SET_QUANTITY', id: 'a', quantity: 4 });
    expect(next).toEqual([{ id: 'a', quantity: 4 }]);
  });

  it('SET_QUANTITY with 0 removes the line (this is how the qty stepper deletes an item)', () => {
    const state: CartState = [{ id: 'a', quantity: 3 }];
    const next = cartReducer(state, { type: 'SET_QUANTITY', id: 'a', quantity: 0 });
    expect(next).toEqual([]);
  });

  it('SET_QUANTITY with a negative number also removes the line, not a negative quantity', () => {
    const state: CartState = [{ id: 'a', quantity: 3 }];
    const next = cartReducer(state, { type: 'SET_QUANTITY', id: 'a', quantity: -1 });
    expect(next).toEqual([]);
  });

  it('CLEAR empties the cart regardless of prior state', () => {
    const state: CartState = [
      { id: 'a', quantity: 1 },
      { id: 'b', quantity: 2 },
    ];
    expect(cartReducer(state, { type: 'CLEAR' })).toEqual([]);
  });

  it('an unknown action type returns state unchanged', () => {
    const state: CartState = [{ id: 'a', quantity: 1 }];
    // @ts-expect-error -- deliberately testing the default/fallback branch
    const next = cartReducer(state, { type: 'NOT_A_REAL_ACTION' });
    expect(next).toBe(state);
  });
});

describe('getCartItemCount', () => {
  it('is 0 for an empty cart', () => {
    expect(getCartItemCount([])).toBe(0);
  });

  it('sums quantities across all lines', () => {
    expect(
      getCartItemCount([
        { id: 'a', quantity: 2 },
        { id: 'b', quantity: 5 },
      ])
    ).toBe(7);
  });
});

describe('getCartTotal', () => {
  const menuItems = [
    makeMenuItem({ id: 'a', price: 100000 }),
    makeMenuItem({ id: 'b', price: 50000 }),
  ];

  it('is 0 for an empty cart', () => {
    expect(getCartTotal([], menuItems)).toBe(0);
  });

  it('multiplies price by quantity and sums across lines', () => {
    const state: CartState = [
      { id: 'a', quantity: 2 }, // 200000
      { id: 'b', quantity: 3 }, // 150000
    ];
    expect(getCartTotal(state, menuItems)).toBe(350000);
  });

  it('skips a cart line whose id no longer exists in the menu (stale cart)', () => {
    const state: CartState = [
      { id: 'a', quantity: 1 }, // 100000
      { id: 'deleted-item', quantity: 5 }, // ignored
    ];
    expect(getCartTotal(state, menuItems)).toBe(100000);
  });
});

describe('getLineQuantity', () => {
  it('returns 0 for an item not in the cart', () => {
    expect(getLineQuantity([], 'a')).toBe(0);
  });

  it('returns the quantity for an item that is in the cart', () => {
    expect(getLineQuantity([{ id: 'a', quantity: 4 }], 'a')).toBe(4);
  });
});
