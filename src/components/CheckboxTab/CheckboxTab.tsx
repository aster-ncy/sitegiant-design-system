import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { Checkbox } from '../Checkbox';
import { Icon } from '../Icon';

/* ── Typography recipes (Figma node 1842:7598) ────────────────────────── */
/* Heading label: 16 / 22 / medium — General/Heading/heading-* */
const headingTextClasses =
  'text-[length:var(--general-heading-size)] leading-[var(--general-heading-lineheight)] ' +
  'font-[family-name:var(--general-font-family)] font-[weight:var(--general-heading-weight)]';

/* Hint text: 12 / 17 / regular — General/Caption/caption-* */
const captionTextClasses =
  'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)] ' +
  'font-[family-name:var(--general-font-family)] font-[weight:var(--general-caption-weight)]';

export type CheckboxTabState = 'default' | 'selected' | 'indeterminate';

export interface CheckboxTabProps {
  /** Heading text (16/22/medium) — required. */
  label: string;
  /** Optional caption hint below the label (12/17/regular). */
  hintText?: string;
  /**
   * Checkbox state — `default` (unchecked), `selected` (checked),
   * or `indeterminate` (mixed; e.g. some children selected).
   */
  state?: CheckboxTabState;
  /** Fired when the inner checkbox is toggled. */
  onCheckedChange?: (next: boolean) => void;
  /**
   * Optional icon node rendered to the left of the label (e.g. a 20px
   * channel/app logo). The caller passes the rendered node — CheckboxTab
   * just slots it.
   */
  icon?: ReactNode;
  /**
   * Optional dropdown / form-input slot rendered to the right of the row.
   * Shown only when present; replaces the chevron column visually.
   * Caller passes the rendered node (e.g. `<Dropdown ... />`).
   */
  dropdown?: ReactNode;
  /**
   * Controlled expand state. Omit (or pass `undefined`) to hide the
   * chevron entirely. `true` → chevron-up (currently expanded);
   * `false` → chevron-down (currently collapsed). Per Figma's stateButton
   * naming, the chevron describes the current state, not the action.
   *
   * Children of an expanded section are NOT owned by CheckboxTab —
   * the consumer renders them conditionally underneath.
   */
  expanded?: boolean;
  /** Fired when the row chrome (label / hint / icon / chevron) is clicked. */
  onExpandChange?: (next: boolean) => void;
  /** Disabled state — propagates to the inner checkbox + dims the row. */
  disabled?: boolean;
  /** Extra classes on the root row. */
  className?: string;
  /** HTML id forwarded to the inner checkbox input. */
  id?: string;
}

/**
 * CheckboxTab — Figma: Checkbox - Tab (1842:7598).
 *
 * A compound row used as a section header / bulk-toggle for a group of
 * child checkboxes (e.g. "ShopeeMY" expanding to per-store checkboxes
 * underneath). The inset-fill row holds: a 17px Checkbox, an optional
 * channel icon, a heading-style label (16/22/medium) with optional hint,
 * an optional right-aligned dropdown slot, and an optional chevron
 * toggle.
 *
 * Two independent click targets:
 *   - The Checkbox toggles checked state via `onCheckedChange`.
 *   - The rest of the row chrome (label, hint, icon area, chevron)
 *     toggles expand state via `onExpandChange`.
 *
 * The dropdown slot, when present, swallows its own clicks (so picking
 * an option doesn't accidentally collapse the row). CheckboxTab does
 * NOT render or hide children — the consumer handles that based on
 * the `expanded` value it owns.
 */
