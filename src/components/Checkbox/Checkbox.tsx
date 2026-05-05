import type { Ref } from 'react';
import { Icon } from '../Icon';

/* ── Typography recipes (Pattern C — selection-control labels) ────────── */
/* Label: 14 / 21 / regular — body. Per Figma node 1339:8205 + 2636:435,
 * checkbox/radio/toggle option labels share the same body recipe used by
 * form labels elsewhere. */
const bodyTextClasses =
  'text-[length:var(--general-body-size)] leading-[var(--general-body-lineheight)] ' +
  'font-[family-name:var(--general-font-family)] font-[weight:var(--general-body-weight)]';

/* Helper / hint text: 12 / 17 / regular — caption. */
const captionTextClasses =
  'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)] ' +
  'font-[family-name:var(--general-font-family)] font-[weight:var(--general-caption-weight)]';

export type CheckboxSize = 'sm' | 'md';

export interface CheckboxProps {
  /** Whether the checkbox is checked */
  checked?: boolean;
  /** Whether the checkbox is in indeterminate state */
  indeterminate?: boolean;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /**
   * Whether the checkbox is "selected by default" — locked-checked.
   * Visually a green-fill box with an inner green square (not a tick),
   * indicating a system-required selection the user cannot uncheck.
   * Per Figma 1339:8204 "Selected by Default" variant. Non-interactive
   * when true: onChange does not fire on click.
   */
  lockedChecked?: boolean;
  /** Visual state — 'danger' paints the box border red. */
  state?: 'default' | 'danger';
  /**
   * Box size:
   * - `sm` (default): 17×17 box, 10×10 inner check. Matches Figma's
   *   standard checkbox (1339:8205, 2262:741) — the only size in the
   *   design system. Used in tables, forms, and section headers.
   * - `md`: 20×20 box, 12×12 inner check. Larger opt-in for product UI
   *   that needs a bigger hit target.
   */
  size?: CheckboxSize;
  /** Label text next to the checkbox */
  label?: string;
  /** Helper/info text below the label */
  helperText?: string;
  /** Change handler */
  onChange?: (checked: boolean) => void;
  /** Extra Tailwind/CSS classes on the root wrapper */
  className?: string;
  /** HTML id for the checkbox input */
  id?: string;
  /** Ref forwarded to the hidden native checkbox input. */
  inputRef?: Ref<HTMLInputElement>;
}

/**
 * SiteGiant Checkbox component.
 *
 * Token-driven implementation from Figma Form/checkbox section
 * (2262:741, 1339:8204, 1339:8205, 2636:436).
 *
 * States: unchecked, checked, indeterminate, locked-checked
 * ("Selected by Default"), disabled (+checked / +unchecked).
 *
 * Layout: outer label is `items-start` with 12px gap (Figma --spacing-12).
 * The visible box is wrapped in a 21px-tall flex slot (matching the body
 * line-height) so the box visually centers on the heading row — leading
 * elements follow the top content row, not the visual midpoint of the
 * label+hint stack. Same convention as SortBlock / TableCell / CheckboxTab.
 *
 * Focus model: the hidden native <input> is the canonical focus target —
 * the browser handles space/enter/tab natively, and the box-slot wrapper
 * paints a focus ring via Tailwind's `peer-focus-visible:` prefix when the
 * sibling input has visible focus. (Ring lives on the wrapper, not the
 * inner box span, because the wrapper is the direct sibling of `peer`.)
 *
 * @example
 * <Checkbox label="Agree to terms" checked={true} onChange={setChecked} />
 */
