/**
 * Reorders a card list so that items sharing a visual group don't sit next
 * to each other -- while keeping every item inside the set of positions
 * its own category already occupied.
 *
 * The constraint is the point. The featured strip's category order is
 * editorial and shouldn't be rewritten just to fix photography clashes, so
 * this only ever permutes items *within* the slots their category already
 * held. If brunch occupies slots 0-6 and 17-19, brunch items stay in those
 * ten slots and no other category's position shifts at all.
 *
 * Within those slots it's the standard "reorganize so equal items aren't
 * adjacent" greedy: repeatedly place an item from the group with the most
 * remaining members, skipping the group just placed. That maximises the
 * spacing between same-group items, and when a group is too large to fully
 * separate (more than half the slots) it still spreads it as thinly as the
 * slot count allows rather than failing.
 *
 * Stable for anything with no group: ungrouped items keep their relative
 * order, so the result stays deterministic and diff-friendly.
 */
export function spaceOutSimilarWithinCategory<T>(
  items: readonly T[],
  getCategory: (item: T) => string,
  getGroup: (item: T) => string | undefined
): T[] {
  // Slots each category occupies, in order.
  const slotsByCategory = new Map<string, number[]>();
  items.forEach((item, index) => {
    const category = getCategory(item);
    const slots = slotsByCategory.get(category);
    if (slots) slots.push(index);
    else slotsByCategory.set(category, [index]);
  });

  const result = items.slice();

  for (const [category, slots] of slotsByCategory) {
    const members = slots.map((slot) => items[slot]);
    const ordered = spreadByGroup(members, getGroup);
    slots.forEach((slot, i) => {
      result[slot] = ordered[i];
    });
  }

  return result;
}

/**
 * Orders one category's items so same-group items are as far apart as the
 * list length allows. Each ungrouped item is treated as its own singleton
 * group, so ungrouped items are never considered "the same" as each other.
 */
function spreadByGroup<T>(items: readonly T[], getGroup: (item: T) => string | undefined): T[] {
  // Bucket by group, preserving each bucket's incoming order.
  const buckets = new Map<string, T[]>();
  items.forEach((item, index) => {
    const key = getGroup(item) ?? `\u0000unique-${index}`;
    const bucket = buckets.get(key);
    if (bucket) bucket.push(item);
    else buckets.set(key, [item]);
  });

  // Insertion order of `buckets` follows the original item order, so ties
  // in remaining-count below resolve to whichever group appeared first --
  // that's what keeps the whole function deterministic.
  const out: T[] = [];
  let previousKey: string | null = null;

  while (out.length < items.length) {
    let chosenKey: string | null = null;
    let chosenCount = 0;

    for (const [key, bucket] of buckets) {
      if (bucket.length === 0 || key === previousKey) continue;
      if (bucket.length > chosenCount) {
        chosenKey = key;
        chosenCount = bucket.length;
      }
    }

    // Only reachable when every remaining item belongs to the group just
    // placed -- i.e. that group is more than half the list and cannot be
    // fully separated. Emptying it out here is the best available spread.
    if (chosenKey === null) {
      for (const [, bucket] of buckets) {
        while (bucket.length > 0) out.push(bucket.shift()!);
      }
      break;
    }

    out.push(buckets.get(chosenKey)!.shift()!);
    previousKey = chosenKey;
  }

  return out;
}
