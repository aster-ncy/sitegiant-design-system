import type { ReactNode } from 'react';
import type { TableColumnPosition, TableTextAlignment } from '../TableHeaderCell';

export type TableCellWeight = 'normal' | 'bold';
export type TableRowPosition = 'first' | 'middle' | 'last';

export interface TableCellProps {
  /** Cell content. */
  children?: ReactNode;
  /**
   * Inset variant — compact padding, lighter dividers, used when the
   * table sits inside a card / container. Pair with `<TableHeaderCell inset>`.
   */
  inset?: boolean;
  /** Column position — controls left/right padding. */
  column?: TableColumnPosition;
  /** Text alignment within the cell. */
  align?: TableTextAlignment;
  /** Text weight — 'bold' applies highlight weight. */
  weight?: TableCellWeight;
  /**
   * Row position. 'last' uses a slightly heavier bottom border
   * (matches Figma's --table-divider-last-border).
   */
  row?: TableRowPosition;
  /**
   * Visual hover state. Cells normally pick this up via row hover
   * (the parent <tr> sets a class), but expose it as a prop for
   * controlled / Storybook use.
   */
  hovered?: boolean;
  /**
   * Selected row state — pale-blue fill highlight (matches the live
   * "Select Package" modal's selected row). Apply to every cell in
   * the row when the row's selection checkbox is checked.
   */
  selected?: boolean;
  /** Optional checkbox slot (e.g. row-select checkbox in column 1). */
  checkbox?: ReactNode;
  /** Optional leading icon shown before the value. */
  leadingIcon?: ReactNode;
  /** Optional trailing slot (icons, dropdowns, etc) shown after the value. */
  trailing?: ReactNode;
  /** Extra classes on the root cell. */
  className?: string;
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
 * TableCell — Figma: Table Row (973:1745) body cell.
 *
 * Single body-row cell. 14px/21px Roboto Regular by default; 'bold'
 * weight applies the highlight weight (Bold) for emphasized values.
 * Asymmetric column padding (first column pl-24, last column pr-24,
 * center px-12). Bottom divider via inset shadow — slightly heavier
 * on the last row.
 *
 * Composition: render `<tr>` rows, each containing `<td>` elements
 * with TableCell inside. Apply `row='last'` to the final row's cells
 * so the trailing border matches the Figma final-row treatment.
 *
 * Hover styling: by default the cell renders default fill + text.
 * Compose `<tr className="group hover:[&_td>div]:bg-[var(--table-body-hover-fill)]">`
 * to wire row-hover OR pass `hovered` prop directly for controlled use.
 */
export const TableCell = ({
  children,
  inset = false,
  column = 'center',
  align = 'left',
  weight = 'normal',
  row = 'middle',
  hovered = false,
  selected = false,
  checkbox,
  leadingIcon,
  trailing,
  className = '',
}: TableCellProps) => {
  // Bottom border — heavier on the very last row to anchor the table.
  // Inset variant always uses the lighter divider per Figma (node 1298:1934
  // and siblings) — even on the last row, since inset tables typically
  // sit inside a card whose own border anchors the bottom edge.
  const bottomBorder = inset
    ? 'shadow-[inset_0_-1px_0_0_var(--table-divider-lighter-border)]'
    : row === 'last'
      ? 'shadow-[inset_0_-1px_0_0_var(--table-divider-last-border)]'
      : 'shadow-[inset_0_-1px_0_0_var(--table-divider-border)]';

  // Selection fill (pale blue) wins over hover; matches live ERP
  // "Select Package" modal's selected row treatment.
  //
  // The `!` important modifier is needed because callers commonly wire
  // row hover with a higher-specificity descendant selector on the <tr>
  // (e.g. `hover:[&_td>div]:bg-[...]`), which would otherwise override
  // a plain bg-[...] on the cell. Selection state must always win.
  const fillClass = selected
    ? '!bg-[var(--color-sys-blue-lighter)]'
    : inset
      ? hovered
        ? 'bg-[var(--table-inset-body-hover-fill)]'
        : 'bg-[var(--table-inset-body-fill)]'
      : hovered
        ? 'bg-[var(--table-body-hover-fill)]'
        : 'bg-[var(--table-body-fill)]';

  const textColorClass = inset
    ? hovered
      ? 'text-[color:var(--table-inset-body-hover-text)]'
      : 'text-[color:var(--table-inset-body-text)]'
    : hovered
      ? 'text-[color:var(--table-body-hover-text)]'
      : 'text-[color:var(--table-body-text)]';

  const weightClass = weight === 'bold'
    ? 'font-[var(--font-weight-bold)]'
    : 'font-[var(--font-weight-regular)]';

  return (
    <div
      className={[
        // `flex` (not `inline-flex`) so the cell occupies the full width
        // of its <td>; otherwise the bottom inset-shadow border under-
        // paints and reads as an underline rather than a row divider.
        'relative flex items-center gap-[var(--spacing-12)] w-full',
        // Inset variant padding from Figma (node 1298:1934 and siblings):
        // px-6 py-12. The 6px horizontal pairs with the inset header's
        // pl-12 pr-6 to form a 12px inter-column gutter. 12px vertical
        // gives rows breathing room while staying tighter than default.
        inset
          ? 'px-[var(--spacing-6)] py-[var(--spacing-12)]'
          : `${columnPaddingX[column]} py-[var(--spacing-16)]`,
        fillClass,
        bottomBorder,
        'transition-colors duration-150',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* inline-flex so the slot's height clamps to the checkbox; see
          matching note in TableHeaderCell for the line-height-inheritance
          rationale. */}
      {checkbox && <span className="shrink-0 inline-flex items-center">{checkbox}</span>}
      {leadingIcon && <span className="shrink-0 inline-flex items-center">{leadingIcon}</span>}
      <span
        className={[
          // `flex` (not `inline-flex`) so non-string ReactNode children
          // (e.g. the multi-line primary+secondary stack used by the
          // Wallet Record / TableCellInfo patterns) lay out as expected.
          'flex items-center gap-[var(--spacing-4)] min-w-0 flex-1',
          'font-[family-name:var(--font-sans)]',
          'text-[length:var(--table-body-size)] leading-[var(--table-body-lineheight)]',
          weightClass,
          textColorClass,
          textAlignmentClass[align],
        ].join(' ')}
      >
        {/*
          Truncate plain-string children so long single-line values clip
          with an ellipsis instead of overflowing the cell. Non-string
          children (e.g. structured multi-line content) render as-is and
          handle their own overflow — `truncate` on a flex-row parent
          would have no effect on stacked flex-col descendants anyway.
        */}
        {typeof children === 'string'
          ? <span className="truncate">{children}</span>
          : children}
      </span>
      {trailing && <span className="shrink-0 inline-flex items-center">{trailing}</span>}
    </div>
  );
};
