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
 * makes the wrapping cell carry the p-12 padding (`Inset Table Row -
 * Expandable` outer is `flex items-center p-12`); the toggle itself
 * is just the 21px icon with no inner padding. Adding p-12 here
 * doubles up with the cell wrapper and inflates row height to 69px
 * instead of the Figma 45px.
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
        // No inner padding — the wrapping TableCell provides p-12 per
        // Figma 756:377. The icon clicks directly via the 21x21 hit
        // area; the cell's full padded box still receives the click.
        'border-none bg-transparent cursor-pointer',
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
