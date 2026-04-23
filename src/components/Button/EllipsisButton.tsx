
export type EllipsisButtonVariant =
  | 'default'
  | 'basic'
  | 'danger'
  | 'danger-subtle';

export type EllipsisButtonSize = 'default' | 'lg';

export interface EllipsisButtonProps {
  /** Visual style sub-variant */
  variant?: EllipsisButtonVariant;
  /** Button size — default (33×33) or lg (56×56) */
  size?: EllipsisButtonSize;
  /** Disabled state */
  disabled?: boolean;
  /** Render on a dark background (uses ondark fill) */
  onDark?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Extra Tailwind classes */
  className?: string;
}

/* ── Ellipsis icon SVG (three horizontal dots) ─────────── */
const EllipsisIcon = ({ className = '' }: { className?: string }) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="3.75" cy="8.5" r="1.25" fill="currentColor" />
    <circle cx="8.5" cy="8.5" r="1.25" fill="currentColor" />
    <circle cx="13.25" cy="8.5" r="1.25" fill="currentColor" />
  </svg>
);

export { EllipsisIcon };

/*
 * Figma token mapping:
 *
 * Variant "default":
 *   icon: --button-ellipsis-default-icon (#647176)
 *   hover icon: --button-ellipsis-hover-icon (#0C2028)
 *   fill states: transparent → #FAFAFB → #E5E5E5
 *
 * Variant "basic":    icon override → --button-ellipsis-basic-icon (#007CE0)
 * Variant "danger":   icon override → --button-ellipsis-danger-icon (#E0241A)
 * Variant "danger-subtle": icon override → --button-ellipsis-danger-subtle-icon (#647176)
 *
 * disabled: icon #D4D4D4, fill transparent
 * onDark:   fill #FFFFFF (white bg on dark surface)
 */

/* Icon color per variant — default/hover are handled via CSS group-hover */
const variantIconColor: Record<EllipsisButtonVariant, string> = {
  default: 'text-[color:var(--button-ellipsis-default-icon)] group-hover/ellipsis:text-[color:var(--button-ellipsis-hover-icon)]',
  basic: 'text-[color:var(--button-ellipsis-basic-icon)]',
  danger: 'text-[color:var(--button-ellipsis-danger-icon)]',
  'danger-subtle': 'text-[color:var(--button-ellipsis-danger-subtle-icon)] group-hover/ellipsis:text-[color:var(--button-ellipsis-hover-icon)]',
};

/* ── Size config from Figma ────────────────────────────── */
/*
 * Default: 33×33, padding Spacing/8, icon 17×17, Radius/120
 * Large:   56×56, padding Spacing/8, icon 30×30, Radius/120
 */
const sizeClasses: Record<EllipsisButtonSize, string> = {
  default: 'size-[33px]',
  lg: 'size-[56px]',
};

const iconSizeClasses: Record<EllipsisButtonSize, string> = {
  default: 'size-[17px]',
  lg: 'size-[30px]',
};

/* ── EllipsisButton component ──────────────────────────── */

export const EllipsisButton = ({
  variant = 'default',
  size = 'default',
  disabled = false,
  onDark = false,
  onClick,
  className = '',
}: EllipsisButtonProps) => {
  const base = [
    'group/ellipsis',
    'inline-flex items-center justify-center',
    'rounded-[var(--radius-120)]',
    'transition-colors duration-150 select-none',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
    'focus-visible:ring-[var(--button-primary-default-fill)]',
    'p-[var(--spacing-8)]',
  ].join(' ');

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        className={[
          base,
          sizeClasses[size],
          'bg-[var(--button-ellipsis-disabled-fill)]',
          'text-[color:var(--button-ellipsis-disabled-icon)]',
          'cursor-not-allowed pointer-events-none',
          className,
        ].join(' ')}
      >
        <EllipsisIcon className={iconSizeClasses[size]} />
      </button>
    );
  }

  const fillCls = onDark
    ? 'bg-[var(--button-ellipsis-ondark-fill)] hover:bg-[var(--button-ellipsis-ondark-fill)] active:bg-[var(--button-ellipsis-ondark-fill)]'
    : 'bg-[var(--button-ellipsis-default-fill)] hover:bg-[var(--button-ellipsis-hover-fill)] active:bg-[var(--button-ellipsis-clicked-fill)]';

  return (
    <button
      type="button"
      onClick={onClick}
      className={[base, sizeClasses[size], fillCls, className].join(' ')}
    >
      <EllipsisIcon className={`${iconSizeClasses[size]} ${variantIconColor[variant]}`} />
    </button>
  );
};
