export type SidebarTagVariant = 'hot' | 'new';

export interface SidebarTagProps {
  /** Label text shown inside the tag. Defaults to "Hot". */
  label?: string;
  /**
   * Colour variant. `hot` = red gradient (default), `new` = blue
   * gradient. Variant is explicit so callers can pick a style
   * independent of the label text.
   */
  variant?: SidebarTagVariant;
  className?: string;
}

/**
 * Small promotional tag shown inline with a sidebar label (e.g. "Hot",
 * "New"). Asymmetric corner radii, subtle drop shadow, white border.
 * Figma node: 1501:4774 (Hot) / the "New" variant of the same symbol.
 *
 * Gradient stops live as tokens so themes and variants stay
 * token-driven — no raw hex in the component.
 */
export const SidebarTag = ({
  label = 'Hot',
  variant = 'hot',
  className = '',
}: SidebarTagProps) => {
  const gradient =
    variant === 'new'
      ? 'from-[var(--app-tag-new-fill-start)] to-[var(--app-tag-new-fill-end)]'
      : 'from-[var(--color-sidebar-hot-tag-from)] to-[var(--color-sidebar-hot-tag-to)]';

  return (
    <span
      className={[
        'inline-flex items-center shrink-0',
        'px-[var(--spacing-4)] py-[1.5px]',
        // Asymmetric radii: top-left & top-right 8/12, bottom-right 12,
        // bottom-left square — matches Figma's "tag tail" silhouette.
        'rounded-tl-[var(--radius-8)] rounded-tr-[var(--radius-12)] rounded-br-[var(--radius-12)]',
        'border border-[color:var(--color-sidebar-hot-tag-border)]',
        'bg-gradient-to-l',
        gradient,
        'shadow-[0_1px_6px_0_var(--color-overlay-16)]',
        'text-[color:var(--color-sidebar-hot-tag-text)]',
        'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
        'text-[length:var(--text-11)] leading-[var(--leading-12)]',
        'whitespace-nowrap',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </span>
  );
};
