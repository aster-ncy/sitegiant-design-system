import React from 'react';
import { PlusIcon } from './Button';

export type SplitButtonVariant = 'primary' | 'outline';
export type SplitButtonState = 'default' | 'hover' | 'clicked' | 'disabled';

export interface SplitButtonProps {
  /** Visual style variant */
  variant?: SplitButtonVariant;
  /** Button label text */
  label?: string;
  /** Show plus icon before text */
  hasIcon?: boolean;
  /** Icon element (overrides default PlusIcon) */
  icon?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Main button click handler */
  onClick?: () => void;
  /** Dropdown chevron click handler */
  onDropdownClick?: () => void;
  /** Extra Tailwind classes */
  className?: string;
}

/* ── Chevron-down icon (Figma: "chevron-down" 17×17) ───── */
const ChevronDown = () => (
  <svg
    className="size-[17px] shrink-0"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.25 6.375L8.5 10.625L12.75 6.375"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ── Variant styles ─────────────────────────────────────── */

const variantStyles: Record<SplitButtonVariant, {
  base: string;
  hover: string;
  active: string;
  disabled: string;
  separator: string;
}> = {
  primary: {
    base: 'bg-[var(--button-primary-default-fill)] text-[color:var(--button-primary-text)]',
    hover: 'hover:bg-[var(--button-primary-hover-fill)]',
    active: 'active:bg-[var(--button-primary-clicked-fill)]',
    disabled: 'bg-[var(--button-disabled-default-fill)] text-[color:var(--button-disabled-default-text)] cursor-not-allowed pointer-events-none',
    separator: 'border-r border-[rgb(0_0_0/0.1)]',
  },
  outline: {
    base: 'bg-[var(--button-outline-default-fill)] text-[color:var(--button-outline-text)] border border-[var(--button-outline-default-border)]',
    hover: 'hover:bg-[var(--button-outline-hover-fill)]',
    active: 'active:bg-[var(--button-outline-clicked-fill)]',
    disabled: 'bg-transparent text-[color:var(--button-disabled-outline-text)] border border-[var(--button-disabled-outline-border)] cursor-not-allowed pointer-events-none',
    separator: 'border-r border-[var(--button-outline-default-border)]',
  },
};

/* ── SplitButton component ──────────────────────────────── */
/*
 * Figma structure:
 *   ┌─── Button (left) ──────┬── Button (right) ──┐
 *   │ [+icon] Text           │   chevron-down ▾    │
 *   │ pl:16  pr:12  py:8     │   pl:8  pr:12 py:8  │
 *   │ rounded-l-120          │   rounded-r-120      │
 *   └────────────────────────┴─────────────────────┘
 *   With icon: pl:12 for icon side in left part
 *   Height: 33px
 *   Icon size: 17×17, gap: 4px
 */

export const SplitButton = ({
  variant = 'primary',
  label = 'Button',
  hasIcon = false,
  icon,
  disabled = false,
  onClick,
  onDropdownClick,
  className = '',
}: SplitButtonProps) => {
  const styles = variantStyles[variant];
  const stateClasses = disabled ? styles.disabled : `${styles.base} ${styles.hover} ${styles.active}`;

  const shared = [
    'font-[var(--font-weight-regular)]',
    'font-[family-name:var(--font-sans)]',
    'text-[length:var(--general-button-primary-size)]',
    'leading-[var(--general-button-primary-lineheight)]',
    'transition-colors duration-150 select-none',
  ].join(' ');

  return (
    <div className={`inline-flex items-center ${className}`}>
      {/* Left: main action */}
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={[
          'inline-flex items-center justify-end',
          'rounded-l-[var(--radius-120)]',
          hasIcon
            ? 'pl-[var(--spacing-12)] pr-[var(--spacing-12)]'
            : 'pl-[var(--spacing-16)] pr-[var(--spacing-12)]',
          'py-[var(--spacing-8)]',
          stateClasses,
          styles.separator,
          shared,
          'focus:outline-none',
        ].join(' ')}
      >
        <span className={`inline-flex items-center justify-center ${hasIcon ? 'gap-[var(--spacing-4)]' : ''}`}>
          {hasIcon && (icon || <PlusIcon />)}
          <span className="whitespace-nowrap">{label}</span>
        </span>
      </button>

      {/* Right: dropdown trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={onDropdownClick}
        className={[
          'inline-flex items-center justify-center',
          'rounded-r-[var(--radius-120)]',
          'pl-[var(--spacing-8)] pr-[var(--spacing-12)]',
          'py-[var(--spacing-8)]',
          stateClasses,
          shared,
          'focus:outline-none',
        ].join(' ')}
      >
        <ChevronDown />
      </button>
    </div>
  );
};
