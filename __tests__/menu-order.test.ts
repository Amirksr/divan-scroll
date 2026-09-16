import { getMenuItemsInDisplayOrder, MENU_ITEMS, type MenuItem } from '@/lib/menu-data';
import { getOrderedAvailableCategories } from '@/lib/categories-data';
import { getVisualGroup } from '@/lib/visual-groups';

function adjacentClashes(list: MenuItem[]): number {
  let n = 0;
  for (let i = 1; i < list.length; i++) {
    const g = getVisualGroup(list[i].id);
    if (g !== undefined && g === getVisualGroup(list[i - 1].id)) n++;
  }
  return n;
}

/**
 * Regression test for the same bug as getFeaturedItemsInDisplayOrder
 * (lib/menu-data.ts), extended to the full menu rather than just the
 * featured strip. Several categories have a majority of their items
 * sharing one photo template -- every khoresh in "brunch", most of
 * "pastry", most of "tea", most of "cold" -- so this doesn't assert zero
 * clashes site-wide (that would be mathematically impossible when a
 * group is more than half its category), only that the full menu is
 * strictly better than the raw, unordered data, and that ordering never
 * violates the category-slot constraint.
 */
describe('getMenuItemsInDisplayOrder', () => {
  const categories = getOrderedAvailableCategories();
  const raw = categories.flatMap((cat) => MENU_ITEMS.filter((item) => item.category === cat.slug));
  const ordered = getMenuItemsInDisplayOrder(categories);

  it('is the same set of items as the raw category flattening', () => {
    expect(ordered).toHaveLength(raw.length);
    expect(ordered.map((i) => i.id).sort()).toEqual(raw.map((i) => i.id).sort());
  });

  it('keeps every item inside its own category\u2019s span of the track', () => {
    expect(ordered.map((i) => i.category)).toEqual(raw.map((i) => i.category));
  });

  it('reduces adjacent lookalike pairs compared to the raw menu-data order', () => {
    const before = adjacentClashes(raw);
    const after = adjacentClashes(ordered);
    // The raw data has dozens of such pairs (every khoresh is listed
    // consecutively, as is most of pastry/tea/cold) -- confirm there was
    // something real to fix, and that ordering meaningfully improved on it.
    expect(before).toBeGreaterThan(10);
    expect(after).toBeLessThan(before);
  });

  it('is deterministic', () => {
    const again = getMenuItemsInDisplayOrder(categories);
    expect(again.map((i) => i.id)).toEqual(ordered.map((i) => i.id));
  });

  it('separates every pair in a category where the dominant group is a minority', () => {
    // Categories where no single visual group holds more than half the
    // category's items CAN be fully separated -- assert they actually are,
    // rather than only checking the "can't always succeed" categories.
    const byCategory = new Map<string, MenuItem[]>();
    for (const item of ordered) {
      const list = byCategory.get(item.category) ?? [];
      list.push(item);
      byCategory.set(item.category, list);
    }

    for (const [category, list] of byCategory) {
      const counts = new Map<string, number>();
      for (const item of list) {
        const g = getVisualGroup(item.id);
        if (g) counts.set(g, (counts.get(g) ?? 0) + 1);
      }
      const maxGroupSize = Math.max(0, ...counts.values());
      if (maxGroupSize > list.length / 2) continue; // can't be fully separated -- skip

      const clashes = adjacentClashes(list);
      expect([category, clashes]).toEqual([category, 0]);
    }
  });
});
