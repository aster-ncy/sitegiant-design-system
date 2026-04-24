import type { ReactNode } from 'react';
import { Icon } from '../Icon';

export type TopBarContainer = 'full' | 'lg' | 'md' | 'sm';

export interface TopBarProps {
  /**
   * Controls the horizontal padding to match the Figma topbar variants.
   * Figma: Fullwidth = 32px, Large = 144px, Medium = 320px, Small = 384px.
   * Mobile layouts should pass `full` and use their own parent width.
   */
  container?: TopBarContainer;
  /** Left-aligned content (e.g. `<TopBar.Back ...>`, logo, breadcrumbs). */
  left?: ReactNode;
  /** Center-aligned content (e.g. segmented tabs). */
  center?: ReactNode;
  /** Right-aligned content (button group, user menu, etc.). */
  right?: ReactNode;
  className?: string;
  children?: ReactNode;
}

/* Figma specifies these as outer paddings on a fixed 1440-wide frame:
 *   Fullwidth = 32px  → content band 1376px
 *   Large     = 144px → content band 1152px
 *   Medium    = 320px → content band 800px
 *   Small     = 384px → content band 672px
 *
 * We model this as a max-width on a centred inner row so the topbar
 * reflows gracefully at any viewport width. `full` still needs a
 * gutter, so it gets its own padding rather than a max-width.
 */
const containerInnerClass: Record<TopBarContainer, string> = {
  full: 'px-[var(--spacing-32)]',
  lg: 'max-w-[1152px] mx-auto',
  md: 'max-w-[800px] mx-auto',
  sm: 'max-w-[672px] mx-auto',
};

/**
 * Product chrome top bar. Renders a 56-pixel-tall surface with the
 * topbar fill token, a one-pixel inset border at the bottom, and three
 * content slots (left / center / right). If `children` is provided the
 * slots are ignored and the children render directly — useful for the
 * Homepage variant that has a single absolutely-positioned cluster.
 *
 * Use `container` to pick the horizontal padding the Figma spec calls
 * out for each variant.
 */
export const TopBar = ({
  container = 'full',
  left,
  center,
  right,
  className = '',
  children,
}: TopBarProps) => {
  const innerCls = containerInnerClass[container];
  return (
    <div
      className={[
        // Figma spec: h-14 (56px) + py-3 (12px top/bottom). We rely on
        // `min-h-14` + `py-3` so the bar never collapses below 56px but
        // content (33px buttons) can still breathe without overflowing
        // the content-box.
        'relative w-full min-h-[56px]',
        'py-[var(--spacing-12)]',
        'bg-[var(--color-navigator-topbar-fill)]',
        'shadow-[inset_0_-1px_0_0_var(--color-navigator-border)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={[
          'w-full flex items-center',
          children ? '' : 'justify-between',
          innerCls,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children ? (
          children
        ) : (
          <>
            <div className="flex items-center gap-[var(--spacing-12)]">{left}</div>
            {center !== undefined && (
              <div className="flex items-center">{center}</div>
            )}
            <div className="flex items-center justify-end gap-[var(--spacing-16)]">
              {right}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ── TopBar.Back ────────────────────────────────────────────
 * Back arrow + page title cluster used on all Inner Page and
 * Webstore Builder variants.
 */
export interface TopBarBackProps {
  /** Page title. Omit on webstore-builder (back arrow only). */
  title?: string;
  /** Accessible label for the back button. */
  backLabel?: string;
  onBack?: () => void;
}

const TopBarBack = ({
  title,
  backLabel = 'Go back',
  onBack,
}: TopBarBackProps) => (
  <>
    {/* Figma: w-7 h-7 (28px) flex-centered wrapper with a 29px arrow-left
     * SVG that overflows slightly. The wrapper is a plain hitbox, not an
     * IconButton — IconButton pads to 33px and shrinks the visible arrow. */}
    <button
      type="button"
      onClick={onBack}
      aria-label={backLabel}
      className={[
        'size-[28px] inline-flex items-center justify-center shrink-0',
        'text-[color:var(--color-navigator-topbar-icon)]',
        'transition-colors duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        'focus-visible:ring-[var(--button-primary-default-fill)] focus-visible:rounded-[var(--radius-120)]',
      ].join(' ')}
    >
      <Icon name="arrow-left" size={29} />
    </button>
    {title && (
      <span
        className={[
          'text-[color:var(--color-navigator-topbar-text)]',
          'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
          'text-[length:var(--text-20)] leading-[var(--leading-24)]',
        ].join(' ')}
      >
        {title}
      </span>
    )}
  </>
);

TopBar.Back = TopBarBack;
