import { spaceOutSimilarWithinCategory } from '@/lib/featured-order';
import { getFeaturedItems, getFeaturedItemsInDisplayOrder, MENU_ITEMS } from '@/lib/menu-data';
import { getVisualGroup, VISUAL_GROUPS } from '@/lib/visual-groups';

interface Row {
  id: string;
  cat: string;
  group?: string;
}

const order = (rows: Row[]) =>
  spaceOutSimilarWithinCategory(
    rows,
    (r) => r.cat,
    (r) => r.group
  );

function adjacentClashes<T>(list: T[], groupOf: (x: T) => string | undefined): number {
  let n = 0;
  for (let i = 1; i < list.length; i++) {
    const g = groupOf(list[i]);
    if (g !== undefined && g === groupOf(list[i - 1])) n++;
  }
  return n;
}

describe('spaceOutSimilarWithinCategory', () => {
  it('separates same-group items that were adjacent', () => {
    const rows: Row[] = [
      { id: 'a', cat: 'x', group: 'g' },
      { id: 'b', cat: 'x', group: 'g' },
      { id: 'c', cat: 'x' },
      { id: 'd', cat: 'x' },
    ];
    expect(adjacentClashes(order(rows), (r) => r.group)).toBe(0);
  });

  it('never moves an item into another category\u2019s slot', () => {
    const rows: Row[] = [
      { id: 'a', cat: 'x', group: 'g' },
      { id: 'b', cat: 'x', group: 'g' },
      { id: 'c', cat: 'y' },
      { id: 'd', cat: 'x' },
    ];
    expect(order(rows).map((r) => r.cat)).toEqual(['x', 'x', 'y', 'x']);
  });

  it('returns exactly the same items, just reordered', () => {
    const rows: Row[] = [
      { id: 'a', cat: 'x', group: 'g' },
      { id: 'b', cat: 'x', group: 'g' },
      { id: 'c', cat: 'x', group: 'h' },
      { id: 'd', cat: 'x', group: 'h' },
    ];
    expect(
      order(rows)
        .map((r) => r.id)
        .sort()
    ).toEqual(['a', 'b', 'c', 'd']);
  });

  it('leaves an already-good order and a no-group list untouched', () => {
    const rows: Row[] = [
      { id: 'a', cat: 'x' },
      { id: 'b', cat: 'x' },
      { id: 'c', cat: 'x' },
    ];
    expect(order(rows).map((r) => r.id)).toEqual(['a', 'b', 'c']);
  });

  it('does not treat two ungrouped items as a clash with each other', () => {
    const rows: Row[] = [
      { id: 'a', cat: 'x' },
      { id: 'b', cat: 'x' },
    ];
    expect(adjacentClashes(order(rows), (r) => r.group)).toBe(0);
  });

  it('is deterministic across repeated runs', () => {
    const rows: Row[] = [
      { id: 'a', cat: 'x', group: 'g' },
      { id: 'b', cat: 'x', group: 'g' },
      { id: 'c', cat: 'x', group: 'h' },
      { id: 'd', cat: 'x' },
      { id: 'e', cat: 'x', group: 'g' },
    ];
    const first = order(rows).map((r) => r.id);
    expect(order(rows).map((r) => r.id)).toEqual(first);
    expect(order(rows).map((r) => r.id)).toEqual(first);
  });

  it('still emits every item when one group is too large to fully separate', () => {
    // 4 of 5 share a group -- perfect separation is impossible, but
    // nothing may be dropped or duplicated.
    const rows: Row[] = [
      { id: 'a', cat: 'x', group: 'g' },
      { id: 'b', cat: 'x', group: 'g' },
      { id: 'c', cat: 'x', group: 'g' },
      { id: 'd', cat: 'x', group: 'g' },
      { id: 'e', cat: 'x' },
    ];
    const out = order(rows);
    expect(out).toHaveLength(5);
    expect(out.map((r) => r.id).sort()).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('handles an empty list', () => {
    expect(order([])).toEqual([]);
  });
});

describe('getFeaturedItemsInDisplayOrder', () => {
  const before = getFeaturedItems();
  const after = getFeaturedItemsInDisplayOrder();

  it('is the same set of featured items as getFeaturedItems', () => {
    expect(after).toHaveLength(before.length);
    expect(after.map((i) => i.id).sort()).toEqual(before.map((i) => i.id).sort());
  });

  it('keeps the editorial category sequence exactly as it was', () => {
    expect(after.map((i) => i.category)).toEqual(before.map((i) => i.category));
  });

  it('separates every pair in a category where the dominant group is a minority', () => {
    // Not a blanket "zero clashes" assertion: pastry's 3 featured items
    // (baklava, tiramisu, chocolate-lava-cake) are ALL the same visual
    // group (cafe-table-pastry) with nothing else in that category to
    // interleave with, so at least one adjacent pair there is
    // mathematically unavoidable -- see spaceOutSimilarWithinCategory's
    // docs. This checks the categories where separation actually is
    // possible, which is the meaningful invariant to hold as the menu
    // data (and which items are featured) continues to change over time.
    const byCategory = new Map<string, ReturnType<typeof getFeaturedItems>>();
    for (const item of after) {
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

      expect([category, adjacentClashes(list, (i) => getVisualGroup(i.id))]).toEqual([
        category,
        0,
      ]);
    }
  });
});

describe('VISUAL_GROUPS', () => {
  it('only references ids that exist on the menu', () => {
    const ids = new Set(MENU_ITEMS.map((i) => i.id));
    for (const id of Object.keys(VISUAL_GROUPS)) {
      expect(ids.has(id)).toBe(true);
    }
  });

  it('never puts items from different categories in one group', () => {
    // Spacing only permutes within a category, so a group spanning two
    // categories could never actually be separated -- that would be a
    // data mistake, not a layout one.
    const categoryById = new Map(MENU_ITEMS.map((i) => [i.id, i.category]));
    const categoriesByGroup = new Map<string, Set<string>>();
    for (const [id, group] of Object.entries(VISUAL_GROUPS)) {
      const set = categoriesByGroup.get(group) ?? new Set<string>();
      set.add(categoryById.get(id)!);
      categoriesByGroup.set(group, set);
    }
    for (const [group, cats] of categoriesByGroup) {
      expect([group, cats.size]).toEqual([group, 1]);
    }
  });

  it('has no group with only one member (which would do nothing)', () => {
    const counts = new Map<string, number>();
    for (const group of Object.values(VISUAL_GROUPS)) {
      counts.set(group, (counts.get(group) ?? 0) + 1);
    }
    for (const [group, count] of counts) {
      expect([group, count > 1]).toEqual([group, true]);
    }
  });
});
