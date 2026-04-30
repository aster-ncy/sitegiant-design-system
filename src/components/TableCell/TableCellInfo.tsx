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
}

const renderBody = (body: ReactNode | ReactNode[]) => {
  if (Array.isArray(body)) {
    return body.map((paragraph, index) => (
      <p key={index} className="m-0">
        {paragraph}
      </p>
    ));
  }
  return <p className="m-0">{body}</p>;
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
  'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)]',
  'text-[color:var(--color-text-info)]',
  'whitespace-nowrap',
].join(' ');

const bodyClasses = [
  'flex-1 min-w-0',
  'flex flex-col gap-0',
  'font-[family-name:var(--font-sans)]',
  'text-[length:var(--table-body-size)] leading-[var(--table-body-lineheight)]',
  'text-[color:var(--table-body-text)]',
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
            <div className={bodyClasses}>{renderBody(status.body)}</div>
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
          <span className={labelVerticalClasses}>{status.label}</span>
          <div className={bodyClasses}>{renderBody(status.body)}</div>
        </div>
      ))}
    </div>
  );
};
