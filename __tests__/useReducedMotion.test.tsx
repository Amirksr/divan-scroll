import { renderHook, act } from '@testing-library/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

function mockMatchMedia(initialMatches: boolean) {
  let changeHandler: ((e: MediaQueryListEvent) => void) | null = null;

  const mql: Partial<MediaQueryList> = {
    matches: initialMatches,
    media: '(prefers-reduced-motion: reduce)',
    addEventListener: jest.fn((event, handler) => {
      if (event === 'change') changeHandler = handler as (e: MediaQueryListEvent) => void;
    }),
    removeEventListener: jest.fn(),
  };

  window.matchMedia = jest.fn().mockReturnValue(mql);

  return {
    mql,
    triggerChange: (matches: boolean) => {
      act(() => {
        changeHandler?.({ matches } as MediaQueryListEvent);
      });
    },
  };
}

describe('useReducedMotion', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('reflects the initial matchMedia value', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('defaults to false when the user has no preference', () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('updates reactively when the OS setting changes mid-session', () => {
    const { triggerChange } = mockMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);
    triggerChange(true);
    expect(result.current).toBe(true);
  });

  it('removes the event listener on unmount (no leak)', () => {
    const { mql } = mockMatchMedia(false);
    const { unmount } = renderHook(() => useReducedMotion());
    unmount();
    expect(mql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('does not throw when window.matchMedia is unavailable (SSR-safe)', () => {
    // @ts-expect-error simulating an environment without matchMedia
    delete window.matchMedia;
    expect(() => renderHook(() => useReducedMotion())).not.toThrow();
  });
});
