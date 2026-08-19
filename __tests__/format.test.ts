import { toTelHref } from '@/lib/format';

describe('toTelHref', () => {
  it('strips spaces from a spaced phone number', () => {
    expect(toTelHref('+98 31 3220 1555')).toBe('tel:+983132201555');
  });

  it('strips dashes from a dashed phone number', () => {
    expect(toTelHref('031-32201555')).toBe('tel:03132201555');
  });

  it('leaves a number with no spaces or dashes unchanged (besides the prefix)', () => {
    expect(toTelHref('03132201555')).toBe('tel:03132201555');
  });

  it('handles a mix of spaces and dashes', () => {
    expect(toTelHref('031-3220 1555')).toBe('tel:03132201555');
  });
});
