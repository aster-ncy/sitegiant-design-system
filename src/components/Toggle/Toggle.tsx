/* ── Typography recipes (Pattern C — selection-control labels) ────────── */
/* Label: 14 / 21 / regular — body. Per Figma node 1152:190 + 1165:239,
 * toggle option labels share the body/form-label recipe (both alias to
 * identical numbers; using --general-body-* to match Checkbox/Radio). */
const bodyTextClasses =
  'text-[length:var(--general-body-size)] leading-[var(--general-body-lineheight)] ' +
  'font-[family-name:var(--general-font-family)] font-[weight:var(--general-body-weight)]';

/* Helper / hint text: 12 / 17 / regular — caption. */
const captionTextClasses =
  'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)] ' +
  'font-[family-name:var(--general-font-family)] font-[weight:var(--general-caption-weight)]';

export type ToggleVariant = 'default' | 'special';
export type ToggleLayout = 'horizontal' | 'vertical';

export interface ToggleProps {
  /** Whether the toggle is on */
  checked?: boolean;
  /** Visual variant: default (green, 44×25) or special (blue, 24×12) per Figma 1165:218 / 2351:732. */
  variant?: ToggleVariant;
  /**
   * Layout direction.
   * - `horizontal` (default): label beside the toggle (Figma 1222:1051 type='Horizontal').
   * - `vertical`: label above the toggle (Figma 1165:239 type='Default').
   */
  layout?: ToggleLayout;
  /**
   * Whether the toggle is disabled. Combined with `checked={true}`,
   * this renders the "Checked by Default" / system-required look
   * (Figma 2905:4928): faded green track + crisp knob, non-interactive.
   */
  disabled?: boolean;
  /** Label text */
  label?: string;
  /** Helper text below the label */
  helperText?: string;
  /** Change handler */
  onChange?: (checked: boolean) => void;
  /** Extra classes */
  className?: string;
  /** HTML id */
  id?: string;
}

/*
 * Figma spec (Form/toggle):
 * - Default variant: 44×25 track + 25×25 knob (knob travels 19px) per
 *   Figma 1165:218.
 * - Special variant: 24×12 track + 12×12 knob (knob travels 12px) per
 *   Figma 2351:732 — stays blue in both off/on states.
 * - Toggle Container (the surrounding frame): 33px tall with py-4,
 *   per Figma 1165:238 (vertical) and 1222:1054 (horizontal).
 * - States: unchecked, checked (default green), checked (special blue),
 *   disabled, disabled+checked ("Checked by Default" / lockedChecked).
 */

/**
 * SiteGiant Toggle / Switch component.
 *
 * Token-driven from Figma Form/toggle section.
 * Variants: default (green), special (blue)
 * States: off, on, disabled
 */
