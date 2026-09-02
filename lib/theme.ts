export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

/** Reads the user's explicitly saved theme choice, if any. Safe to call on the server. */
export function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    // Storage can throw in private-browsing modes or with cookies disabled.
    return null;
  }
}

/** Reads the OS/browser color-scheme preference. Falls back to "dark" (this site's default look). */
export function getPreferredTheme(): Theme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark';
  try {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

/** Saved choice takes priority over the system preference; the site defaults to dark. */
export function resolveInitialTheme(): Theme {
  return getStoredTheme() ?? getPreferredTheme();
}

/** Applies the theme to the document and persists the choice. Safe to call only on the client. */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('light', theme === 'light');
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Ignore storage failures -- the visual toggle still works for this session.
  }
}

/**
 * Source for the inline head script that applies the theme before React
 * hydrates, preventing a flash of the wrong theme. Kept as a plain string
 * (no imports) since it runs standalone in the browser before any bundle
 * executes -- ported verbatim from DivanCafe's themeInitScript.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=(window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches)?"light":"dark";}if(t==="light"){document.documentElement.classList.add("light");}}catch(e){}})();`;
