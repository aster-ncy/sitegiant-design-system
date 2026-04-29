import { Icon } from '../Icon';

export interface TableExpandToggleProps {
  /** Whether the row is currently expanded. */
  expanded: boolean;
  /** Toggle handler. */
  onToggle?: (next: boolean) => void;
  /** Disable the toggle. */
  disabled?: boolean;
  /** Optional aria-controls value for the row's expandable region id. */
  ariaControls?: string;
  className?: string;
}

/**
 * TableExpandToggle — Figma: expand (756:377) and inset-row expandable
 * chevron (1854:14384). Small chevron-up / chevron-down toggle button
 * for use inside `TableCell` (typically in the first column) to
 * expand/collapse a sub-row.
 *
 * Renders blue-tinted chevron in the expand state and stroked chevron
 * in the collapsed state, matching the live ERP pattern.
 */
export const TableExpandToggle = ({
  expanded,
  onToggle,
  disabled = false,
  ariaControls,
  className = '',
}: TableExpandToggleProps) => {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : () => onToggle?.(!expanded)}
      disabled={disabled}
      aria-expanded={expanded}
      aria-controls={ariaControls}
      aria-label={expanded ? 'Collapse row' : 'Expand row'}
      className={[
        'inline-flex items-center justify-center shrink-0',
        'size-[24px] rounded-[var(--radius-2)]',
        'bg-[var(--table-body-fill)]',
        'border border-solid border-[var(--table-divider-border)]',
        'outline-none transition-colors duration-100',
        disabled
          ? 'cursor-not-allowed opacity-60'
          : 'cursor-pointer hover:bg-[var(--color-space-light)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Icon
        name={expanded ? 'chevron-up' : 'chevron-down'}
        size={17}
        className="text-[color:var(--color-sys-blue-DEFAULT)]"
      />
    </button>
  );
};
