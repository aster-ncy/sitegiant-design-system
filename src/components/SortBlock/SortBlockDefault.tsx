import {
  FILL_CLASS,
  LABEL_CLASSES,
  appendClass,
  hasLabel,
  resolveBold,
  valueBodyClass,
  type SortBlockRow,
  type SortBlockState,
} from './shared';

export type SortBlockOrientation = 'horizontal' | 'vertical';

export interface SortBlockDefaultProps {
  /** 1 or 2 label/value rows. */
  rows: SortBlockRow[];
  /** Layout direction. Horizontal places label and value side by side
   *  (per-row pairs stacked when 2 rows); vertical stacks label-over-value
   *  for each row, with rows themselves stacked. Default 'horizontal'. */
  orientation?: SortBlockOrientation;
  /** Component-level weight default. `'Readonly Bold'` makes every value
   *  bold unless an individual row overrides via `row.bold`. */
  state?: SortBlockState;
  /** Appended to the built-in root classes. */
  className?: string;
}

const ROOT_BASE = `inline-flex items-start ${FILL_CLASS} ` +
  'px-[var(--spacing-6)] py-[var(--spacing-12)]';

const horizontalLayout = () => 'gap-[var(--spacing-8)]';
const verticalLayout = (rowCount: number) =>
  rowCount > 1
    ? 'flex-col gap-[var(--spacing-8)]'
    : 'flex-col gap-[var(--spacing-2)]';

const HORIZONTAL_LABEL_STACK = 'inline-flex flex-col items-start gap-[var(--spacing-8)]';
const HORIZONTAL_VALUE_STACK = 'inline-flex flex-col items-start gap-[var(--spacing-8)]';
const VERTICAL_PAIR = 'inline-flex flex-col items-start gap-[var(--spacing-2)]';

/**
 * SortBlockDefault — Figma: Sort Block - Default (2411:39).
 *
 * Readonly label/value cell with the SortBlock fill, horizontal or vertical
 * layout, 1 or 2 rows. Use `state="Readonly Bold"` for whole-cell bold
 * defaults; use `row.bold` to override per row.
 *
 * For paragraph-style multi-line values, use `SortBlockLongContent` instead.
 * For 14/17 over 12/17 main+sub stacks, use `SortBlockMainSub`.
 */
export const SortBlockDefault = ({
  rows,
  orientation = 'horizontal',
  state = 'Readonly',
  className,
}: SortBlockDefaultProps) => {
  const layout =
    orientation === 'horizontal' ? horizontalLayout() : verticalLayout(rows.length);
  const rootClass = appendClass(`${ROOT_BASE} ${layout}`, className);

  if (orientation === 'horizontal') {
    const anyLabel = rows.some(hasLabel);
    return (
      <div className={rootClass}>
        {anyLabel && (
          <div className={HORIZONTAL_LABEL_STACK}>
            {rows.map((row, i) => (
              <span
                key={`l-${i}`}
                className={LABEL_CLASSES}
                aria-hidden={hasLabel(row) ? undefined : true}
              >
                {hasLabel(row) ? row.label : ' '}
              </span>
            ))}
          </div>
        )}
        <div className={HORIZONTAL_VALUE_STACK}>
          {rows.map((row, i) => (
            <span
              key={`v-${i}`}
              className={valueBodyClass({ wrap: false, bold: resolveBold(row, state) })}
            >
              {row.value}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Vertical: each row is its own label-over-value pair.
  return (
    <div className={rootClass}>
      {rows.map((row, i) => (
        <div key={i} className={VERTICAL_PAIR}>
          {hasLabel(row) && <span className={LABEL_CLASSES}>{row.label}</span>}
          <span
            className={valueBodyClass({ wrap: false, bold: resolveBold(row, state) })}
          >
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
};
