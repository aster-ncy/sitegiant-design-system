import type { MouseEvent, ReactNode } from 'react';
import { Icon, type IconName } from '../Icon';
import { TooltipTrigger, type TooltipPlacement } from '../Tooltip';

export type IconLinkVariant =
  | 'basic'
  | 'danger'
  | 'danger-subtle'
  | 'subtle'
  | 'default'
  | 'success'
  | 'close';

export interface IconLinkProps {
  icon: IconName;
  /** Default 'basic'. */
  variant?: IconLinkVariant;
  /** Pixel size of the rendered icon. Default 17, or 21 when variant='close'. */
  size?: number;
  /** Required. Drives both screen-reader text and the visible tooltip. */
  'aria-label': string;
  /** Optional override for visible tooltip text only. SR text still uses aria-label. */
  tooltip?: ReactNode;
  /** Default true. Set false to suppress tooltip (e.g., when wrapper already has one). */
  showTooltip?: boolean;
  /** Default 'top'. Auto-flips on viewport collision. */
  tooltipPlacement?: TooltipPlacement;
  disabled?: boolean;
  /** Default 'button'. */
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  /** REPLACES (not appends) the built-in classes. Pass the full layout you want. */
  className?: string;
}

// Variant → text-color chain. `text-[color:var(...)]` carries the explicit
// `color:` type hint required by Tailwind v4 for ambiguous text-[var(...)] utilities.
// `:disabled` arrives via the disabled attribute and the disabled:* utility on
// the root class string, so per-variant chains do not need a disabled rule.
const VARIANT_COLOR_CLASSES: Record<IconLinkVariant, string> = {
  basic:
    'text-[color:var(--icon-link-basic-default)] hover:text-[color:var(--icon-link-basic-hover)] active:text-[color:var(--icon-link-basic-clicked)]',
  danger:
    'text-[color:var(--icon-link-danger-default)] hover:text-[color:var(--icon-link-danger-hover)] active:text-[color:var(--icon-link-danger-clicked)]',
  'danger-subtle':
    'text-[color:var(--icon-link-danger-subtle-default)] hover:text-[color:var(--icon-link-danger-subtle-hover)] active:text-[color:var(--icon-link-danger-subtle-clicked)]',
  subtle:
    'text-[color:var(--icon-link-subtle-default)] hover:text-[color:var(--icon-link-subtle-hover)] active:text-[color:var(--icon-link-subtle-clicked)]',
  default:
    'text-[color:var(--icon-link-default-default)] hover:text-[color:var(--icon-link-default-hover)] active:text-[color:var(--icon-link-default-clicked)]',
  success:
    'text-[color:var(--icon-link-success-default)] hover:text-[color:var(--icon-link-success-hover)] active:text-[color:var(--icon-link-success-clicked)]',
  close:
    'text-[color:var(--icon-link-close-default)] hover:text-[color:var(--icon-link-close-hover)] active:text-[color:var(--icon-link-close-clicked)]',
};

const ROOT_BASE_CLASSES =
  'inline-flex items-center justify-center shrink-0 rounded-[var(--radius-120)] ' +
  'cursor-pointer transition-colors duration-150 ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--button-primary-default-fill)] ' +
  'disabled:cursor-not-allowed disabled:text-[color:var(--icon-link-disabled)]';

/**
 * IconLink — Figma: Icon Button (363:307).
 *
 * Single canonical icon-only press target. Tooltip-on-hover sourced from
 * `aria-label` (single source of truth for SR + visible label). `<button>`
 * wrapped in `<TooltipTrigger>`, with pure pseudo-class state styling.
 */
export const IconLink = ({
  icon,
  variant = 'basic',
  size,
  'aria-label': ariaLabel,
  tooltip,
  showTooltip = true,
  tooltipPlacement = 'top',
  disabled = false,
  type = 'button',
  onClick,
  className,
}: IconLinkProps) => {
  const resolvedSize = size ?? (variant === 'close' ? 21 : 17);
  // Disabled drops the variant hover/active chain entirely so the disabled
  // text color always wins — `:hover` can still fire on a disabled <button>
  // in some browsers, and class-string order isn't a reliable override
  // (see feedback_tailwind_class_order.md).
  const variantClasses = disabled ? '' : VARIANT_COLOR_CLASSES[variant];
  const rootClass = className || `${ROOT_BASE_CLASSES} ${variantClasses}`.trim();

  return (
    <TooltipTrigger
      content={tooltip ?? ariaLabel}
      placement={tooltipPlacement}
      enabled={showTooltip}
    >
      <button
        type={type}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={onClick}
        className={rootClass}
      >
        <Icon name={icon} size={resolvedSize} />
      </button>
    </TooltipTrigger>
  );
};
