import type { ReactNode } from 'react';
import { Icon, type IconName } from '../Icon';

export type SidebarItemTheme = 'default' | 'premium';
export type SidebarItemState = 'default' | 'hover' | 'focus';
/**
 * `main`    — parent-level row (Figma "Main", 14/16 text, icon + label).
 * `submenu` — child row under an expanded parent (13/15 text, 40px indent,
 *             no icon). Used by the atom at Figma 520:463.
 */
export type SidebarItemVariant = 'main' | 'submenu';

export interface SidebarItemProps {
  label: string;
  variant?: SidebarItemVariant;
  theme?: SidebarItemTheme;
  /** Force a visual state. Usually left alone; CSS handles hover. */
  state?: SidebarItemState;
  /** Leading icon shown before the label. `main` variant only. */
  leadingIcon?: IconName;
  /** Trailing icon shown after the label (e.g. `eye`). `main` variant only. */
  trailingIcon?: IconName;
  /** Show a chevron-down on the right. Mutually exclusive with `trailingIcon`. */
  showChevron?: boolean;
  /** Promotional tag slot (e.g. `<SidebarTag />`). */
  tag?: ReactNode;
  /**
   * Collapse the row into the 44px icon-only rail. Only meaningful on
   * `main`; submenu items aren't shown in collapse mode (per Figma).
   */
  collapsed?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Sidebar navigation row used for both parent ("Main") and child
 * ("Submenu") positions. Switches typography and padding via the
 * `variant` prop so parents and children stay a single component.
 *
 * Figma sources:
 *   - Parent atom (expand): 415:503
 *   - Parent atom (collapse): 546:5528
 *   - Submenu atom:          520:463
 *
 * Layout rules (all from Figma):
 *   main · expand    → w-208, h-32, px-16 py-8, 14/16 text, 16×16 icon slot
 *   main · collapse  → w-44,  h-32, px-12 py-8, icon-only
 *   submenu           → w-208, pl-40 pr-16 py-6, 13/15 text, no icon slot
 *
 * The focus state flips font-weight to bold in both variants. Premium
 * theme's focus also paints an inset 4px left bar in the premium focus
 * colour.
 */
export const SidebarItem = ({
  label,
  variant = 'main',
  theme = 'default',
  state = 'default',
  leadingIcon,
  trailingIcon,
  showChevron = false,
  tag,
  collapsed = false,
  onClick,
  className = '',
}: SidebarItemProps) => {
  const isPremium = theme === 'premium';
  const isHover = state === 'hover';
  const isFocus = state === 'focus';
  const isSubmenu = variant === 'submenu';
  // Submenu rows can never collapse (Figma spec: collapse mode hides
  // all children). Enforce here so the caller can't produce a broken
  // combination.
  const isCollapsed = collapsed && !isSubmenu;

  /* ── Colours ───────────────────────────────────────────── */
  const fillCls = (() => {
    if (isPremium) {
      // Premium theme default is transparent so the sidebar container
      // paints the teal behind it. Hover/focus tint it.
      if (isHover || isFocus) {
        return 'bg-[var(--color-navigator-sidebar-premium-hover-fill)]';
      }
      return '';
    }
    if (isHover) return 'bg-[var(--color-navigator-sidebar-hover-fill)]';
    if (isFocus) return 'bg-[var(--color-navigator-sidebar-focus-fill)]';
    return 'bg-[var(--color-navigator-sidebar-fill)]';
  })();

  const textColorCls = (() => {
    if (isPremium) {
      if (isHover) return 'text-[color:var(--color-navigator-sidebar-premium-text-hover)]';
      if (isFocus) return 'text-[color:var(--color-navigator-sidebar-premium-text-focus)]';
      return 'text-[color:var(--color-navigator-sidebar-premium-text-default)]';
    }
    if (isHover) return 'text-[color:var(--color-navigator-sidebar-text-hover)]';
    if (isFocus) return 'text-[color:var(--color-navigator-sidebar-text-focus)]';
    return 'text-[color:var(--color-navigator-sidebar-text-default)]';
  })();

  const iconColor = (() => {
    if (isPremium) {
      if (isHover) return 'var(--color-navigator-sidebar-premium-icon-hover)';
      if (isFocus) return 'var(--color-navigator-sidebar-premium-icon-focus)';
      return 'var(--color-navigator-sidebar-premium-icon-default)';
    }
    if (isHover) return 'var(--color-navigator-sidebar-icon-hover)';
    if (isFocus) return 'var(--color-navigator-sidebar-icon-focus)';
    return 'var(--color-navigator-sidebar-icon-default)';
  })();

  const fontWeightCls = isFocus
    ? 'font-[var(--font-weight-bold)]'
    : 'font-[var(--font-weight-regular)]';

  /* ── Typography per variant ───────────────────────────── */
  const typographyCls = isSubmenu
    ? 'text-[length:var(--text-13)] leading-[var(--leading-15)]'
    : 'text-[length:var(--text-14)] leading-[var(--leading-16)]';

  /* ── Root sizing + padding ────────────────────────────── */
  const rootSizing = (() => {
    if (isSubmenu) return 'w-[208px]';
    // Height comes from the content (py-8 + line-height-16 = 32px) so
    // the content-box has room to render text without clipping.
    // Hardcoding h-[32px] zeroed the content box and clipped descenders.
    // Collapse rows keep the same 32px rhythm as expand rows so modes
    // stay visually consistent — only the label goes missing, not the
    // row dimensions.
    if (isCollapsed) return 'w-[44px] min-h-[32px]';
    return 'w-[208px] min-h-[32px]';
  })();

  const contentPadding = (() => {
    if (isSubmenu) return 'pl-[var(--spacing-40)] pr-[var(--spacing-16)] py-[var(--spacing-6)]';
    if (isCollapsed) return 'px-[var(--spacing-12)] py-[var(--spacing-8)]';
    return 'px-[var(--spacing-16)] py-[var(--spacing-8)]';
  })();

  /* ── Inner row ────────────────────────────────────────── */
  const inner = isCollapsed ? (
    <div className={['flex flex-1 items-center', contentPadding, fillCls].filter(Boolean).join(' ')}>
      {/* 16px icon — same size as the expand row so modes stay visually
       * consistent. Rendering inside a fixed 16x16 box so icons whose
       * paths under-fill their 24x24 viewBox still centre in the same
       * visual slot — prevents the vertical-size inconsistency you
       * otherwise see row-to-row when raw path extents differ. */}
      <div className="flex flex-1 items-center justify-center">
        {leadingIcon && (
          <span className="inline-flex size-[16px] items-center justify-center shrink-0">
            <Icon name={leadingIcon} size={16} color={iconColor} />
          </span>
        )}
      </div>
    </div>
  ) : (
    <div
      className={[
        'flex flex-1 items-center overflow-hidden',
        contentPadding,
        fillCls,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex flex-1 items-center gap-[var(--spacing-8)] min-w-px">
        {!isSubmenu && leadingIcon && (
          <span className="inline-flex shrink-0 size-[16px] items-center justify-center">
            <Icon name={leadingIcon} size={16} color={iconColor} />
          </span>
        )}
        {/* Label + tag cluster. `flex-1` lives on the wrapper (not the
            label) so the tag sits flush against the end of the label
            text, not pushed to the far right by a greedy label box. */}
        <div className="flex flex-1 items-center gap-[var(--spacing-4)] min-w-px">
          <span
            className={[
              'min-w-0 text-left',
              'font-[family-name:var(--font-sans)]',
              fontWeightCls,
              typographyCls,
              textColorCls,
              tag ? 'truncate' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {label}
          </span>
          {tag}
        </div>
      </div>
      {/* Trailing slot: explicit icon wins; chevron is the fallback for
          "Menu with Submenu" rows. */}
      {!isSubmenu && trailingIcon && (
        <span className="inline-flex shrink-0 size-[16px] items-center justify-center">
          <Icon name={trailingIcon} size={16} color={iconColor} />
        </span>
      )}
      {!isSubmenu && !trailingIcon && showChevron && (
        <span className="inline-flex shrink-0 size-[16px] items-center justify-center">
          <Icon name="chevron-down" size={16} color={iconColor} />
        </span>
      )}
    </div>
  );

  /* ── Premium focus indicator ─────────────────────────── */
  const focusIndicator =
    isPremium && isFocus ? (
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none shadow-[inset_4px_0_0_0_var(--color-navigator-sidebar-premium-focus-fill)]"
      />
    ) : null;

  const rootCls = [
    'relative flex items-center overflow-hidden',
    rootSizing,
    onClick ? 'cursor-pointer' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-current={isFocus ? 'page' : undefined}
        aria-label={isCollapsed ? label : undefined}
        className={rootCls}
      >
        {inner}
        {focusIndicator}
      </button>
    );
  }

  return (
    <div className={rootCls}>
      {inner}
      {focusIndicator}
    </div>
  );
};
