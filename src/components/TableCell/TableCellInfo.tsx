import type { ReactNode } from 'react';

export type TableCellInfoAlignment = 'horizontal' | 'vertical';

export interface TableCellInfoStatus {
  /** Status label (left in horizontal, above in vertical). */
  label: ReactNode;
  /**
   * Status body. A single string renders one paragraph; an array renders
   * one paragraph per entry. Each paragraph wraps at the cell's content
   * width (no truncation — multi-line by design).
   */
  body: ReactNode | ReactNode[];
  /**
   * Optional fixed visual line count for Figma table-row info variants.
   * When omitted, body content keeps its natural height.
   */
  maxLines?: 1 | 2 | 3;
}

export interface TableCellInfoProps {
  /**
   * 'horizontal' (Figma default) — label sits to the left of the body,
   * labels and body share a row height; multi-status stacks rows vertically.
   * 'vertical' — label sits above the body for each status block.
   */
  alignment?: TableCellInfoAlignment;
  /**
   * One or more (label + body) pairs. N=1 is the s1 single-line pattern.
   * N=2 is the s8 Order ID + COID pattern. N=3 is shown in Figma's matrix.
   */
  statuses: TableCellInfoStatus[];
  /**
   * When true, applies bold font-weight only to the first (primary) status body.
   * Secondary statuses render at regular weight. Use this instead of
   * `weight="bold"` on the wrapping `TableCell` when only the primary row
   * should be bold (e.g. ID bold, secondary label/value regular).
   */
  primaryBold?: boolean;
  /**
   * When true, on row hover the first body turns bold while secondary bodies
   * stay regular. Use instead of `boldOnRowHover` on the wrapping `TableCell`
   * when only the primary row should bold on hover.
   */
  primaryBoldOnRowHover?: boolean;
  /**
   * When true, applies `group-hover/row:text-[color:var(--table-body-hover-text)]`
   * only to the first (primary) status body. Secondary statuses stay at their
   * normal colour. Pair with `boldOnRowHover` on the wrapping `TableCell`.
   */
  primaryGreenOnRowHover?: boolean;
}

// Body paragraphs render as <span class="block"> rather than <p> because
// TableCell's content slot is a <span> (TableCell.tsx ~line 190); a block-
// level <p> nested inside a <span> is invalid HTML and some assistive tech
// flags it. Block <span>s give the same visual line-stacking without the
// nesting problem.
const lineClampClass: Record<1 | 2 | 3, string> = {
  1: 'sg-table-cell-info-clamp-1',
  2: 'sg-table-cell-info-clamp-2',
  3: 'sg-table-cell-info-clamp-3',
};

const renderBody = (body: ReactNode | ReactNode[], maxLines?: 1 | 2 | 3) => {
  if (maxLines && !Array.isArray(body)) {
    return (
      <span className={lineClampClass[maxLines]}>
        {body}
      </span>
    );
  }

  if (Array.isArray(body)) {
    return body.map((paragraph, index) => (
      <span key={index} className="block">
        {paragraph}
      </span>
    ));
  }
  return <span className="block">{body}</span>;
};

const labelHorizontalClasses = [
  'shrink-0',
  'font-[family-name:var(--font-sans)]',
  'text-[length:var(--table-body-size)] leading-[var(--table-body-lineheight)]',
  'text-[color:var(--color-text-info)]',
  'whitespace-nowrap',
].join(' ');

const labelVerticalClasses = [
  'font-[family-name:var(--font-sans)]',
  // leading-none removes the half-leading space above the first text line
  // so the label aligns flush with the cell's top padding edge (py-24).
  // Spacing between label and body is handled by the parent flex gap-2.
  'text-[length:var(--general-caption-size)] leading-none',
  'text-[color:var(--color-text-info)]',
  'whitespace-nowrap',
].join(' ');

