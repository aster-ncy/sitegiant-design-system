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
  /**
   * Sub-header variant — used as the header band above sub-rows in an
   * expanded parent row (e.g. Sales Channel "Today Sales" → expand
   * "Shopee MY" → reveals "Store / Order / Total (RM)" band over the
   * store-level sub-rows). Implies `inset`. Same horizontal padding as
   * inset header (pl-12 pr-6) but uses the subrow grey fill, drops the
   * leading/trailing corner radii (sub-headers sit between rows, not
   * at table edges), and suppresses the sort affordance. Vertical
   * padding follows `subheaderMargin`.
   */
  subheader?: boolean;
  /**
   * Sub-header margin mode. Maps to Figma's "Margin" axis on Inset Table
   * Sub-row Header (node 969:1621):
   * - `'top'` (default): pt-8 with NO bottom padding. Use when the
   *   sub-header sits immediately above sub-row body cells — the
   *   sub-row's own py-6 provides the bottom breathing room and adding
   *   bottom padding here would double-space the gap.
   * - `'topBottom'`: py-8. Use when the band stands alone (e.g. last
   *   element of an expansion panel with no sub-rows directly below).
   * Has no effect unless `subheader` is true.
   */
  subheaderMargin?: 'top' | 'topBottom';
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
  /** Show a small warning hint with count + label next to the title. */
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

// Sub-row header column padding mirrors the sub-row body padding so
// header text and body content land on the same x-positions when the
// two are stacked. Verified per Figma:
//   first  (756:437):  pl-12 pr-6
//   center (756:463):  px-6
//   last   (756:447):  pl-6 pr-24
const subheaderColumnPaddingX: Record<TableColumnPosition, string> = {
  first: 'pl-[var(--spacing-12)] pr-[var(--spacing-6)]',
  center: 'px-[var(--spacing-6)]',
  last: 'pl-[var(--spacing-6)] pr-[var(--spacing-24)]',
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
  subheader = false,
  subheaderMargin = 'top',
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
  // Sub-header implies inset — sub-header bands only exist within inset
  // tables (above expanded parent-row sub-rows).
  const isInset = inset || subheader;
  // Sub-headers sit between body rows, not at the table's leading edge,
  // so they don't get the rounded corners that regular inset headers have.
  const insetCornerClass = isInset && !subheader && column === 'first' ? 'rounded-l-[var(--radius-4)]' : '';
  const insetCornerLastClass = isInset && !subheader && column === 'last' ? 'rounded-r-[var(--radius-4)]' : '';

  const fillClass = subheader
    ? 'bg-[var(--table-inset-subrow-fill)]'
    : isInset
      ? 'bg-[var(--table-inset-header-fill)]'
      : 'bg-[var(--table-header-fill)]';

  const cellClasses = [
    // `flex` (not `inline-flex`) so the cell occupies the full width of
    // its <th> parent — otherwise the inset-shadow bottom border would
    // only paint under the inner content and look like an underline.
    'relative flex items-center gap-[var(--spacing-12)]',
    'min-w-[44px]',
    subheader
      ? // Sub-row header: column-aware horizontal padding (mirrors the
        // sub-row body so header text aligns with body content), plus
        // vertical from the Margin axis:
        //   - 'top' (default, Figma 756:437): pt-8 only — sub-row's
        //     py-6 below provides the gap; adding pb here double-spaces.
        //   - 'topBottom' (Figma 2908:13399): py-8 — for standalone
        //     bands with no sub-row directly below.
        `${subheaderColumnPaddingX[column]} ${
          subheaderMargin === 'topBottom'
            ? 'py-[var(--spacing-8)]'
            : 'pt-[var(--spacing-8)]'
        }`
      : isInset
        ? // Inset header padding from Figma node 747:83: pl-12, pr-6, py-8.
          // The 6px right padding is deliberate — it pairs with the body
          // cell's 6px left padding for a 12px combined inter-column gutter.
          'pl-[var(--spacing-12)] pr-[var(--spacing-6)] py-[var(--spacing-8)]'
        : `${columnPaddingX[column]} py-[var(--spacing-20)]`,
    fillClass,
    isInset
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
    : isInset
      ? 'text-[color:var(--table-inset-header-text)]'
      : 'text-[color:var(--table-header-text)]';

  // Icon color follows the variant — inset headers use the inset icon
  // token so sort + icon-only triggers match the rest of the inset
  // header styling.
  const iconColorClass = disabled
    ? 'text-[color:var(--table-header-disabled-text)]'
    : isInset
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
  // Sub-headers are label bands above sub-rows, never sortable in
  // product (verified against s2 Sales Channel reference). Force-suppress
  // any sort affordance the caller might pass so misuse can't put a
  // chevron in a band that has no meaningful sort target.
  const sortIcon = sortable && !subheader
    ? sortDirection === 'asc'
      ? 'arrow-up'
      : sortDirection === 'desc'
        ? 'arrow-down'
        : 'menu-swap'
    : null;

  return (
    <div className={cellClasses}>
      {/*
        inline-flex (not bare inline) so this slot's bounding box clamps
        to its child's geometry. A plain inline span inherits the
        parent's line-height, which in Storybook's padded layout is
        taller than the 17px checkbox — items-center on the parent then
        centers the taller span, leaving the visible checkbox rendered
        ~1px above the title text. inline-flex makes the wrapper height
        equal the checkbox height exactly.
      */}
      {checkbox && <span className="shrink-0 inline-flex items-center">{checkbox}</span>}
      <div
        className={[
          'inline-flex items-center gap-[var(--spacing-4)] min-w-0 flex-1',
          textAlignmentClass[align],
        ].join(' ')}
      >
        <button
          type="button"
          onClick={sortable && !subheader && !disabled ? onSort : undefined}
          disabled={disabled || !sortable || subheader}
          // Note: `aria-sort` is intentionally NOT set here. ARIA exposes
          // sort state on the columnheader (the surrounding <th>), not
          // on the click target. Callers should set it on the <th>:
          //   <th aria-sort={sortDirectionToAria(sortDirection)}>
          //     <TableHeaderCell sortable sortDirection={sortDirection} ... />
          //   </th>
          className={[
            titleClasses,
            'border-none outline-none bg-transparent p-0',
            sortable && !subheader && !disabled ? 'cursor-pointer' : 'cursor-default',
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
                  'text-[length:var(--text-12)] leading-[var(--leading-15)]',
                  'font-[family-name:var(--font-sans)] font-[var(--font-weight-medium)]',
                  'text-[color:var(--color-sys-red-DEFAULT)]',
                ].join(' ')}
              >
                {hint.count}
              </span>
            )}
            <span
              className={[
                'text-[length:var(--text-12)] leading-[var(--leading-15)]',
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
