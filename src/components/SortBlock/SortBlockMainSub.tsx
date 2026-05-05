import {
  FILL_CLASS,
  LABEL_CLASSES,
  appendClass,
  hasLabel,
  resolveBold,
  valueBodyClass,
  valueCaptionClass,
  type SortBlockRow,
  type SortBlockState,
} from './shared';

export interface SortBlockMainSubProps {
  /** Exactly 2 rows. The tuple type is the contract — passing the wrong
   *  length is a TS compile error, not a runtime guard. */
  rows: [SortBlockRow, SortBlockRow];
  /** Component-level weight default for the *main* row (`rows[0]`). The
   *  sub row (`rows[1]`) is always caption-sized; weight on it follows the
   *  caption recipe regardless of `state`. Per-row `bold` on the main row
   *  overrides `state`; per-row `bold` on the sub row is ignored (caption
   *  recipe is fixed). */
  state?: SortBlockState;
  /** Appended to the built-in root classes. */
  className?: string;
}

const ROOT_BASE = `inline-flex items-start flex-col gap-[var(--spacing-4)] ${FILL_CLASS} ` +
  'px-[var(--spacing-6)] py-[var(--spacing-12)]';

const PAIR_CLASSES = 'inline-flex items-start gap-[var(--spacing-8)]';

/**
 * SortBlockMainSub — Figma: Sort Block - MainSub (2411:41).
 *
 * Vertical 2-row stack with gap-4 between the main and sub pairs (vs
 * Default's gap-8 / gap-2). `rows[0]` is the body-sized "main" line
 * (14/17); `rows[1]` is the caption-sized "sub" line (12/17). Row position
 * determines size; there is no per-row size flag.
 */
export const SortBlockMainSub = ({
  rows,
  state = 'Readonly',
  className,
}: SortBlockMainSubProps) => {
  const [main, sub] = rows;
  const rootClass = appendClass(ROOT_BASE, className);

  return (
    <div className={rootClass}>
      <div className={PAIR_CLASSES}>
        {hasLabel(main) && <span className={LABEL_CLASSES}>{main.label}</span>}
        <span className={valueBodyClass({ wrap: false, bold: resolveBold(main, state) })}>
          {main.value}
        </span>
      </div>
      <div className={PAIR_CLASSES}>
        {hasLabel(sub) && <span className={LABEL_CLASSES}>{sub.label}</span>}
        <span className={valueCaptionClass()}>{sub.value}</span>
      </div>
    </div>
  );
};
