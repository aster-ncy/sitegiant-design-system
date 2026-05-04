import type { ReactNode } from 'react';

export type SortBlockOrientation = 'horizontal' | 'vertical';

export interface SortBlockRow {
  /** Caption above the value. Pass an empty string (or omit) to skip the
   *  label slot entirely — the value will sit at the cell start with no
   *  reserved label gap. */
  label?: string;
  value: string;
  /** Renders the value in bold (Readonly Bold variant). Default false. */
  bold?: boolean;
  /** Renders the value at caption size (12/17) instead of body (14/17).
   *  Used by the MainSub variant's sub-row. Default false. */
  caption?: boolean;
  /** Allow the value to wrap onto multiple lines instead of staying on one
   *  line. Drops `whitespace-nowrap` for this row's value. Use for
   *  paragraph-style content (Figma: SortBlock - Long Content). Default
   *  false. */
  wrap?: boolean;
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
  /** Switch the vertical 2-row gap from the default 8px to 4px. Use with
   *  `orientation='vertical'` and 2 rows to render the Figma "MainSub"
   *  variant where the main and sub pairs sit closer together. Has no
   *  effect on horizontal mode or single-row vertical. Default false. */
  mainSub?: boolean;
  /** REPLACES (not appends) the built-in classes. Pass the full layout you want. */
  className?: string;
}

const ROOT_BASE_CLASSES =
  'inline-flex items-start ' +
  'bg-[color:var(--sorting-block-sorting-fill)] ' +
  'px-[var(--spacing-6)] py-[var(--spacing-12)]';

// Outer flex layout per orientation × row count.
// Horizontal (any rows): label-side and value-side as siblings, outer gap-8.
// Vertical 1 row: label above value, outer gap-2.
// Vertical 2 rows: two label/value pairs stacked, outer gap-8 by default
//   or gap-4 in the Figma "MainSub" variant (each pair gap-2 internally).
const horizontalLayoutClasses = () => 'gap-[var(--spacing-8)]';
const verticalLayoutClasses = (rowCount: number, mainSub: boolean) => {
  if (rowCount > 1) {
    return mainSub
      ? 'flex-col gap-[var(--spacing-4)]'
      : 'flex-col gap-[var(--spacing-8)]';
  }
  return 'flex-col gap-[var(--spacing-2)]';
};

/* Typography per Figma node 2411:39:
 *   Label                  → General/Caption/caption-{size,lineheight,weight} (12/17/Regular)
 *   Value (body row)       → General/Body/body-{size,slim-lineheight,weight}   (14/17/Regular)
 *   Value (caption row)    → General/Caption/caption-* (same as label)
 *   Value (bold body row)  → General/Body/body-{size,slim-lineheight,bold-weight} (14/17/Bold)
 */
const LABEL_CLASSES =
  'font-[family-name:var(--general-font-family)] font-[weight:var(--general-caption-weight)] ' +
  'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)] ' +
  'text-[color:var(--color-text-info)] whitespace-nowrap';

const VALUE_BASE_CLASSES =
  'font-[family-name:var(--general-font-family)] ' +
  'text-[color:var(--color-text-primary)]';

// Inside Horizontal 2-info: label column and value column each stack with gap-8.
const HORIZONTAL_LABEL_STACK = 'inline-flex flex-col items-start gap-[var(--spacing-8)]';
const HORIZONTAL_VALUE_STACK = 'inline-flex flex-col items-start gap-[var(--spacing-8)]';
// Inside Vertical 2-info: each pair stacks label-over-value with gap-2.
const VERTICAL_PAIR_CLASSES = 'inline-flex flex-col items-start gap-[var(--spacing-2)]';

const valueClass = (row: SortBlockRow) => {
  // Caption rows pull the full caption recipe (12/17/regular).
  // Body rows use General/Body size + body-slim-lineheight (14/17),
  // with regular or bold weight depending on row.bold.
  // `wrap` rows use whitespace-pre-line so the value (a) flows onto
  // multiple lines via natural CSS wrap AND (b) honours explicit
  // newline characters in the source string (Figma's SortBlock - Long
  // Content fixtures use \n to pre-break addresses).
  const nowrap = row.wrap ? 'whitespace-pre-line' : 'whitespace-nowrap';
  if (row.caption) {
    return [
      VALUE_BASE_CLASSES,
      'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)]',
      'font-[weight:var(--general-caption-weight)]',
      nowrap,
    ].filter(Boolean).join(' ');
  }
  return [
    VALUE_BASE_CLASSES,
    'text-[length:var(--general-body-size)] leading-[var(--general-body-slim-lineheight)]',
    row.bold
      ? 'font-[weight:var(--general-body-bold-weight)]'
      : 'font-[weight:var(--general-body-weight)]',
    nowrap,
  ].filter(Boolean).join(' ');
};

// Empty label means "no label slot for this row" — skip rendering the
// span entirely so the value sits flush. Kept as a helper so both
// horizontal and vertical render paths agree on the rule.
const hasLabel = (row: SortBlockRow) => row.label !== undefined && row.label !== '';

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
 *
 * Composition patterns:
 *  - `SortableRowComposition` story: a single grey strip with multiple
 *    SortBlock cells flowing inline (sb6 pattern).
 *  - `InsetHeaderWithSortBlockRows` story: an inset TableHeaderCell strip
 *    above a list of SortBlock body rows. Use this for "draggable list
 *    inside a card" patterns (e.g. live ERP "Add Trip → Package List").
 *    Body cells should use existing DS primitives (TableCellMainSub,
 *    TableCellInfo) for content rather than inline typography.
 */
export const SortBlock = ({
  orientation = 'horizontal',
  rows,
  children,
  mainSub = false,
  className,
}: SortBlockProps) => {
  const rowCount = rows?.length ?? 0;
  const layoutClasses =
    orientation === 'horizontal'
      ? horizontalLayoutClasses()
      : verticalLayoutClasses(rowCount, mainSub);
  const rootClass = className || `${ROOT_BASE_CLASSES} ${layoutClasses}`;

  if (!rows || rows.length === 0) {
    return <div className={rootClass}>{children}</div>;
  }

  if (orientation === 'horizontal') {
    // Horizontal: render the label column only if at least one row has a
    // non-empty label — when ALL labels are empty, skipping the entire
    // label stack avoids a phantom gap-8 between the cell start and the
    // value (the empty stack itself is 0×0, but the parent gap-8 still
    // applies).
    const anyLabel = rows.some(hasLabel);
    return (
      <div className={rootClass}>
        {anyLabel && (
          <div className={HORIZONTAL_LABEL_STACK}>
            {rows.map((row, i) =>
              hasLabel(row) ? (
                <span key={`l-${i}`} className={LABEL_CLASSES}>
                  {row.label}
                </span>
              ) : (
                // Keep an empty placeholder span so the value column's
                // row N still aligns with the label column's row N when
                // the rows have mixed labels.
                <span key={`l-${i}`} className={LABEL_CLASSES} aria-hidden />
              ),
            )}
          </div>
        )}
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
  // When a row has no label, skip the label span entirely so the value
  // doesn't sit below an empty 17px line.
  return (
    <div className={rootClass}>
      {rows.map((row, i) => (
        <div key={i} className={VERTICAL_PAIR_CLASSES}>
          {hasLabel(row) && (
            <span className={LABEL_CLASSES}>{row.label}</span>
          )}
          <span className={valueClass(row)}>{row.value}</span>
        </div>
      ))}
    </div>
  );
};
