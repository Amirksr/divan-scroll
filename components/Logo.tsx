interface LogoProps {
  wordmark: string;
  isFa?: boolean;
  className?: string;
}

/**
 * Logo mark: a coffee cup inside a seal/stamp ring, echoing DivanCafe's
 * signature coffee-ring motif. Ported directly from DivanCafe's
 * src/components/Logo.tsx. `isFa` (default true, matching this project's
 * original Farsi-only assumption) picks the wordmark's font family --
 * Vazirmatn for Farsi, Newsreader for the English wordmark -- now that
 * i18n routing exists to actually pass a non-Farsi wordmark through.
 */
export default function Logo({ wordmark, isFa = true, className }: LogoProps) {
  return (
    <span className={`logo ${className ?? ''}`}>
      <svg viewBox="0 0 40 40" aria-hidden="true" className="logo-mark">
        <circle cx="20" cy="20" r="18.5" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
        <circle cx="20" cy="20" r="14.5" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <path
          d="M11 17h14v6.5a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6V17Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M25 18.5h1.6a2.4 2.4 0 0 1 0 4.8H25" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M15 12c-.5.6-.5 1.1 0 1.7s.5 1.1 0 1.7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M18.3 12c-.5.6-.5 1.1 0 1.7s.5 1.1 0 1.7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>
      <span className={isFa ? 'logo-wordmark' : 'logo-wordmark logo-wordmark--en'}>{wordmark}</span>
    </span>
  );
}
