/**
 * Shared helpers for the SortBlock component family — Figma:
 * Sort Block - Default (2411:39), MainSub (2411:41), Long Content (2411:40),
 * Icon (2411:42), Tag (3127:10385), Button (2918:10689), Image (3715:3682).
 *
 * The family shares the `--sorting-block-sorting-fill` background and a
 * common label/value typography system (caption 12/17 for labels, body
 * 14/17 for body values, caption 12/17 for sub-row values).
 */

/** Component-level state axis from Figma. Per the 2026-05-03 build scope,
 *  only the readonly subset ships. The type is forward-compatible: callers
 *  cannot pass 'Hover' / 'Default' / 'Filled' / 'Disabled' (TS error) until
 *  this union is widened. */
export type SortBlockState = 'Readonly' | 'Readonly Bold';

/** A single label/value row used by the text-content family members
 *  (Default, MainSub, LongContent). */
export interface SortBlockRow {
  /** Caption above the value. Empty string or omitted = no label for this
   *  row. **Mixed-label alignment:** for horizontal multi-row text layouts,
   *  if at least one row has a non-empty label, empty-label rows render an
   *  invisible placeholder so value rows stay column-aligned; if all labels
   *  are empty, omit the label column entirely. */
  label?: string;
  value: string;
  /** Per-row weight override. When set, wins over the component's `state`
   *  prop for this row only (including explicit `false` to force regular
   *  inside a `state="Readonly Bold"` component). Omit to inherit from
   *  `state`. */
  bold?: boolean;
}

/** Background fill class shared by every family member. */
export const FILL_CLASS = 'bg-[color:var(--sorting-block-sorting-fill)]';

/** Label typography — caption 12/17, info text colour, no wrap. */
export const LABEL_CLASSES =
  'font-[family-name:var(--general-font-family)] font-[weight:var(--general-caption-weight)] ' +
  'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)] ' +
  'text-[color:var(--color-text-info)] whitespace-nowrap';

const VALUE_BASE_CLASSES =
  'font-[family-name:var(--general-font-family)] ' +
  'text-[color:var(--color-text-primary)]';

/** Body-sized value typography (14/17). Used by Default, LongContent, and
 *  MainSub's `rows[0]`. `wrap` swaps nowrap → pre-line for paragraph values
 *  (LongContent always passes true; Default always passes false). `bold`
 *  is the *resolved* weight (the caller has already merged `row.bold` with
 *  the component's `state`). */
export const valueBodyClass = ({ wrap, bold }: { wrap: boolean; bold: boolean }) =>
  [
    VALUE_BASE_CLASSES,
    'text-[length:var(--general-body-size)] leading-[var(--general-body-slim-lineheight)]',
    bold
      ? 'font-[weight:var(--general-body-bold-weight)]'
      : 'font-[weight:var(--general-body-weight)]',
    wrap ? 'whitespace-pre-line' : 'whitespace-nowrap',
  ].join(' ');

/** Caption-sized value typography (12/17). Used by MainSub's `rows[1]`. */
export const valueCaptionClass = () =>
  [
    VALUE_BASE_CLASSES,
    'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)]',
    'font-[weight:var(--general-caption-weight)]',
    'whitespace-nowrap',
  ].join(' ');

/** Empty-label predicate — empty string and undefined both mean "no label
 *  for this row". */
export const hasLabel = (row: SortBlockRow): boolean =>
  row.label !== undefined && row.label !== '';

/** Resolve a row's effective bold weight: per-row override wins over
 *  component-level `state`. */
export const resolveBold = (row: SortBlockRow, state: SortBlockState): boolean => {
  if (row.bold !== undefined) return row.bold;
  return state === 'Readonly Bold';
};

/** Append-style className composition. Built-in classes always render
 *  first; the consumer's className appends. Tailwind's last-wins resolution
 *  means consumer overrides win for atomic conflicts (e.g. `bg-red-500`
 *  beats the built-in fill). For non-atomic overrides, consumers use the
 *  `!` prefix per the existing project convention. */
export const appendClass = (builtIn: string, className?: string): string =>
  className ? `${builtIn} ${className}` : builtIn;
