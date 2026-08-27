import { pickActiveCategory, CategoryProbe } from '@/lib/category-scroll-utils';

describe('pickActiveCategory', () => {
  it('picks the only intersecting category', () => {
    const probes: CategoryProbe[] = [
      { category: 'coffee', isIntersecting: true, left: 100 },
      { category: 'tea', isIntersecting: false, left: 500 },
    ];
    expect(pickActiveCategory(probes)).toBe('coffee');
  });

  it('picks the leftmost among multiple intersecting categories', () => {
    const probes: CategoryProbe[] = [
      { category: 'tea', isIntersecting: true, left: 300 },
      { category: 'coffee', isIntersecting: true, left: 50 },
      { category: 'brunch', isIntersecting: true, left: 800 },
    ];
    expect(pickActiveCategory(probes)).toBe('coffee');
  });

  it('falls back when nothing is intersecting', () => {
    const probes: CategoryProbe[] = [
      { category: 'coffee', isIntersecting: false, left: 100 },
      { category: 'tea', isIntersecting: false, left: 500 },
    ];
    expect(pickActiveCategory(probes, 'brunch')).toBe('brunch');
  });

  it('returns undefined when nothing intersects and there is no fallback', () => {
    const probes: CategoryProbe[] = [{ category: 'coffee', isIntersecting: false, left: 100 }];
    expect(pickActiveCategory(probes)).toBeUndefined();
  });

  it('returns undefined for an empty probe list with no fallback', () => {
    expect(pickActiveCategory([])).toBeUndefined();
  });

  it('handles a single category with a negative left (scrolled slightly past)', () => {
    const probes: CategoryProbe[] = [
      { category: 'coffee', isIntersecting: true, left: -20 },
      { category: 'tea', isIntersecting: true, left: 40 },
    ];
    expect(pickActiveCategory(probes)).toBe('coffee');
  });
});
