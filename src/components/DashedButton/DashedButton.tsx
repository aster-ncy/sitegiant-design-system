import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface DashedButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> {
  children: ReactNode;
  /** Stretch to fill the parent container's width. Default false (intrinsic). */
  fullWidth?: boolean;
  /** REPLACES (not appends) the built-in classes. Pass the full layout you want. */
  className?: string;
}

const ROOT_BUILTIN_CLASSES =
  'inline-flex items-center gap-[var(--spacing-4)] ' +
  'px-[var(--spacing-12)] py-[var(--spacing-8)] ' +
  'rounded-[var(--radius-4)] ' +
  'border border-dashed border-[color:var(--button-outline-default-border)] ' +
  'bg-[var(--button-outline-default-fill)] ' +
  'text-[length:var(--general-button-primary-size)] leading-[var(--general-button-primary-lineheight)] ' +
  'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)] ' +
  'text-[color:var(--text-link-basic-default)] ' +
  'transition-colors duration-150 ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--button-primary-default-fill)]';

const INTERACTIVE_STATE_CLASSES =
  'cursor-pointer ' +
  'hover:bg-[var(--button-outline-hover-fill)] hover:text-[color:var(--text-link-basic-hover)] ' +
  'active:bg-[var(--button-outline-clicked-fill)] active:text-[color:var(--text-link-basic-clicked)]';

const DISABLED_STATE_CLASSES =
  'cursor-not-allowed text-[color:var(--text-link-disabled)]';

const FULL_WIDTH_CLASSES = 'w-full justify-center';
const INTRINSIC_CLASSES = 'justify-center';

/**
 * DashedButton — Figma: Dashed Button (2099:1295).
 *
 * Outline-button chrome (1px dashed border, --radius-4, 12px/8px padding)
 * wrapping text-link-basic content. Children are rendered as-is, so the
 * caller controls the inner shape (label-only, icon+label, multi-icon, …)
 * — children inherit color via `currentColor`, so an inline `<Icon />`
 * paints the same blue/disabled chain as the surrounding label.
 *
 * Pure pseudo-class state styling (no `state` prop): hover, active,
 * focus-visible, and disabled all driven by the browser.
 */
export const DashedButton = ({
  children,
  fullWidth = false,
  className,
  type,
  disabled,
  ...rest
}: DashedButtonProps) => {
  const layoutClasses = fullWidth ? FULL_WIDTH_CLASSES : INTRINSIC_CLASSES;
  const stateClasses = disabled ? DISABLED_STATE_CLASSES : INTERACTIVE_STATE_CLASSES;
  const rootClass = className || `${ROOT_BUILTIN_CLASSES} ${stateClasses} ${layoutClasses}`;

  return (
    <button
      type={type ?? 'button'}
      disabled={disabled}
      className={rootClass}
      {...rest}
    >
      {children}
    </button>
  );
};
