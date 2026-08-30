import { parseIngredients } from '@/lib/ingredients-utils';

describe('parseIngredients', () => {
  it('splits a Persian-comma-separated description into trimmed pieces', () => {
    expect(parseIngredients('لپه، گوشت، پیاز و دارچین')).toEqual([
      'لپه',
      'گوشت',
      'پیاز و دارچین',
    ]);
  });

  it('peels a leading "و " off a piece that starts with it', () => {
    // Descriptions sometimes split cleanly into "X" / "و Y" if the source
    // data uses a comma right before the final "and Y" -- make sure that
    // doesn't leave an ingredient literally starting with "و ".
    expect(parseIngredients('گوشت، و پیاز')).toEqual(['گوشت', 'پیاز']);
  });

  it('does not strip "و" when it is not a leading word (mid-word or mid-phrase)', () => {
    expect(parseIngredients('پیاز و دارچین')).toEqual(['پیاز و دارچین']);
  });

  it('handles a single-ingredient description with no commas', () => {
    expect(parseIngredients('زعفران')).toEqual(['زعفران']);
  });

  it('filters out empty pieces from a trailing or doubled comma', () => {
    expect(parseIngredients('لپه، گوشت،')).toEqual(['لپه', 'گوشت']);
    expect(parseIngredients('لپه،، گوشت')).toEqual(['لپه', 'گوشت']);
  });

  it('returns an empty array for an empty string', () => {
    expect(parseIngredients('')).toEqual([]);
  });

  it('also handles an ASCII comma for robustness even though real data uses the Persian one', () => {
    expect(parseIngredients('Eggs, fresh herbs, black pepper')).toEqual([
      'Eggs',
      'fresh herbs',
      'black pepper',
    ]);
  });

  it('matches real menu-data.ts descFa format end to end', () => {
    expect(parseIngredients('مرغ، رب انار، گردو و زعفران')).toEqual([
      'مرغ',
      'رب انار',
      'گردو و زعفران',
    ]);
  });
});
