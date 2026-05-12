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
 * Compact chevron control for expanding or collapsing an inset table row.
 *
 * Use it inside `TableCell`, usually in the trailing cell of an expandable
 * inset row.
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
        // No inner padding: the wrapping TableCell owns row spacing per
        // Figma 756:377. min-w/h-24 keeps the click target WCAG 2.5.5
        // compliant (24x24) without reintroducing the spacing-12
        // double-padding that inflated rows to 69px.
        'min-w-[24px] min-h-[24px] border-none bg-transparent cursor-pointer',
        // Keyboard focus ring: outline-none drops the default browser
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