export const CheckboxTab = ({
  label,
  hintText,
  state = 'default',
  onCheckedChange,
  icon,
  dropdown,
  expanded,
  onExpandChange,
  disabled = false,
  className = '',
  id,
}: CheckboxTabProps) => {
  const showChevron = expanded !== undefined;

  const toggleExpand = () => {
    if (disabled || !showChevron) return;
    onExpandChange?.(!expanded);
  };

  const handleRowClick = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled || !showChevron) return;
    // Don't toggle expand when the click originated inside the checkbox
    // hit-area or the dropdown slot — those have their own handlers.
    const target = e.target as HTMLElement;
    if (target.closest('[data-checkbox-tab-checkbox]')) return;
    if (target.closest('[data-checkbox-tab-dropdown]')) return;
    toggleExpand();
  };

  const handleRowKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || !showChevron) return;
    // Only handle keys when the focus is on the row itself (not the
    // inner checkbox, which the browser drives natively for Space).
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleExpand();
    }
  };

  const checkboxChecked = state === 'selected';
  const checkboxIndeterminate = state === 'indeterminate';

  return (
    <div
      className={[
        // Outer row — items-center vertically + py-[4.5px] (Figma 1842:7598).
        // The 4.5px (rather than spacing-4 = 4px) is intentional: combined
        // with the inner container's py-[1.5px] it produces an exact 6px
        // top/bottom shell padding.
        'flex items-center gap-[var(--spacing-12)]',
        'pl-[var(--spacing-24)] pr-[var(--spacing-12)] py-[4.5px]',
        'rounded-[var(--radius-4)]',
        'bg-[var(--color-surface-card-inset)]',
        showChevron && !disabled ? 'cursor-pointer' : '',
        disabled ? 'opacity-60' : '',
        // Subtle focus ring so keyboard users see the row is focusable.
        showChevron && !disabled
          ? 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--button-primary-default-fill)]'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={handleRowClick}
      onKeyDown={showChevron ? handleRowKeyDown : undefined}
      role={showChevron ? 'button' : undefined}
      tabIndex={showChevron && !disabled ? 0 : undefined}
      aria-expanded={showChevron ? expanded : undefined}
      aria-disabled={showChevron && disabled ? true : undefined}
    >
      {/* Inner container — items-start + py-[1.5px] (Figma).
          With items-start, the leading checkbox + icon align with the
          heading-row top, NOT the visual midpoint of label+hint. This
          matches the SortBlock / TableCell convention: leading elements
          follow the top content row.

          Each leading element is wrapped in a 21px-tall slot
          (min-h-[var(--leading-21)]) so it visually centers on the
          heading's 21px line-height. Checkbox handles its own slot
          internally; CheckboxTab matches that height for the icon and
          chevron columns. */}
      <div className="flex flex-1 min-w-0 items-start gap-[var(--spacing-12)] py-[1.5px]">
        {/* Checkbox column — Checkbox internally wraps its box in a
            21px slot, so no extra py here. Stops propagation so the
            row's expand-toggle doesn't fire when the box is clicked. */}
        <div
          data-checkbox-tab-checkbox=""
          className="flex items-center shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            id={id}
            size="sm"
            checked={checkboxChecked}
            indeterminate={checkboxIndeterminate}
            disabled={disabled}
            onChange={onCheckedChange}
          />
        </div>

        {/* Text area — optional 20px icon, then label + hint stack.
            items-start so the icon aligns with the heading row, not
            the visual midpoint when a hint is present. */}
        <div className="flex items-start gap-[var(--spacing-8)] min-w-0">
          {icon && (
            // 20px image in a 21px slot (min-h-[var(--leading-21)]) so
            // it centers on the heading's 21px line-height. Same slot
            // pattern as Checkbox's internal box-slot for symmetry.
            <span className="shrink-0 inline-flex items-center justify-center w-[20px] min-h-[var(--leading-21)]">
              {icon}
            </span>
          )}
          <div className="flex flex-col gap-[var(--spacing-4)] justify-center min-w-0">
            <span
              className={[
                headingTextClasses,
                'text-[color:var(--color-text-primary)]',
                'whitespace-nowrap',
              ].join(' ')}
            >
              {label}
            </span>
            {hintText && (
              <span
                className={[
                  captionTextClasses,
                  'text-[color:var(--color-text-info)]',
                ].join(' ')}
              >
                {hintText}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right side — dropdown slot OR chevron OR nothing */}
      {dropdown && (
        <div
          data-checkbox-tab-dropdown=""
          className="shrink-0 w-[156px]"
          onClick={(e) => e.stopPropagation()}
        >
          {dropdown}
        </div>
      )}
      {showChevron && !dropdown && (
        <div
          aria-hidden="true"
          className="flex items-center justify-center shrink-0 rounded-[var(--radius-120)] min-h-[var(--leading-21)]"
        >
          {/* 17px chevron per Figma 1842:7598. The Icon component takes
              a numeric pixel size; the value matches the inner checkbox
              size for visual symmetry across the row. The 21px-tall
              slot (min-h-[var(--leading-21)]) lines the chevron up with
              the heading-row centerline. */}
          <Icon
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={17}
            color="var(--color-icon-secondary)"
          />
        </div>
      )}
    </div>
  );
};
