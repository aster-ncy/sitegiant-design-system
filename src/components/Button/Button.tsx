import React from 'react';
import { Icon } from '../Icon';

export type ButtonVariant =
  | 'primary'
  | 'basic'
  | 'outline'
  | 'danger'
  | 'danger-outline'
  | 'special'
  | 'small-primary';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Disables the button */
  disabled?: boolean;
  /** Button label text */
  label?: string;
  /** Icon element to show before the label (Figma: hasIcon=true) */
  leftIcon?: React.ReactNode;
  /** Content inside the button (overrides label) */
  children?: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Extra Tailwind classes */
  className?: string;
}

/* ── Variant colors ─────────────────────────────────────── */

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'bg-[var(--button-primary-default-fill)] text-[color:var(--button-primary-text)]',
    'hover:bg-[var(--button-primary-hover-fill)]',
    'active:bg-[var(--button-primary-clicked-fill)]',
  ].join(' '),

  basic: [
    'bg-[var(--button-basic-default-fill)] text-[color:var(--button-basic-text)]',
    'border border-[var(--button-basic-default-border)]',
    'hover:bg-[var(--button-basic-hover-fill)]',
    'active:bg-[var(--button-basic-clicked-fill)]',
  ].join(' '),

  outline: [
    'bg-[var(--button-outline-default-fill)] text-[color:var(--button-outline-text)]',
    'border border-[var(--button-outline-default-border)]',
    'hover:bg-[var(--button-outline-hover-fill)]',
    'active:bg-[var(--button-outline-clicked-fill)]',
  ].join(' '),

  danger: [
    'bg-[var(--button-danger-default-fill)] text-[color:var(--button-danger-text)]',
    'hover:bg-[var(--button-danger-hover-fill)]',
    'active:bg-[var(--button-danger-clicked-fill)]',
  ].join(' '),

  'danger-outline': [
    'bg-[var(--button-danger-outline-default-fill)] text-[color:var(--button-danger-outline-text)]',
    'border border-[var(--button-danger-outline-default-border)]',
    'hover:bg-[var(--button-danger-outline-hover-fill)]',
    'active:bg-[var(--button-danger-outline-clicked-fill)]',
  ].join(' '),

  special: [
    'bg-[var(--button-special-default-fill)] text-[color:var(--button-special-text)]',
    'hover:bg-[var(--button-special-hover-fill)]',
    'active:bg-[var(--button-special-clicked-fill)]',
  ].join(' '),

  'small-primary': [
    'bg-[var(--button-primary-hover-fill)] text-[color:var(--button-primary-text)]',
    'hover:bg-[var(--button-primary-clicked-fill)]',
    'active:bg-[var(--button-primary-clicked-fill)]',
  ].join(' '),
};

const disabledClasses = [
  'bg-[var(--button-disabled-default-fill)] text-[color:var(--button-disabled-default-text)]',
  'cursor-not-allowed pointer-events-none',
].join(' ');

const disabledOutlineClasses = [
  'bg-transparent text-[color:var(--button-disabled-outline-text)]',
  'border border-[var(--button-disabled-outline-border)]',
  'cursor-not-allowed pointer-events-none',
].join(' ');

/* Outline-style variants that use disabled-outline tokens (basic, outline only).
 * Note: danger-outline uses solid disabled fill per Figma spec. */
const OUTLINE_VARIANTS: ButtonVariant[] = ['basic', 'outline'];

/* ── Size tokens ────────────────────────────────────────── */
/*
 * Figma padding specs:
 *   Default (md):      px = Spacing/16 (16px),  py = Spacing/8 (8px)
 *   Small Primary (sm): px = Spacing/8  (8px),   py = Spacing/4 (4px)
 *   With‑icon variant:  pl = Spacing/12, pr = Spacing/16 (asymmetric)
 */

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-[var(--spacing-8)] py-[var(--spacing-4)]   text-[length:var(--general-button-primary-size)] leading-[var(--general-button-primary-lineheight)]',
  md: 'px-[var(--spacing-16)] py-[var(--spacing-8)]  text-[length:var(--general-button-primary-size)] leading-[var(--general-button-primary-lineheight)]',
  lg: 'px-[var(--spacing-24)] py-[var(--spacing-12)]  text-[length:var(--general-button-primary-size)] leading-[var(--general-button-primary-lineheight)]',
};

/* With‑icon: asymmetric padding  pl=12  pr=16 (Figma: Spacing/12, Spacing/16) */
const sizeWithIconClasses: Record<ButtonSize, string> = {
  sm: 'pl-[var(--spacing-6)] pr-[var(--spacing-8)] py-[var(--spacing-4)]   text-[length:var(--general-button-primary-size)] leading-[var(--general-button-primary-lineheight)]',
  md: 'pl-[var(--spacing-12)] pr-[var(--spacing-16)] py-[var(--spacing-8)]  text-[length:var(--general-button-primary-size)] leading-[var(--general-button-primary-lineheight)]',
  lg: 'pl-[var(--spacing-20)] pr-[var(--spacing-24)] py-[var(--spacing-12)]  text-[length:var(--general-button-primary-size)] leading-[var(--general-button-primary-lineheight)]',
};

/* ── Plus icon shortcut using shared Icon component ────── */
const PlusIcon = ({ className = '' }: { className?: string }) => (
  <Icon name="plus" size={17} className={className} />
);

export { PlusIcon };

/* ── Button component ───────────────────────────────────── */

export const Button = ({
  variant = 'primary',
  size,
  disabled = false,
  label,
  leftIcon,
  children,
  onClick,
  className = '',
}: ButtonProps) => {
  const hasIcon = !!leftIcon;
  
  // Default size fallbacks (small-primary defaults to sm)
  const resolvedSize = size || (variant === 'small-primary' ? 'sm' : 'md');

  const base = [
    'inline-flex items-center justify-center',
    'rounded-[var(--radius-120)]',
    'font-[var(--font-weight-regular)]',
    'font-[family-name:var(--font-sans)]',
    'transition-colors duration-150 select-none',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
    'focus-visible:ring-[var(--button-primary-default-fill)]',
  ].join(' ');

  const colorCls = disabled
    ? (OUTLINE_VARIANTS.includes(variant) ? disabledOutlineClasses : disabledClasses)
    : variantClasses[variant];
  const sizeCls = hasIcon ? sizeWithIconClasses[resolvedSize] : sizeClasses[resolvedSize];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[base, colorCls, sizeCls, hasIcon ? 'gap-[var(--spacing-4)]' : '', className].filter(Boolean).join(' ')}
    >
      {leftIcon}
      {children ?? label}
    </button>
  );
};