export const Toggle = ({
  checked = false,
  variant = 'default',
  layout = 'horizontal',
  disabled = false,
  label,
  helperText,
  onChange,
  className = '',
  id,
}: ToggleProps) => {
  const isOn = checked;

  /* ── Sizing by variant per Figma ──────────────────────
   * default: 44×25 track + 25×25 knob (knob travels 19px)
   * special:  24×12 track + 12×12 knob (knob travels 12px)
   * Knob is the full height of the track (full-pill style). */
  const isSpecial = variant === 'special';
  const trackSize = isSpecial ? 'w-[24px] h-[12px]' : 'w-[44px] h-[25px]';
  const knobSize = isSpecial ? 'size-[12px]' : 'size-[25px]';
  // Translate distance — applied via inline style (Tailwind v4's JIT
  // can't extract arbitrary translate-x-[<px>] values built from
  // template strings at build time, so the class would be ignored).
  const knobTranslateX = isSpecial ? 12 : 19;

  /* ── Track styles ──────────────────────────────────── */
  const trackBase = [
    'relative shrink-0',
    trackSize,
    'rounded-full',
    'transition-colors duration-200',
    'flex items-center',
  ].join(' ');

  // All track variants use INSIDE borders via inline box-shadow inset
  // (consistent with the knob — required so the inset ring stays
  // aligned to the track edge regardless of opacity). Tailwind v4's
  // JIT can't extract template-built arbitrary values, so we set
  // box-shadow as inline style.
  // Special variant (Figma 2351:732 / 2353:798) stays blue on BOTH
  // off and on states — the only state difference is knob position.
  let trackState: string;
  let trackBoxShadow: string;
  if (isSpecial) {
    // Special variant: always blue, off or on.
    trackState = 'bg-[var(--form-toggle-special-fill)]';
    trackBoxShadow = 'inset 0 0 0 1px var(--form-toggle-special-border)';
  } else if (isOn) {
    trackState = 'bg-[var(--form-toggle-checked-fill)]';
    trackBoxShadow = 'inset 0 0 0 1px var(--form-toggle-checked-border)';
  } else {
    trackState = 'bg-[var(--form-toggle-default-fill)]';
    trackBoxShadow = 'inset 0 0 0 1px var(--form-toggle-default-border)';
  }
  // disabled applies opacity to the whole track + knob. Combined with
  // checked={true} this produces the "Checked by Default" / system-
  // required look from Figma 2905:4928 — faded green/blue track,
  // crisp knob, non-interactive.
  if (disabled) {
    trackState += ' opacity-50';
  }

  /* ── Knob styles ───────────────────────────────────── */
  // Knob border is drawn as an INSET ring (box-shadow inset) so it
  // never extends past the track edge when the knob sits flush right.
  // The drop shadow (also box-shadow) is layered alongside the inset
  // ring per Figma 2262:218. Box-shadow is set via inline style because
  // Tailwind v4's JIT can't extract token-interpolated arbitrary values
  // built from template strings at build time.
  const knobBase = [
    knobSize,
    'rounded-full',
    'transition-transform duration-200 ease-in-out',
    'shrink-0',
  ].join(' ');

  // Knob ring color: special variant always uses the blue border;
  // default variant uses green-when-on, grey-when-off.
  const knobRingVar = isSpecial
    ? 'var(--form-toggle-special-border)'
    : isOn
      ? 'var(--form-toggle-checked-knob-border)'
      : 'var(--form-toggle-default-knob-border)';
  const knobBoxShadow = `inset 0 0 0 1px ${knobRingVar}, 0 1px 2px 0 rgba(0,0,0,0.16)`;

  // Knob fill: white when special or when on; grey-default-knob-fill otherwise.
  const knobState =
    isOn || isSpecial
      ? 'bg-[var(--form-toggle-checked-knob-fill)]'
      : 'bg-[var(--form-toggle-default-knob-fill)]';

  // (trackSlotClass is computed below after `isVertical` is declared.)

  // Layout: horizontal places the toggle beside the label-stack;
  // vertical stacks the toggle below the label (Figma 1165:239 default).
  const isVertical = layout === 'vertical';
  // Horizontal uses items-start so the toggle pairs with the LABEL
  // line of the label-stack (not the combined label+hint stack); the
  // 21px outer wrapper around the 33px Toggle Container carries that
  // alignment (see horizontalToggleWrapper below). Vertical stacks
  // (column flow), so items-start is natural.
  const rootLayoutClass = isVertical
    ? 'inline-flex flex-col items-start gap-[var(--spacing-4)]'
    : 'inline-flex items-start gap-[var(--spacing-12)]';

  // Toggle Container — canonical 33px frame in BOTH layouts per Figma
  // 1165:238 (vertical) and 1222:1054 (horizontal): 4px top + 25px
  // track + 4px bottom.
  const trackSlotClass =
    'inline-flex items-center justify-center shrink-0 h-[33px] py-[var(--spacing-4)]';

  // Horizontal-only outer wrapper — a 21px line-height slot that
  // vertical-centers the 33px Toggle Container around the LABEL line.
  // The 33px container overflows ±6px outside this slot (overflow is
  // visual, no clipping). With the row set to items-start, the toggle
  // aligns to the label's first text line regardless of whether
  // helperText pushes the stack to ~38px tall.
  const horizontalToggleWrapperClass = isVertical
    ? ''
    : 'inline-flex items-center justify-center shrink-0 h-[var(--leading-21)]';

  return (
    <label
      className={`${rootLayoutClass} select-none ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      htmlFor={id}
    >
      {/* Label-stack — sits above the toggle in vertical (column flow)
          and to the LEFT of the toggle in horizontal (row flow) per
          Figma 1165:239 / 1222:1051. Rendered first in DOM in both
          layouts so the row order is label → toggle. */}
      {(label || helperText) && (
        <span className="flex flex-col gap-[var(--spacing-4)]">
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

      {/* Native input — canonical focus target. The browser handles
          space/enter natively; the visible track paints a focus ring
          via peer-focus-visible: when the input has visible focus.
          Avoids a duplicate keyboard target. */}
      <input
        type="checkbox"
        role="switch"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={() => {
          if (disabled) return;
          onChange?.(!checked);
        }}
        className="peer sr-only"
        aria-checked={checked}
      />

      {/* Toggle Container — canonical 33px frame. In horizontal layout
          it's wrapped in a 21px outer slot so the 33px frame centers
          around the label's first text line (track-center coincides
          with label-line center); helperText hangs below without
          dragging the toggle down. Focus ring lives on whichever span
          is a direct sibling of <input class='peer'>: the 33px slot in
          vertical, the 21px wrapper in horizontal. */}
      {isVertical ? (
        <span
          className={`${trackSlotClass} rounded-full peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-[var(--button-primary-default-fill)]`}
        >
          <span
            className={`${trackBase} ${trackState}`}
            style={{ boxShadow: trackBoxShadow }}
            aria-hidden="true"
          >
            <span
              className={`${knobBase} ${knobState}`}
              style={{
                boxShadow: knobBoxShadow,
                transform: `translateX(${isOn ? knobTranslateX : 0}px)`,
              }}
            />
          </span>
        </span>
      ) : (
        // Horizontal: 21px outer slot carries the peer-focus-visible
        // ring (the input + this wrapper are direct siblings of <label>,
        // so the peer selector resolves correctly). Inner 33px slot
        // overflows by ±6px around the label-line center.
        <span
          className={`${horizontalToggleWrapperClass} rounded-full peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-[var(--button-primary-default-fill)]`}
        >
          <span className={trackSlotClass}>
            <span
              className={`${trackBase} ${trackState}`}
              style={{ boxShadow: trackBoxShadow }}
              aria-hidden="true"
            >
              <span
                className={`${knobBase} ${knobState}`}
                style={{
                  boxShadow: knobBoxShadow,
                  transform: `translateX(${isOn ? knobTranslateX : 0}px)`,
                }}
              />
            </span>
          </span>
        </span>
      )}
    </label>
  );
};
