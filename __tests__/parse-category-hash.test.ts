import { parseCategoryHash } from '@/lib/category-scroll-utils';
import { getOrderedAvailableCategories } from '@/lib/categories-data';

/**
 * Regression test for a real bug: the home page's category cards link to
 * /{locale}/menu#cat-{slug}, but nothing on the menu page read that hash.
 * The id it points at is on the category TAB, so the browser scrolled the
 * tab strip into view and left the horizontal card track at the start --
 * the reader arrived and still had to pick the category by hand.
 */
describe('parseCategoryHash', () => {
  it('extracts the slug from a well-formed hash', () => {
    expect(parseCategoryHash('#cat-coffee')).toBe('coffee');
  });

  it('accepts a hash string with no leading "#"', () => {
    expect(parseCategoryHash('cat-coffee')).toBe('coffee');
  });

  it('preserves hyphens inside the slug itself', () => {
    expect(parseCategoryHash('#cat-cold-brew')).toBe('cold-brew');
  });

  it('returns undefined for an absent or empty hash', () => {
    expect(parseCategoryHash('')).toBeUndefined();
    expect(parseCategoryHash('#')).toBeUndefined();
  });

  it('returns undefined for an unrelated hash', () => {
    expect(parseCategoryHash('#main')).toBeUndefined();
    expect(parseCategoryHash('#category-coffee')).toBeUndefined();
  });

  it('returns undefined for the prefix with no slug after it', () => {
    expect(parseCategoryHash('#cat-')).toBeUndefined();
  });

  it('round-trips every real category slug the home page can link to', () => {
    const categories = getOrderedAvailableCategories();
    expect(categories.length).toBeGreaterThan(0);
    for (const cat of categories) {
      expect(parseCategoryHash(`#cat-${cat.slug}`)).toBe(cat.slug);
    }
  });
});
