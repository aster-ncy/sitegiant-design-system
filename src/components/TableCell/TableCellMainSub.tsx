import type { ReactNode } from 'react';

export interface TableCellMainSubProps {
  /** Optional caption above the main value. */
  mainLabel?: ReactNode;
  /** Primary value, body 14/17. Bold when `mainBold` is set. */
  mainValue: ReactNode;
  /** Optional caption above the sub value. */
  subLabel?: ReactNode;
  /**
   * Secondary value rendered beneath the main row. Caption 12/17 in
   * `--color-text-secondary` — distinct from the Info pattern's body
   * 14/21 in `--color-text-primary`.
   */
  subValue: ReactNode;
  /**
   * Figma `Type=Main Bold` — applies the Bold weight to the main value.
   * Caption labels and sub value remain regular weight.
   */
  mainBold?: boolean;
}

const labelClasses = [
  'shrink-0',
  'font-[family-name:var(--font-sans)]',
  'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)]',
  'text-[color:var(--color-text-info)]',
  'whitespace-nowrap',
].join(' ');

// Main value uses body-slim (14/17) — same size as body but tighter
// line-height, distinguishing the MainSub stack from the Info pattern's
// 14/21. No --general-body-slim-lineheight token exists; --leading-17 is
// the underlying primitive.
const mainValueBaseClasses = [
  'font-[family-name:var(--font-sans)]',
  'text-[length:var(--table-body-size)] leading-[var(--leading-17)]',
  'text-[color:var(--color-text-primary)]',
  'whitespace-nowrap',
].join(' ');

const subValueClasses = [
  'font-[family-name:var(--font-sans)]',
  'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)]',
  'text-[color:var(--color-text-secondary)]',
  'whitespace-nowrap',
].join(' ');

/**
 * TableCellMainSub — Figma: Inset Table Row - MainSub (2121:9632, default
 * symbol 2119:9233; Main Bold variant 2119:9244).
 *
 * Two-line stack inside a TableCell's content slot: a main row (caption
 * label + body 14/17 value) sits above a sub row (caption label + caption
 * 12/17 value in secondary text colour). The main value can be bolded via
 * `mainBold` to mirror Figma's `Type=Main Bold` variant. Inner row gap is
 * 4px between rows; 8px between label and value within a row.
 *
 * Slots inside `<TableCell inset>` as `children`. The cell wrapper supplies
 * padding, fill, divider, hover, and selection.
 */
export const TableCellMainSub = ({
  mainLabel,
  mainValue,
  subLabel,
  subValue,
  mainBold = false,
}: TableCellMainSubProps) => {
  const mainValueClasses = [
    mainValueBaseClasses,
    mainBold
      ? 'font-[var(--font-weight-bold)]'
      : 'font-[var(--font-weight-regular)]',
  ].join(' ');

  return (
    <div className="flex flex-col gap-[var(--spacing-4)] items-start">
      <div className="flex gap-[var(--spacing-8)] items-center">
        {mainLabel !== undefined && (
          <span className={labelClasses}>{mainLabel}</span>
        )}
        <span className={mainValueClasses}>{mainValue}</span>
      </div>
      <div className="flex gap-[var(--spacing-8)] items-center">
        {subLabel !== undefined && (
          <span className={labelClasses}>{subLabel}</span>
        )}
        <span className={subValueClasses}>{subValue}</span>
      </div>
    </div>
  );
};
