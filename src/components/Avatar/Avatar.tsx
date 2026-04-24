export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  /** Image URL. When omitted, initials render on the placeholder background. */
  src?: string;
  /** Accessible label. Defaults to the initials when not provided. */
  alt?: string;
  /** Initials fallback (typically 1–2 chars). Rendered when no src is provided. */
  initials?: string;
  /** xs=20 · sm=32 · md=40 · lg=56 · xl=128 (px) */
  size?: AvatarSize;
  className?: string;
}

/** Pixel diameter for each size. Applied via inline style to avoid any
 * Tailwind v4 arbitrary-class scanner edge cases at uncommon pixel values. */
const sizePx: Record<AvatarSize, number> = {
  xs: 20,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 128,
};

/**
 * Circular user/entity avatar. Shows an image when `src` is provided; otherwise
 * renders initials on a neutral placeholder background. Circle radius is
 * Radius/120 (pill) per Figma.
 */
export const Avatar = ({
  src,
  alt,
  initials = '',
  size = 'md',
  className = '',
}: AvatarProps) => {
  // Fall back to initials so screen readers still announce the avatar.
  const accessibleName = alt ?? initials;
  // Placeholder path (no src): expose the accessible name on the container
  // itself via role+aria-label. The <img> path relies on alt, which is
  // already the accessible name.
  const placeholderA11y = !src && accessibleName
    ? { role: 'img' as const, 'aria-label': accessibleName }
    : {};
  return (
    <div
      {...placeholderA11y}
      style={{ width: sizePx[size], height: sizePx[size] }}
      className={[
        'relative shrink-0 inline-flex items-center justify-center overflow-hidden',
        'rounded-[var(--radius-120)]',
        'bg-[var(--color-surface-empty-state-placeholder-fill)]',
        // Body Large per Figma — same 16/20 Roboto at every size.
        'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
        'text-[length:var(--text-16)] leading-[var(--leading-20)]',
        'text-[color:var(--color-text-primary)] select-none',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {src ? (
        <img
          src={src}
          alt={accessibleName}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        // aria-hidden because the container already carries the a11y name.
        <span aria-hidden="true">{initials}</span>
      )}
    </div>
  );
};
