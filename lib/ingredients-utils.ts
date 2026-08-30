/**
 * Every MenuItem.descFa in lib/menu-data.ts is already written as a
 * comma-separated ingredient list (e.g. "لپه، گوشت، پیاز و دارچین") rather
 * than a sentence, so no NLP/heuristic splitting is needed -- just split on
 * the Persian comma (U+060C) and, since the last ingredient is often
 * written as "X و Y" ("X and Y"), also peel off a leading "و " from any
 * resulting piece. Ascii comma is also handled for robustness even though
 * the current data doesn't use it.
 */
export function parseIngredients(descFa: string): string[] {
  return descFa
    .split(/[،,]/)
    .map((piece) => piece.trim().replace(/^و\s+/, ''))
    .filter((piece) => piece.length > 0);
}