// Body inherits text colour from the wrapping TableCell. TableCell sets
// the right token per mode (default / inset / hover) AND propagates the
// `tone` prop (success/danger). Hardcoding `--table-body-text` here would
// break tone propagation — a TableCell with `tone="danger"` containing
// a TableCellInfo would otherwise show default text colour.
const bodyClasses = [
  'min-w-0',
  'font-[family-name:var(--font-sans)]',
  'text-[length:var(--table-body-size)] leading-[var(--table-body-lineheight)]',
  'break-words',
].join(' ');

/**
 * TableCellInfo — Figma: Inset Table Row - Info (1298:1893).
 *
 * Content layout for the s1 / s6 / s8 multi-status row patterns. Renders
 * inside the content slot of `<TableCell inset>` — the cell wrapper still
 * provides padding, fill, divider, hover, and selection. This component
 * only supplies the inner label↔body geometry that Figma authors via the
 * `Alignment` × `Status Count` × `Paragraph Count` axes.
 *
 * Horizontal (Figma default):
 *   - label column flex-col gap-4, each label aligns to its body row
 *   - body  column flex-col gap-4, each body wraps to N paragraphs
 *   - inter-column gap = 4px
 *   - label = body 14/21 in `--color-text-info`
 *
 * Vertical:
 *   - per-status block flex-col gap-2 (label 12/17 above body 14/21)
 *   - inter-block gap = 4px
 */
export const TableCellInfo = ({
  alignment = 'horizontal',
  statuses,
  primaryBold = false,
  primaryBoldOnRowHover = false,
  primaryGreenOnRowHover = false,
}: TableCellInfoProps) => {
  if (statuses.length === 0) return null;

  if (alignment === 'horizontal') {
    // CSS grid: label column auto-sizes to widest label (max-content),
    // body column fills remaining (1fr). gap-y-4 between status rows.
    // Each row's label & body align on the row baseline because grid
    // synchronises row heights — fixes the multi-status × multi-paragraph
    // case where label (1 line) was shorter than body (N lines) and the
    // two flex columns drifted out of sync.
    return (
      <div
        className={[
          'grid w-full items-start',
          'grid-cols-[max-content_minmax(0,1fr)]',
          'gap-x-[var(--spacing-4)] gap-y-[var(--spacing-4)]',
        ].join(' ')}
      >
        {statuses.map((status, index) => (
          <div key={index} className="contents">
            <span className={labelHorizontalClasses}>{status.label}</span>
            <div className={bodyClasses}>{renderBody(status.body, status.maxLines)}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-[var(--spacing-4)] items-stretch">
      {statuses.map((status, index) => (
        <div
          key={index}
          className="flex w-full flex-col gap-[var(--spacing-2)] items-start"
        >
          {/* Only render label when non-empty — an empty label still
              occupies flex space and adds gap-2 before the body, pushing
              the body 2px below the cell's top padding edge. */}
          {status.label ? <span className={labelVerticalClasses}>{status.label}</span> : null}
          <div className={[
            bodyClasses,
            // primaryBold: first body bold, rest explicitly regular
            // (overrides weight="bold" on the wrapping TableCell)
            primaryBold
              ? index === 0
                ? 'font-[var(--font-weight-bold)]'
                : 'font-[var(--font-weight-regular)]'
              : '',
            // primaryBoldOnRowHover: first body bolds on hover, rest stay regular
            // (overrides boldOnRowHover on the wrapping TableCell)
            primaryBoldOnRowHover
              ? index === 0
                ? 'group-hover/row:font-[var(--font-weight-bold)]'
                : 'group-hover/row:font-[var(--font-weight-regular)]'
              : '',
            primaryGreenOnRowHover && index === 0
              ? 'group-hover/row:text-[color:var(--table-body-hover-text)]'
              : '',
          ].filter(Boolean).join(' ')}>{renderBody(status.body, status.maxLines)}</div>
        </div>
      ))}
    </div>
  );
};
