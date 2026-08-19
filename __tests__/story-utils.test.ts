import { getActiveParagraphIndex, getParagraphOpacity } from '@/lib/story-utils';

describe('getActiveParagraphIndex', () => {
  it('returns 0 at the very start', () => {
    expect(getActiveParagraphIndex(0, 3)).toBe(0);
  });

  it('returns the last index at the very end (not count, which would be out of range)', () => {
    expect(getActiveParagraphIndex(1, 3)).toBe(2);
  });

  it('returns the middle index at the midpoint', () => {
    expect(getActiveParagraphIndex(0.5, 3)).toBe(1);
  });

  it('clamps out-of-range progress instead of returning an invalid index', () => {
    expect(getActiveParagraphIndex(-0.5, 3)).toBe(0);
    expect(getActiveParagraphIndex(1.5, 3)).toBe(2);
  });

  it('throws for a non-positive count', () => {
    expect(() => getActiveParagraphIndex(0.5, 0)).toThrow(RangeError);
  });
});

describe('getParagraphOpacity', () => {
  it('the first paragraph is fully visible at progress 0', () => {
    expect(getParagraphOpacity(0, 0, 3)).toBe(1);
  });

  it('the last paragraph is fully visible at progress 1', () => {
    expect(getParagraphOpacity(1, 2, 3)).toBe(1);
  });

  it('the first paragraph fades out before the second segment begins', () => {
    // segment width = 1/3 ≈ 0.333; well past paragraph 0's segment + crossfade
    expect(getParagraphOpacity(0.9, 0, 3)).toBe(0);
  });

  it('adjacent paragraphs overlap (both partially visible) at a segment boundary', () => {
    const boundary = 1 / 3;
    const outgoing = getParagraphOpacity(boundary, 0, 3);
    const incoming = getParagraphOpacity(boundary, 1, 3);
    expect(outgoing).toBeGreaterThan(0);
    expect(outgoing).toBeLessThan(1);
    expect(incoming).toBeGreaterThan(0);
    expect(incoming).toBeLessThan(1);
  });

  it('a paragraph far outside its segment is fully hidden (0), not negative', () => {
    expect(getParagraphOpacity(0, 2, 3)).toBe(0);
  });

  it('opacity is always clamped to [0, 1]', () => {
    for (let p = 0; p <= 1; p += 0.05) {
      for (let i = 0; i < 3; i++) {
        const o = getParagraphOpacity(p, i, 3);
        expect(o).toBeGreaterThanOrEqual(0);
        expect(o).toBeLessThanOrEqual(1);
      }
    }
  });

  it('with a single paragraph, it stays fully visible across the whole range', () => {
    expect(getParagraphOpacity(0, 0, 1)).toBe(1);
    expect(getParagraphOpacity(0.5, 0, 1)).toBe(1);
    expect(getParagraphOpacity(1, 0, 1)).toBe(1);
  });

  it('throws for an out-of-range index', () => {
    expect(() => getParagraphOpacity(0.5, 3, 3)).toThrow(RangeError);
    expect(() => getParagraphOpacity(0.5, -1, 3)).toThrow(RangeError);
  });

  it('throws for an invalid crossfade value', () => {
    expect(() => getParagraphOpacity(0.5, 0, 3, 1.5)).toThrow(RangeError);
    expect(() => getParagraphOpacity(0.5, 0, 3, -0.1)).toThrow(RangeError);
  });
});
