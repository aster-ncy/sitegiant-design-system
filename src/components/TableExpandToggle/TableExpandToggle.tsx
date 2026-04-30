import { Icon } from '../Icon';

export interface TableExpandToggleProps {
  /** Whether the row is currently expanded. */
  expanded: boolean;
  /** Toggle handler. */
  onToggle?: (next: boolean) => void;
  /** Optional aria-controls value for the row's expandable region id. */
  ariaControls?: string;
  className?: string;
}

/**
 * TableExpandToggle — Figma: Inset Table Row - Expandable (756:377).
 *
 * Borderless 21px chevron-up / chevron-down toggle for expanding a
 * sub-row inside a `TableCell` (typically in the last column). Figma
 * defines no boxed/bordered variant — the toggle is just an icon
 * sitting in its own cell with `p-12` padding handled by the
 * surrounding `<TableCell>` wrapper.
 *
 * Always blue (`--color-sys-blue-DEFAULT`). Per product convention,
 * there is no disabled state — if a row is not expandable, omit the
 * toggle entirely rather than rendering a disabled chevron.
 */
export const TableExpandToggle = ({
  expanded,
  onToggle,
  ariaControls,
  className = '',
}: TableExpandToggleProps) => {
  return (
    <button
      type="button"
      onClick={() => onToggle?.(!expanded)}
      aria-expanded={expanded}
      aria-controls={ariaControls}
      aria-label={expanded ? 'Collapse row' : 'Expand row'}
      className={[
        'inline-flex items-center justify-center shrink-0',
        // p-12 matches Figma's wrapping cell padding so this button can
        // be dropped directly into a layout without a TableCell wrapper
        // when needed (the wrapping TableCell would render p-12 too;
        // padding here is harmless because the icon stays centered).
        'border-none bg-transparent p-[var(--spacing-12)] cursor-pointer',
        // Keyboard focus ring — outline:none drops the default browser
        // ring, so we paint our own visible focus indicator.
        'outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[color:var(--color-sys-blue-DEFAULT)] rounded-[var(--radius-2)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Icon
        name={expanded ? 'chevron-up' : 'chevron-down'}
        size={21}
        className="text-[color:var(--color-sys-blue-DEFAULT)]"
      />
    </button>
  );
};