export const Checkbox = ({
  checked = false,
  indeterminate = false,
  disabled = false,
  lockedChecked = false,
  state = 'default',
  size = 'sm',
  label,
  helperText,
  onChange,
  className = '',
  id,
  inputRef,
}: CheckboxProps) => {
  // Locked-checked overrides regular checked semantics: visually a
  // checked box with an inner square, non-interactive.
  const isActive = lockedChecked || checked || indeterminate;
  const isDanger = state === 'danger' && !disabled && !lockedChecked;

  /* ── Box styles ───────────────────────────────────── */
  // Both sizes use literal pixels because spacing-17 isn't a token. The
  // 20px (md) value happens to match --spacing-20 but kept explicit for
  // symmetry with the sm case.
  const boxSizeClass = size === 'sm' ? 'w-[17px] h-[17px]' : 'w-[20px] h-[20px]';

  // Slot wrapper height matches the heading line-height so leading
  // elements center against the heading row regardless of box size.
  // Focus ring lives here (sibling of <input class="peer">), not on the
  // inner box span.
  const boxSlotClass = [
    'inline-flex items-center shrink-0',
    'min-h-[var(--leading-21)]',
    'rounded-[var(--radius-4)]',
    'peer-focus-visible:outline-none',
    'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-1',
    'peer-focus-visible:ring-[var(--button-primary-default-fill)]',
  ].join(' ');

  const boxBase = [
    'relative shrink-0',
    boxSizeClass,
    'rounded-[var(--radius-4)]',
    'border-2 border-solid',
    'transition-all duration-150',
    'flex items-center justify-center',
  ].join(' ');

  // Inner check icon scales proportionally with box size.
  const innerIconSize = size === 'sm' ? 10 : 12;
  // Inner square (locked-checked) is smaller than the box by the border
  // width × 2 plus a small inset, matching Figma's checkbox-checked-fixed
  // visual proportions (~9px for sm, ~10px for md).
  const innerSquareSize = size === 'sm' ? '9px' : '10px';

  let boxState: string;
  if (disabled) {
    boxState = isActive
      ? 'bg-[var(--checkbox-disabled)] border-[var(--checkbox-disabled)]'
      : 'bg-[var(--checkbox-disabled-inset)] border-[var(--checkbox-disabled)]';
  } else if (isDanger) {
    // Danger overrides hover/checked border — error state takes priority.
    boxState = isActive
      ? 'bg-[var(--checkbox-checked)] border-[var(--form-input-danger-border)]'
      : 'bg-[var(--checkbox-fill)] border-[var(--form-input-danger-border)] hover:border-[var(--form-input-danger-border)]';
  } else if (isActive) {
    boxState = 'bg-[var(--checkbox-checked)] border-[var(--checkbox-checked)]';
  } else {
    boxState = 'bg-[var(--checkbox-fill)] border-[var(--checkbox-default)] hover:border-[var(--checkbox-checked)]';
  }

  // Strip inherited line-height when the checkbox has no inner content.
  // Otherwise the label's bounding box picks up the parent's leading
  // (e.g. 17px in table headers) and the visible box is centered inside
  // that taller bounding box — which makes the box render visibly higher
  // than adjacent text inside an `items-center` parent. Live ERP renders
  // box-vs-text optically centered; this fix matches that.
  const hasInnerContent = Boolean(label || helperText);
  const labelLeading = hasInnerContent ? '' : 'leading-none';

  // Locked-checked is non-interactive — block the change.
  const isClickInert = disabled || lockedChecked;

  return (
    <label
      className={`inline-flex items-start gap-[var(--spacing-12)] select-none ${labelLeading} ${
        isClickInert ? 'cursor-not-allowed opacity-100' : 'cursor-pointer'
      } ${className}`}
      htmlFor={id}
    >
      {/* Native input — canonical focus target. `peer` makes the visible
          box-slot react to its :focus-visible state via peer-focus-visible:
          classes. lockedChecked is implemented as a checked + readOnly
          input so screen readers see "checked" but the user can't toggle. */}
      <input
        ref={inputRef}
        type="checkbox"
        id={id}
        checked={lockedChecked ? true : checked}
        disabled={disabled}
        readOnly={lockedChecked}
        onChange={() => {
          if (isClickInert) return;
          onChange?.(!checked);
        }}
        className="peer sr-only"
        aria-checked={indeterminate ? 'mixed' : (lockedChecked ? true : checked)}
        aria-invalid={isDanger || undefined}
      />

      {/* Visible box slot — 21px-tall flex slot wraps the box so it
          centers on the heading row's 21px line-height. */}
      <span className={boxSlotClass}>
        <span className={`${boxBase} ${boxState}`} aria-hidden="true">
          {isActive && (
            lockedChecked ? (
              // Inner green-on-green square per Figma checkbox-checked-fixed.
              <span
                className="block bg-[var(--color-white)]"
                style={{ width: innerSquareSize, height: innerSquareSize }}
              />
            ) : indeterminate ? (
              <Icon name="minus" size={innerIconSize} color={disabled ? 'var(--checkbox-disabled-inset)' : 'var(--color-white)'} />
            ) : (
              <Icon name="check" size={innerIconSize} color={disabled ? 'var(--checkbox-disabled-inset)' : 'var(--color-white)'} />
            )
          )}
        </span>
      </span>

      {/* Label + helper text. The pt-[var(--spacing-1)] hack from before
          Pattern C is gone — alignment now comes from the box-slot
          centering on the heading line-height. */}
      {(label || helperText) && (
        <span className="flex flex-col gap-[var(--spacing-4)] justify-center">
          {label && (
            <span
              className={`${bodyTextClasses} ${
                disabled
                  ? 'text-[color:var(--form-input-disabled-text)]'
                  : 'text-[color:var(--form-label-text)]'
              }`}
            >
              {label}
            </span>
          )}
          {helperText && (
            <span className={`${captionTextClasses} text-[color:var(--form-label-info-text)]`}>
              {helperText}
            </span>
          )}
        </span>
      )}
    </label>
  );
};
