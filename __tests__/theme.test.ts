import {
  applyTheme,
  getPreferredTheme,
  getStoredTheme,
  resolveInitialTheme,
} from '../lib/theme';

describe('theme', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove('light');
    // jsdom doesn't implement matchMedia; each test sets its own mock.
    // @ts-expect-error -- deliberately clearing between tests
    delete window.matchMedia;
  });

  describe('getStoredTheme', () => {
    it('returns null when nothing is stored', () => {
      expect(getStoredTheme()).toBeNull();
    });

    it('returns the stored theme when valid', () => {
      window.localStorage.setItem('theme', 'light');
      expect(getStoredTheme()).toBe('light');
    });

    it('ignores a corrupted/unexpected stored value', () => {
      window.localStorage.setItem('theme', 'sepia');
      expect(getStoredTheme()).toBeNull();
    });
  });

  describe('getPreferredTheme', () => {
    it('falls back to dark when matchMedia is unavailable (jsdom default)', () => {
      expect(getPreferredTheme()).toBe('dark');
    });

    it('returns light when the OS prefers light', () => {
      window.matchMedia = jest.fn().mockReturnValue({ matches: true }) as unknown as typeof window.matchMedia;
      expect(getPreferredTheme()).toBe('light');
    });

    it('returns dark when the OS prefers dark', () => {
      window.matchMedia = jest.fn().mockReturnValue({ matches: false }) as unknown as typeof window.matchMedia;
      expect(getPreferredTheme()).toBe('dark');
    });
  });

  describe('resolveInitialTheme', () => {
    it('prefers the stored choice over the system preference', () => {
      window.matchMedia = jest.fn().mockReturnValue({ matches: true }) as unknown as typeof window.matchMedia;
      window.localStorage.setItem('theme', 'dark');
      expect(resolveInitialTheme()).toBe('dark');
    });

    it('falls back to the system preference with nothing stored', () => {
      window.matchMedia = jest.fn().mockReturnValue({ matches: true }) as unknown as typeof window.matchMedia;
      expect(resolveInitialTheme()).toBe('light');
    });
  });

  describe('applyTheme', () => {
    it('adds the light class and persists the choice', () => {
      applyTheme('light');
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(window.localStorage.getItem('theme')).toBe('light');
    });

    it('removes the light class and persists dark', () => {
      document.documentElement.classList.add('light');
      applyTheme('dark');
      expect(document.documentElement.classList.contains('light')).toBe(false);
      expect(window.localStorage.getItem('theme')).toBe('dark');
    });
  });
});
