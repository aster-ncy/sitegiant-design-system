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

export interface SortBlockLongContentProps {
  /** 1 or 2 paragraph-style rows. Values use whitespace-pre-line so both
   *  natural CSS wrap AND explicit \n line breaks are honoured. */
  rows: SortBlockRow[];
  /** Component-level weight default. */
  state?: SortBlockState;
  /** Appended to the built-in root classes. */
  className?: string;
}

const ROOT_BASE = `inline-flex items-start gap-[var(--spacing-8)] ${FILL_CLASS} ` +
  'px-[var(--spacing-6)] py-[var(--spacing-12)]';

const HORIZONTAL_LABEL_STACK = 'inline-flex flex-col items-start gap-[var(--spacing-8)]';
const HORIZONTAL_VALUE_STACK = 'flex flex-col items-start gap-[var(--spacing-8)] flex-1 min-w-0';

/**
 * SortBlockLongContent — Figma: Sort Block - Long Content (2411:40).
 *
 * For paragraph-style multi-line values (addresses, descriptions). Values
 * use `whitespace-pre-line` so explicit \n breaks AND natural CSS wrap
 * both work. Pair with a fixed-width parent (e.g. `className="w-[203px]"`)
 * for predictable wrap points.
 *
 * **Note on Figma divergence:** the Figma library node renders with
 * `text-ellipsis overflow-hidden` on a fixed-height `<p>`, but production
 * call sites (s7 Add Trip address cell) need wrap behaviour. This
 * implementation matches production. A library follow-up is open with the
 * Figma owner per the spec.
 */
export const SortBlockLongContent = ({
  rows,
  state = 'Readonly',
  className,
}: SortBlockLongContentProps) => {
  const rootClass = appendClass(ROOT_BASE, className);
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
              <span key={`l-${i}`} className={LABEL_CLASSES} aria-hidden />
            ),
          )}
        </div>
      )}
      <div className={HORIZONTAL_VALUE_STACK}>
        {rows.map((row, i) => (
          <span
            key={`v-${i}`}
            className={valueBodyClass({ wrap: true, bold: resolveBold(row, state) })}
          >
            {row.value}
          </span>
        ))}
      </div>
    </div>
  );
};
