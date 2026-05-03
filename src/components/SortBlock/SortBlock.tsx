import type { ReactNode } from 'react';

export type SortBlockOrientation = 'horizontal' | 'vertical';

export interface SortBlockRow {
  label: string;
  value: string;
  /** Renders the value in bold (Readonly Bold variant). Default false. */
  bold?: boolean;
  /** Renders the value at caption size (12/17) instead of body (14/17).
   *  Used by the MainSub variant's sub-row. Default false. */
  caption?: boolean;
}

export interface SortBlockProps {
  /** Layout direction. Horizontal places label and value side by side;
   *  vertical stacks them. Default 'horizontal'. */
  orientation?: SortBlockOrientation;
  /** One or two label/value rows. If provided, takes precedence over `children`. */
  rows?: SortBlockRow[];
  /** Body content for the icon / tag / button / image variants. Ignored when
   *  `rows` is provided. */
  children?: ReactNode;
  /** REPLACES (not appends) the built-in classes. Pass the full layout you want. */
  className?: string;
}

const ROOT_BASE_CLASSES =
  'inline-flex items-start ' +
  'bg-[var(--sorting-block-sorting-fill)] ' +
  'px-[var(--spacing-6)] py-[var(--spacing-12)]';

// Outer flex layout per orientation × row count.
// Horizontal (any rows): label-side and value-side as siblings, outer gap-8.
// Vertical 1 row: label above value, outer gap-2.
// Vertical 2 rows: two label/value pairs stacked, outer gap-8 (each pair gap-2 internally).
const horizontalLayoutClasses = () => 'gap-[var(--spacing-8)]';
const verticalLayoutClasses = (rowCount: number) =>
  rowCount > 1 ? 'flex-col gap-[var(--spacing-8)]' : 'flex-col gap-[var(--spacing-2)]';

const LABEL_CLASSES =
  'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)] ' +
  'text-[length:var(--text-12)] leading-[var(--leading-17)] ' +
  'text-[color:var(--color-text-info)] whitespace-nowrap';

const VALUE_BASE_CLASSES =
  'font-[family-name:var(--general-font-family)] ' +
  'leading-[var(--leading-17)] text-[color:var(--color-text-primary)] whitespace-nowrap';

// Inside Horizontal 2-info: label column and value column each stack with gap-8.
const HORIZONTAL_LABEL_STACK = 'inline-flex flex-col items-start gap-[var(--spacing-8)]';
const HORIZONTAL_VALUE_STACK = 'inline-flex flex-col items-start gap-[var(--spacing-8)]';
// Inside Vertical 2-info: each pair stacks label-over-value with gap-2.
const VERTICAL_PAIR_CLASSES = 'inline-flex flex-col items-start gap-[var(--spacing-2)]';

const valueClass = (row: SortBlockRow) =>
  [
    VALUE_BASE_CLASSES,
    row.bold ? 'font-[var(--font-weight-bold)]' : 'font-[var(--font-weight-regular)]',
    row.caption ? 'text-[length:var(--text-12)]' : 'text-[length:var(--text-14)]',
  ].join(' ');

/**
 * SortBlock — Figma: Sort Block (2411:39).
 *
 * Readonly label/value cell with a `--sorting-block-sorting-fill` background.
 * Provides the chrome and typography for the dominant labeled-row case via
 * the `rows` prop; falls through to `children` for body variants (icon, tag,
 * button, image, etc.).
 *
 * Per the 2026-05-03 build scope, only Readonly + Readonly Bold variants
 * ship. Interactive states (Default/Hover/Filled/Disabled with editable
 * inputs) are deferred.
 */
export const SortBlock = ({
  orientation = 'horizontal',
  rows,
  children,
  className,
}: SortBlockProps) => {
  const rowCount = rows?.length ?? 0;
  const layoutClasses =
    orientation === 'horizontal' ? horizontalLayoutClasses() : verticalLayoutClasses(rowCount);
  const rootClass = className || `${ROOT_BASE_CLASSES} ${layoutClasses}`;

  if (!rows || rows.length === 0) {
    return <div className={rootClass}>{children}</div>;
  }

  if (orientation === 'horizontal') {
    return (
      <div className={rootClass}>
        <div className={HORIZONTAL_LABEL_STACK}>
          {rows.map((row, i) => (
            <span key={`l-${i}`} className={LABEL_CLASSES}>
              {row.label}
            </span>
          ))}
        </div>
        <div className={HORIZONTAL_VALUE_STACK}>
          {rows.map((row, i) => (
            <span key={`v-${i}`} className={valueClass(row)}>
              {row.value}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Vertical: each row is its own label-over-value pair, pairs stacked.
  return (
    <div className={rootClass}>
      {rows.map((row, i) => (
        <div key={i} className={VERTICAL_PAIR_CLASSES}>
          <span className={LABEL_CLASSES}>{row.label}</span>
          <span className={valueClass(row)}>{row.value}</span>
        </div>
      ))}
    </div>
  );
};
