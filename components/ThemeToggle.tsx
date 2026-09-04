'use client';

import { useEffect, useState } from 'react';
import { applyTheme, resolveInitialTheme, type Theme } from '@/lib/theme';
import { translate, type Messages } from '@/lib/i18n';

export default function ThemeToggle({ dict }: { dict: Messages }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  // Resolve the real theme only after mount so the server-rendered markup
  // (which can't know localStorage/system preference) never mismatches.
  useEffect(() => {
    setTheme(resolveInitialTheme());
  }, []);

  function toggle() {
    // Flip the *actual* current theme (read straight from the DOM), not
    // the `theme` state variable, which starts out null until the
    // post-mount effect above runs -- see DivanCafe's ThemeToggle.tsx for
    // the original reasoning (a click in that window would otherwise
    // always resolve to "light", a no-op when the page was already light).
    const isCurrentlyLight = document.documentElement.classList.contains('light');
    const next: Theme = isCurrentlyLight ? 'dark' : 'light';
    setTheme(next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="theme-toggle focus-ring"
      aria-label={theme === 'light' ? translate(dict, 'theme.to_dark') : translate(dict, 'theme.to_light')}
      data-theme-ready={theme !== null}
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="theme-toggle-icon" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 2.5v2.3M12 19.2v2.3M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.3M19.2 12h2.3M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="theme-toggle-icon" aria-hidden="true">
      <path
        d="M20 14.2A8.5 8.5 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
