import { Icon } from '../Icon';
import type { ReactNode } from 'react';

export type TableHeaderCellType = 'default' | 'icon';
export type TableColumnPosition = 'first' | 'center' | 'last';
export type TableTextAlignment = 'left' | 'center' | 'right';

export interface TableHeaderCellProps {
  /** Cell type — 'default' (text + optional sort) or 'icon' (icon-only). */
  type?: TableHeaderCellType;
  /**
   * Inset variant — compact padding, light-grey fill, rounded leading
   * corner, no bottom divider. Use inside cards / containers.
   */
  inset?: boolean;
  /** Column position — controls left/right padding. */
  column?: TableColumnPosition;
  /** Text alignment within the cell. */
  align?: TableTextAlignment;
  /** Header label. Ignored when `type='icon'`. */
  label?: ReactNode;
  /** Show the sort indicator (menu-swap icon) next to the label. */
  sortable?: boolean;
  /** Current sort direction; null/undefined when neutral. */
  sortDirection?: 'asc' | 'desc' | null;
  /** Fired when the cell's sort affordance is clicked. */
  onSort?: () => void;
  /** Optional checkbox slot (e.g. the row-select-all checkbox in column 1). */
  checkbox?: ReactNode;
  /** Show a small warning hint with count + label below the title. */
  hint?: { count?: number | string; label: string };
  /** Disabled state — mutes text + disables sort click. */
  disabled?: boolean;
  /** Extra classes on the root cell. */
  className?: string;
  /** When `type='icon'`, the icon name to render (e.g. 'menu-swap'). */
  icon?: string;
  /** Aria label for icon-only cells. */
  iconAriaLabel?: string;
}

const columnPaddingX: Record<TableColumnPosition, string> = {
  first: 'pl-[var(--spacing-24)] pr-[var(--spacing-12)]',
  center: 'px-[var(--spacing-12)]',
  last: 'pl-[var(--spacing-12)] pr-[var(--spacing-24)]',
};

const textAlignmentClass: Record<TableTextAlignment, string> = {
  left: 'justify-start text-left',
  center: 'justify-center text-center',
  right: 'justify-end text-right',
};

/**
 * TableHeaderCell — Figma: Table Header (954:735).
 *
 * Single column-header cell for use inside a `<th>`. Matches the
 * 12px/17px Roboto Regular header styling, asymmetric column padding
 * (first column pl-24, last column pr-24, center px-12), and optional
 * sort indicator + warning hint.
 *
 * Composition: render a row of `<th>` elements, place a TableHeaderCell
 * inside each. Use `column='first'` on the leftmost, `column='last'`
 * on the rightmost, `column='center'` on the rest.
 */
