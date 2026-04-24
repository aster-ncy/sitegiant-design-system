import type { MouseEventHandler } from 'react';
import { Icon, type IconName } from '../Icon';

export type IconButtonVariant = 'default' | 'basic' | 'danger';
export type IconButtonSize = 'default' | 'lg';

export interface IconButtonProps {
  /** Icon name from the Core SiteGiant icon library. */
  name: IconName;
  /** Visual style — controls icon color. */
  variant?: IconButtonVariant;
  /** `default` = 32×32, `lg` = 56×56. */
  size?: IconButtonSize;
  /** Disables the button. */
  disabled?: boolean;
  /** Places the button on a dark surface (flips fill states to ondark). */
  onDark?: boolean;
  /** Accessible label — required for standalone icon buttons. */
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

/**
 * Circular 32×32 (or 56×56) icon press target used in topbars and
 * toolbars. Shares colour tokens with EllipsisButton but accepts any
 * icon from the library — EllipsisButton is locked to the three-dot
 * glyph.
 */
const sizeClasses: Record<IconButtonSize, string> = {
  default: 'size-[33px]',
  lg: 'size-[56px]',
};

const iconPx: Record<IconButtonSize, number> = {
  default: 17,
  lg: 30,
};

const variantIconColor: Record<IconButtonVariant, string> = {
  default:
    'text-[color:var(--button-ellipsis-default-icon)] group-hover/iconbtn:text-[color:var(--button-ellipsis-hover-icon)]',
  basic: 'text-[color:var(--button-ellipsis-basic-icon)]',
  danger: 'text-[color:var(--button-ellipsis-danger-icon)]',
};

export const IconButton = ({
  name,
  variant = 'default',
  size = 'default',
  disabled = false,
  onDark = false,
  label,
  onClick,
  className = '',
}: IconButtonProps) => {
  const base = [
    'group/iconbtn',
    'inline-flex items-center justify-center shrink-0',
    'rounded-[var(--radius-120)]',
    'p-[var(--spacing-8)]',
    'transition-colors duration-150 select-none',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
    'focus-visible:ring-[var(--button-primary-default-fill)]',
  ].join(' ');

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        aria-label={label}
        className={[
          base,
          sizeClasses[size],
          'bg-[var(--button-ellipsis-disabled-fill)]',
          'text-[color:var(--button-ellipsis-disabled-icon)]',
          'cursor-not-allowed pointer-events-none',
          className,
        ].join(' ')}
      >
        <Icon name={name} size={iconPx[size]} />
      </button>
    );
  }

  const fillCls = onDark
    ? 'bg-[var(--button-ellipsis-ondark-fill)]'
    : 'bg-[var(--button-ellipsis-default-fill)] hover:bg-[var(--button-ellipsis-hover-fill)] active:bg-[var(--button-ellipsis-clicked-fill)]';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={[base, sizeClasses[size], fillCls, className].join(' ')}
    >
      <Icon name={name} size={iconPx[size]} className={variantIconColor[variant]} />
    </button>
  );
};
