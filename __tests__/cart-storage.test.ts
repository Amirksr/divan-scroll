import {
  CART_STORAGE_KEY,
  parseStoredCart,
  readStoredCart,
  writeStoredCart,
} from '@/lib/cart-storage';
import { MENU_ITEMS } from '@/lib/menu-data';

const validIds = new Set(MENU_ITEMS.map((item) => item.id));
const realId = MENU_ITEMS[0].id;
const otherRealId = MENU_ITEMS[1].id;

function memoryStorage(initial?: string): Storage {
  const map = new Map<string, string>();
  if (initial !== undefined) map.set(CART_STORAGE_KEY, initial);
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    clear: () => map.clear(),
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    get length() {
      return map.size;
    },
  } as Storage;
}

function throwingStorage(): Storage {
  return {
    getItem: () => {
      throw new Error('SecurityError');
    },
    setItem: () => {
      throw new Error('QuotaExceededError');
    },
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0,
  } as unknown as Storage;
}

describe('parseStoredCart', () => {
  it('keeps valid lines', () => {
    expect(parseStoredCart([{ id: realId, quantity: 2 }], validIds)).toEqual([
      { id: realId, quantity: 2 },
    ]);
  });

  it('drops lines referencing an item no longer on the menu', () => {
    expect(parseStoredCart([{ id: 'deleted-item', quantity: 2 }], validIds)).toEqual([]);
  });

  it('drops non-positive, non-integer, and non-numeric quantities', () => {
    expect(parseStoredCart([{ id: realId, quantity: 0 }], validIds)).toEqual([]);
    expect(parseStoredCart([{ id: realId, quantity: -3 }], validIds)).toEqual([]);
    expect(parseStoredCart([{ id: realId, quantity: 1.5 }], validIds)).toEqual([]);
    expect(parseStoredCart([{ id: realId, quantity: NaN }], validIds)).toEqual([]);
    expect(parseStoredCart([{ id: realId, quantity: '2' }], validIds)).toEqual([]);
  });

  it('drops malformed entries without discarding the valid ones around them', () => {
    const raw = [null, 'nope', { id: realId, quantity: 1 }, { quantity: 3 }, { id: otherRealId }];
    expect(parseStoredCart(raw, validIds)).toEqual([{ id: realId, quantity: 1 }]);
  });

  it('keeps only the first of a duplicated id', () => {
    const raw = [
      { id: realId, quantity: 1 },
      { id: realId, quantity: 9 },
    ];
    expect(parseStoredCart(raw, validIds)).toEqual([{ id: realId, quantity: 1 }]);
  });

  it('returns [] for non-array input', () => {
    expect(parseStoredCart(null, validIds)).toEqual([]);
    expect(parseStoredCart(undefined, validIds)).toEqual([]);
    expect(parseStoredCart({ id: realId, quantity: 1 }, validIds)).toEqual([]);
    expect(parseStoredCart('[]', validIds)).toEqual([]);
  });
});

describe('readStoredCart', () => {
  it('returns [] when there is no storage (SSR)', () => {
    expect(readStoredCart(null, validIds)).toEqual([]);
  });

  it('returns [] when nothing is stored', () => {
    expect(readStoredCart(memoryStorage(), validIds)).toEqual([]);
  });

  it('returns [] for invalid JSON rather than throwing', () => {
    expect(readStoredCart(memoryStorage('{not json'), validIds)).toEqual([]);
  });

  it('returns [] when storage access throws (private mode / locked-down browser)', () => {
    expect(readStoredCart(throwingStorage(), validIds)).toEqual([]);
  });

  it('reads back a valid stored cart', () => {
    const storage = memoryStorage(JSON.stringify([{ id: realId, quantity: 3 }]));
    expect(readStoredCart(storage, validIds)).toEqual([{ id: realId, quantity: 3 }]);
  });
});

describe('writeStoredCart', () => {
  it('round-trips through readStoredCart', () => {
    const storage = memoryStorage();
    const cart = [
      { id: realId, quantity: 2 },
      { id: otherRealId, quantity: 1 },
    ];
    writeStoredCart(storage, cart);
    expect(readStoredCart(storage, validIds)).toEqual(cart);
  });

  it('persists an emptied cart as empty (does not leave the old one behind)', () => {
    const storage = memoryStorage(JSON.stringify([{ id: realId, quantity: 2 }]));
    writeStoredCart(storage, []);
    expect(readStoredCart(storage, validIds)).toEqual([]);
  });

  it('does not throw when there is no storage or storage rejects the write', () => {
    expect(() => writeStoredCart(null, [{ id: realId, quantity: 1 }])).not.toThrow();
    expect(() => writeStoredCart(throwingStorage(), [{ id: realId, quantity: 1 }])).not.toThrow();
  });
});