export const TableHeaderCell = ({
  type = 'default',
  inset = false,
  column = 'center',
  align = 'left',
  label,
  sortable = false,
  sortDirection,
  onSort,
  checkbox,
  hint,
  disabled = false,
  className = '',
  icon = 'menu-swap',
  iconAriaLabel,
}: TableHeaderCellProps) => {
  // Inset variant: compact, grey fill, rounded leading corner on the
  // first column, no bottom divider. Default variant: white fill, full
  // padding, bottom inset-shadow border.
  const insetCornerClass = inset && column === 'first' ? 'rounded-l-[var(--radius-4)]' : '';
  const insetCornerLastClass = inset && column === 'last' ? 'rounded-r-[var(--radius-4)]' : '';

  const cellClasses = [
    // `flex` (not `inline-flex`) so the cell occupies the full width of
    // its <th> parent — otherwise the inset-shadow bottom border would
    // only paint under the inner content and look like an underline.
    'relative flex items-center gap-[var(--spacing-12)]',
    'min-w-[44px]',
    inset
      ? // Inset: pl-12 pr-6 py-8, no bottom divider, grey fill.
        `${column === 'first' ? 'pl-[var(--spacing-12)]' : 'pl-[var(--spacing-12)]'} pr-[var(--spacing-6)] py-[var(--spacing-8)]`
      : `${columnPaddingX[column]} py-[var(--spacing-20)]`,
    inset
      ? 'bg-[var(--table-inset-header-fill)]'
      : 'bg-[var(--table-header-fill)]',
    inset
      ? ''
      : 'shadow-[inset_0_-1px_0_0_var(--table-divider-last-border)]',
    insetCornerClass,
    insetCornerLastClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const titleColor = disabled
    ? 'text-[color:var(--table-header-disabled-text)]'
    : inset
      ? 'text-[color:var(--table-inset-header-text)]'
      : 'text-[color:var(--table-header-text)]';

  // Icon color follows the variant — inset headers use the inset icon
  // token so sort + icon-only triggers match the rest of the inset
  // header styling.
  const iconColorClass = disabled
    ? 'text-[color:var(--table-header-disabled-text)]'
    : inset
      ? 'text-[color:var(--table-inset-header-icon)]'
      : 'text-[color:var(--table-header-icon)]';

  const titleClasses = [
    'inline-flex items-center gap-[var(--spacing-2)]',
    'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
    'text-[length:var(--table-header-size)] leading-[var(--table-header-lineheight)]',
    titleColor,
    textAlignmentClass[align],
  ].join(' ');

  // Icon-only variant — used for last-column action triggers.
  if (type === 'icon') {
    return (
      <div className={cellClasses}>
        <button
          type="button"
          onClick={disabled ? undefined : onSort}
          disabled={disabled}
          aria-label={iconAriaLabel ?? icon}
          className={[
            'inline-flex items-center justify-center shrink-0',
            'border-none outline-none bg-transparent',
            disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
          ].join(' ')}
        >
          <Icon
            name={icon as Parameters<typeof Icon>[0]['name']}
            size={17}
            className={iconColorClass}
          />
        </button>
      </div>
    );
  }

  // Default text variant.
  const sortIcon = sortable
    ? sortDirection === 'asc'
      ? 'arrow-up'
      : sortDirection === 'desc'
        ? 'arrow-down'
        : 'menu-swap'
    : null;

  return (
    <div className={cellClasses}>
      {checkbox && <span className="shrink-0">{checkbox}</span>}
      <div
        className={[
          'inline-flex items-center gap-[var(--spacing-4)] min-w-0 flex-1',
          textAlignmentClass[align],
        ].join(' ')}
      >
        <button
          type="button"
          onClick={sortable && !disabled ? onSort : undefined}
          disabled={disabled || !sortable}
          // Note: `aria-sort` is intentionally NOT set here. ARIA exposes
          // sort state on the columnheader (the surrounding <th>), not
          // on the click target. Callers should set it on the <th>:
          //   <th aria-sort={sortDirectionToAria(sortDirection)}>
          //     <TableHeaderCell sortable sortDirection={sortDirection} ... />
          //   </th>
          className={[
            titleClasses,
            'border-none outline-none bg-transparent p-0',
            sortable && !disabled ? 'cursor-pointer' : 'cursor-default',
            // Stretch the button so click targets fill the cell horizontally.
            align === 'right' ? 'flex-row-reverse' : '',
            'min-w-0',
          ].filter(Boolean).join(' ')}
        >
          <span className="truncate">{label}</span>
          {sortIcon && (
            <Icon
              name={sortIcon as Parameters<typeof Icon>[0]['name']}
              size={17}
              className={['shrink-0', iconColorClass].join(' ')}
            />
          )}
        </button>
        {hint && (
          <span className="inline-flex items-center gap-[var(--spacing-2)] py-[var(--spacing-1)] shrink-0">
            <Icon
              name="alert-triangle"
              size={15}
              className="text-[color:var(--color-sys-red-DEFAULT)] shrink-0"
            />
            {hint.count !== undefined && (
              <span
                className={[
                  'text-[length:var(--text-12)] leading-[15px]',
                  'font-[family-name:var(--font-sans)] font-[var(--font-weight-medium)]',
                  'text-[color:var(--color-sys-red-DEFAULT)]',
                ].join(' ')}
              >
                {hint.count}
              </span>
            )}
            <span
              className={[
                'text-[length:var(--text-12)] leading-[15px]',
                'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
                'text-[color:var(--color-sys-red-DEFAULT)] whitespace-nowrap',
              ].join(' ')}
            >
              {hint.label}
            </span>
          </span>
        )}
      </div>
    </div>
  );
};
