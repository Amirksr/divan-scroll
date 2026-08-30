import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/**
 * Ported from DivanCafe's src/components/icons.tsx. Each icon has a small
 * inner element that only animates when its ancestor `.category-card` is
 * hovered — see the `.icon-steam`/`.icon-sway`/etc classes in globals.css
 * (the real site uses Tailwind's `group-hover:animate-*` utilities;
 * divan-scroll doesn't have Tailwind, so the same effect is done with a
 * plain `.category-card:hover .icon-*` CSS selector instead).
 */

export function CoffeeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z" />
      <path d="M17 9h1.5a2.5 2.5 0 0 1 0 5H17" />
      <g className="icon-steam-group">
        <path className="icon-steam" d="M7.5 4.5c-.6.7-.6 1.3 0 2s.6 1.3 0 2" />
        <path className="icon-steam-delay" d="M11 4.5c-.6.7-.6 1.3 0 2s.6 1.3 0 2" />
      </g>
    </svg>
  );
}

export function LeafIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <g className="icon-sway">
        <path d="M5 19c8-1 13-6 14-14-8 1-13 6-14 14Z" />
        <path d="M5 19c1-4 3-7 6-9" />
      </g>
    </svg>
  );
}

export function IceCubeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z" />
      <path d="M4 8.5 12 13l8-4.5" />
      <path d="M12 13v7" />
      <path className="icon-glint" d="M8.5 9.5 12 11.5" strokeWidth={1.2} />
    </svg>
  );
}

export function EggIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <ellipse cx="10" cy="14" rx="7" ry="5" />
      <circle className="icon-jiggle" cx="16" cy="9" r="3" />
    </svg>
  );
}

export function CroissantIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        className="icon-wiggle"
        d="M3 15c1-6 6-10 10-10 2 0 4 1 5 2-2 0-4 1-5 3 2 0 3 1 4 2-2 0-3 0-4 1 1 1 1 2 1 3-1-1-2-1-3-1-3 4-6 5-8 0Z"
      />
    </svg>
  );
}

export function BowlIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 11h18a9 8 0 0 1-9 7 9 8 0 0 1-9-7Z" />
      <path d="M8 11c0-2.5 1.8-4.5 4-4.5" />
      <g className="icon-steam-group">
        <path className="icon-steam" d="M10.5 4c-.6.7-.6 1.3 0 2s.6 1.3 0 2" />
        <path className="icon-steam-delay" d="M14 4c-.6.7-.6 1.3 0 2s.6 1.3 0 2" />
      </g>
    </svg>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 4h2l1.6 10.2A2 2 0 0 0 8.58 16H17a2 2 0 0 0 1.95-1.56L20.5 8H6.5" />
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
    </svg>
  );
}

export const categoryIcons = {
  coffee: CoffeeIcon,
  tea: LeafIcon,
  cold: IceCubeIcon,
  breakfast: EggIcon,
  pastry: CroissantIcon,
  brunch: BowlIcon,
} as const;
