import type { ReactNode } from 'react';
import { Logo } from '../Logo';
import { Icon, type IconName } from '../Icon';

export type SidebarMode = 'expand' | 'collapse';
export type SidebarTheme = 'default' | 'premium';

export interface SidebarProps {
  /** `expand` = 208px rail with labels, `collapse` = 44px icon-only rail. */
  mode?: SidebarMode;
  /** Colour scheme. `premium` paints the teal sidebar-premium-fill behind everything. */
  theme?: SidebarTheme;
  /** Fires when the user clicks the hamburger toggle in the header. */
  onToggle?: () => void;
  /** Optional footer content — typically `<Sidebar.Footer>`. */
  footer?: ReactNode;
  /** Nav list — usually a sequence of `<SidebarItem>` and `<Sidebar.Section>`. */
  children?: ReactNode;
  className?: string;
}

/**
 * Full sidebar navigator chrome: logo header, scrollable nav list, and
 * a bottom footer row. Content composition is left to the caller (pass
 * `<SidebarItem>`s and `<Sidebar.Section>`s as children) so the
 * Sidebar doesn't impose a data schema on product screens.
 *
 * Figma source: [Library] SiteGiant ERP, node 624:2614.
 */
export const Sidebar = ({
  mode = 'expand',
  theme = 'default',
  onToggle,
  footer,
  children,
  className = '',
}: SidebarProps) => {
  const isPremium = theme === 'premium';
  const isCollapsed = mode === 'collapse';

  /* ── Root chrome ──────────────────────────────────────── */
  // Widths inlined so Tailwind's JIT scanner sees the literal class
  // names. Module-level constants (e.g. `const W = 'w-[214px]'`) hide
  // the class from the scanner and compile nothing, leaving the rail
  // with no width.
  //
  // Expand rail:   208px nav-item column + 6px reserved scrollbar = 214px.
  // Collapse rail: 44px icon column. Scrollbar overlays here (no
  //                reserved gutter) because Chrome clamps ::-webkit-
  //                scrollbar to a ~5-6px minimum which would eat the
  //                icon column; overlaying lets the icon sit at its
  //                intended size and only shows a scrollbar on scroll.
  const rootCls = [
    'relative self-stretch flex flex-col shrink-0',
    isCollapsed ? 'w-[44px]' : 'w-[214px]',
    // Premium rail is a gradient (background-image), default is a flat
    // fill (background-color). Using `[image:var(...)]` routes the
    // value to background-image so the gradient renders instead of
    // being ignored as an invalid background-color.
    isPremium
      ? 'bg-[image:var(--color-navigator-sidebar-premium-fill)]'
      : 'bg-[var(--color-navigator-sidebar-fill)]',
    // Right-side divider separating the sidebar from page content.
    'border-r border-[color:var(--color-navigator-border)]',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav aria-label="Primary" className={rootCls}>
      <SidebarHeader
        mode={mode}
        theme={theme}
        onToggle={onToggle}
      />

      {/* Scrollable nav list. flex-1 absorbs the remaining height; the
          footer stays pinned to the bottom. overflow-x is hidden so the
          208px items never induce horizontal scroll from subpixel bleed. */}
      <div
        className={[
          'flex-1 min-h-0 overflow-y-auto overflow-x-hidden',
          'flex flex-col',
          // Slim, gutter-stable scrollbar. Premium variant darkens the
          // track; compact variant narrows it to 3px for the 44px
          // collapse rail so the icon isn't visually compressed.
          'sidebar-scroll',
          isPremium ? 'sidebar-scroll-premium' : '',
          isCollapsed ? 'sidebar-scroll-compact' : '',
          // In collapse mode, items centre within the 44px rail.
          isCollapsed ? 'items-center' : '',
          // Small vertical breathing at the top of the list.
          'pt-[var(--spacing-8)]',
          // 64px of extra room below the last item so it never sits
          // flush against the footer when the list overflows.
          'pb-[var(--spacing-64)]',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>

      {footer && (
        <div
          className={[
            // 1px inset top line matching Figma's navigator divider.
            'shrink-0 border-t border-[color:var(--color-navigator-border)]',
          ].join(' ')}
        >
          {footer}
        </div>
      )}
    </nav>
  );
};

/* ── Sidebar.Header ─────────────────────────────────────── */

interface SidebarHeaderProps {
  mode: SidebarMode;
  theme: SidebarTheme;
  onToggle?: () => void;
}

const SidebarHeader = ({ mode, theme, onToggle }: SidebarHeaderProps) => {
  const isCollapsed = mode === 'collapse';
  const isPremium = theme === 'premium';
  const logoBackground = isPremium ? 'dark' : 'light';

  // Expand: 56px tall, logo on the left, hamburger on the right.
  // Collapse: 44px tall, favicon centred, no hamburger (the whole
  // header becomes the toggle target).
  if (isCollapsed) {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-label="Expand sidebar"
        className={[
          // Figma: header flows into the nav list without a divider.
          // Padding gives the favicon breathing room inside the 44px rail.
          'relative shrink-0 w-full h-[64px] flex items-center justify-center overflow-hidden',
          isPremium
            ? 'hover:bg-[var(--color-navigator-sidebar-premium-hover-fill)]'
            : 'hover:bg-[var(--color-navigator-sidebar-hover-fill)]',
          'transition-colors duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
          'focus-visible:ring-[var(--button-primary-default-fill)]',
        ].join(' ')}
      >
        <Logo
          mode="favicon"
          background={logoBackground}
          height={36}
          className="block max-h-[36px] w-auto"
        />
      </button>
    );
  }

  return (
    <div
      className={[
        // Figma: no border under the header — logo and nav flow together.
        // Wordmark is ~42px tall, so the header needs room (64px) for a
        // ~10px padded logo.
        'relative shrink-0 w-full h-[64px] flex items-center justify-between overflow-hidden',
        'pl-[var(--spacing-16)] pr-[var(--spacing-8)]',
      ].join(' ')}
    >
      <Logo
        background={logoBackground}
        height={42}
        className="block max-h-[42px] w-auto shrink-0"
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label="Toggle sidebar"
        className={[
          'inline-flex items-center justify-center shrink-0',
          'size-[33px] rounded-[var(--radius-120)]',
          isPremium
            ? 'text-[color:var(--color-navigator-sidebar-premium-icon-default)] hover:bg-[var(--color-navigator-sidebar-premium-hover-fill)]'
            : 'text-[color:var(--color-navigator-sidebar-icon-default)] hover:bg-[var(--color-navigator-sidebar-hover-fill)] hover:text-[color:var(--color-navigator-sidebar-icon-hover)]',
          'transition-colors duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
          'focus-visible:ring-[var(--button-primary-default-fill)]',
        ].join(' ')}
      >
        <Icon name="menu" size={17} />
      </button>
    </div>
  );
};

/* ── Sidebar.Section ────────────────────────────────────── */

export interface SidebarSectionProps {
  /** Section label shown in expand mode (e.g. "CHANNELS"). */
  label: string;
  /** Optional trailing action icon (e.g. a `plus-circle`). */
  action?: {
    icon: IconName;
    label: string;
    onClick?: () => void;
  };
  /** Passed down from the rendering context. Stories set it via the
   * `<Sidebar>` parent through context in the future; for now we
   * inspect a data attribute set by the sidebar. Keep as explicit prop
   * so callers can mix sections with sidebars that don't provide ctx. */
  mode?: SidebarMode;
  theme?: SidebarTheme;
  className?: string;
}

/**
 * Section header row used between nav item groups. In expand mode it
 * renders the label + optional trailing action button. In collapse
 * mode it collapses to a 1px divider line so the rail stays icon-only.
 */
const SidebarSection = ({
  label,
  action,
  mode = 'expand',
  theme = 'default',
  className = '',
}: SidebarSectionProps) => {
  const isCollapsed = mode === 'collapse';
  const isPremium = theme === 'premium';

  if (isCollapsed) {
    // Per Figma: in collapse mode the section header becomes a blank
    // 48px gap between icon groups (no divider line). Labelled as a
    // separator for assistive tech so the grouping still communicates.
    return (
      <div
        role="separator"
        aria-label={label}
        className={[
          'shrink-0 self-stretch h-[48px]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />
    );
  }

  const labelColor = isPremium
    ? 'text-[color:var(--color-navigator-sidebar-premium-text-default)]'
    : 'text-[color:var(--color-navigator-sidebar-text-focus)]';

  const actionIconColor = isPremium
    ? 'var(--color-navigator-sidebar-premium-icon-default)'
    : 'var(--color-icon-success)';

  return (
    <div
      className={[
        // Fixed row height so header slots next to nav items cleanly.
        // items-center on a 32px row centres geometric middles — the
        // label's *visual* centre (uppercase cap-height midpoint) sits
        // higher than its line-box centre. Bumping the label's
        // line-height to the full row height realigns its visual
        // centre with the 24px icon button beside it.
        //
        // `pr-12` on a 24x24 action button places the icon's centre at
        // x=184 from the left of the 208px rail — same X as trailing
        // icons (eye, chevron) on nav rows, so all right-side glyphs
        // align on one vertical line.
        'flex items-center w-[208px] h-[32px]',
        'pl-[var(--spacing-16)] pr-[var(--spacing-12)]',
        'mt-[var(--spacing-8)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span
        className={[
          'flex-1 min-w-px truncate',
          'font-[family-name:var(--font-sans)] font-[var(--font-weight-medium)]',
          // Line-height matches the row so uppercase caps centre against
          // the action icon. (Was 12px — left caps floating high.)
          'text-[length:var(--text-11)] leading-[32px]',
          // Section labels use uppercase tracking per Figma ("CHANNELS").
          'uppercase tracking-wide',
          labelColor,
        ].join(' ')}
      >
        {label}
      </span>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          aria-label={action.label}
          className={[
            'inline-flex items-center justify-center shrink-0',
            'size-[24px] rounded-[var(--radius-120)]',
            isPremium
              ? 'hover:bg-[var(--color-navigator-sidebar-premium-hover-fill)]'
              : 'hover:bg-[var(--color-navigator-sidebar-hover-fill)]',
            'transition-colors duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
            'focus-visible:ring-[var(--button-primary-default-fill)]',
          ].join(' ')}
        >
          <Icon name={action.icon} size={16} color={actionIconColor} />
        </button>
      )}
    </div>
  );
};

/* ── Sidebar.Footer ─────────────────────────────────────── */

export interface SidebarFooterAction {
  icon: IconName;
  label: string;
  onClick?: () => void;
}

export interface SidebarFooterProps {
  actions: SidebarFooterAction[];
  mode?: SidebarMode;
  theme?: SidebarTheme;
  className?: string;
}

/**
 * Footer action rail. Shows a horizontal row of icon buttons in expand
 * mode (centred with `--spacing-20` between each, per Figma) and a
 * vertical stack in collapse mode so they fit the 44px rail.
 */
const SidebarFooter = ({
  actions,
  mode = 'expand',
  theme = 'default',
  className = '',
}: SidebarFooterProps) => {
  const isCollapsed = mode === 'collapse';
  const isPremium = theme === 'premium';

  const iconColor = isPremium
    ? 'var(--color-navigator-sidebar-premium-icon-default)'
    : 'var(--color-navigator-sidebar-icon-default)';

  const hoverTextColor = isPremium
    ? 'hover:text-[color:var(--color-navigator-sidebar-premium-icon-hover)]'
    : 'hover:text-[color:var(--color-navigator-sidebar-icon-hover)]';

  const hoverBg = isPremium
    ? 'hover:bg-[var(--color-navigator-sidebar-premium-hover-fill)]'
    : 'hover:bg-[var(--color-navigator-sidebar-hover-fill)]';

  return (
    <div
      className={[
        'flex items-center',
        // 12px top/bottom padding in both modes — the orange Figma
        // indicators (12 above, 12 below) represent the footer's
        // outer breathing room against the divider above and the
        // rail end below.
        'py-[var(--spacing-12)]',
        isCollapsed
          // Collapse: Figma spec per button is 44x32 (W Fill × H 32),
          // stacked vertically with no gap between buttons.
          ? 'flex-col justify-center w-[44px]'
          // Expand: actions spread across thirds of the 208px width,
          // matching Figma.
          : 'flex-row justify-around',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={action.onClick}
          aria-label={action.label}
          className={[
            'inline-flex items-center justify-center shrink-0',
            // Collapse: 44x32 per Figma auto-layout spec (W Fill × H 32).
            // Expand: 33x33 pill matches the nav icon-button convention.
            isCollapsed
              ? 'w-[44px] h-[32px]'
              : 'size-[33px] rounded-[var(--radius-120)]',
            hoverBg,
            hoverTextColor,
            'transition-colors duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
            'focus-visible:ring-[var(--button-primary-default-fill)]',
          ].join(' ')}
        >
          {/* Collapse footer uses the same 16px as nav icons for
           * visual consistency; expand keeps 20px so the footer
           * reads as a slightly heavier slot than the body rows. */}
          <Icon name={action.icon} size={isCollapsed ? 16 : 20} color={iconColor} />
        </button>
      ))}
    </div>
  );
};

/* Attach sub-components as static fields so callers can write
 * `<Sidebar.Section />` / `<Sidebar.Footer />` ergonomics. */
Sidebar.Section = SidebarSection;
Sidebar.Footer = SidebarFooter;
