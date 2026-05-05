import type { KeyboardEvent } from 'react';

/* ── Typography recipes (Pattern C — selection-control labels) ────────── */
/* Label: 14 / 21 / regular — body. Per Figma node 1015:108 + 1476:9438,
 * radio option labels share the same body/form-label recipe (both alias
 * to identical numbers; using --general-body-* to match Checkbox/Toggle). */
const bodyTextClasses =
  'text-[length:var(--general-body-size)] leading-[var(--general-body-lineheight)] ' +
  'font-[family-name:var(--general-font-family)] font-[weight:var(--general-body-weight)]';

/* Helper / hint text: 12 / 17 / regular — caption. */
const captionTextClasses =
  'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)] ' +
  'font-[family-name:var(--general-font-family)] font-[weight:var(--general-caption-weight)]';

export interface RadioOption {
  /** Unique value for this radio option */
  value: string;
  /** Display label */
  label: string;
  /** Helper text below the label */
  helperText?: string;
  /** Whether this option is disabled */
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** Radio group name (for HTML form grouping) */
  name: string;
  /** Array of options to render */
  options: RadioOption[];
  /** Currently selected value */
  value?: string;
  /** Whether the entire group is disabled */
  disabled?: boolean;
  /** Layout direction */
  direction?: 'vertical' | 'horizontal';
  /** Change handler */
  onChange?: (value: string) => void;
  /** Extra classes */
  className?: string;
}

export interface RadioProps {
  /** Unique value */
  value: string;
  /** Display label */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Whether this radio is selected */
  selected?: boolean;
  /** Whether this radio is disabled */
  disabled?: boolean;
  /** Radio group name */
  name?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Extra classes */
  className?: string;
}

/**
 * SiteGiant Radio component.
 *
 * Token-driven from Figma Form/radio section.
 * States: default, selected, disabled, disabled+selected
 */
export const Radio = ({
  value,
  label,
  helperText,
  selected = false,
  disabled = false,
  name,
  onChange,
  className = '',
}: RadioProps) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange?.(value);
    }
  };

  /* ── Circle styles ──────────────────────────────────
   * Per Figma RadioValue (1476:9438): the circle is 17×17 with a 1.5px
   * border (rendered via --border-2 token). Selected state shows a
   * smaller inner dot per the 2.5px gap convention shared with the
   * Checkbox-indeterminate dot. */
  const circleBase = [
    'relative shrink-0',
    'w-[17px] h-[17px]',
    'rounded-full',
    'border-[length:var(--border-2)] border-solid',
    'transition-all duration-150',
    'flex items-center justify-center',
  ].join(' ');

  // Slot wrapper centers the 17px circle in a 21px-tall slot so it
  // visually aligns with the heading row's 21px line-height — same
  // convention as Checkbox.
  const circleSlotClass = [
    'inline-flex items-center shrink-0',
    'min-h-[var(--leading-21)]',
    'rounded-full',
  ].join(' ');

  // Per Figma 2277:6649 (radio-checked): selected state has GREEN border
  // (matching the green inner dot). Default/unselected uses the grey
  // default-border with a hover transition to green.
  let circleState: string;
  if (disabled) {
    circleState = 'bg-[var(--form-radio-disabled-fill)] border-[var(--form-radio-disabled-border)]';
  } else if (selected) {
    circleState = 'bg-[var(--form-radio-default-fill)] border-[var(--form-radio-selected-border)]';
  } else {
    circleState = 'bg-[var(--form-radio-default-fill)] border-[var(--form-radio-default-border)] hover:border-[var(--form-radio-selected-border)]';
  }

  return (
    <label
      className={`inline-flex items-start gap-[var(--spacing-12)] select-none ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
    >
      {/* Hidden native input for a11y */}
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        disabled={disabled}
        onChange={() => onChange?.(value)}
        className="sr-only"
      />

      {/* Circle slot — 21px-tall flex slot wraps the 17px circle so it
          centers on the heading row's 21px line-height. */}
      <span className={circleSlotClass}>
        <span
          className={`${circleBase} ${circleState}`}
          role="presentation"
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
        >
          {/* Inner selected dot — 9px (17 − 1.5×2 border − 2.5×2 gap = 9). */}
          {selected && (
            <span
              className={`w-[9px] h-[9px] rounded-full ${
                disabled
                  ? 'bg-[var(--form-radio-disabled-border)]'
                  : 'bg-[var(--form-radio-selected-dot)]'
              } transition-all duration-150`}
            />
          )}
        </span>
      </span>

      {/* Label + helper text — drops the pt-[var(--spacing-1)] hack
          that was tuned for the old 17px label leading. With the
          circle now in its own 21px slot above, alignment comes from
          the slot centering on the heading line-height. */}
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

/**
 * SiteGiant RadioGroup component.
 *
 * Renders a group of Radio options vertically or horizontally.
 *
 * @example
 * <RadioGroup name="plan" options={[{value:'free',label:'Free'},{value:'pro',label:'Pro'}]} />
 */
export const RadioGroup = ({
  name,
  options,
  value,
  disabled = false,
  direction = 'vertical',
  onChange,
  className = '',
}: RadioGroupProps) => {
  return (
    <div
      className={`flex ${
        direction === 'horizontal'
          ? 'flex-row gap-[var(--spacing-24)]'
          : 'flex-col gap-[var(--spacing-12)]'
      } ${className}`}
      role="radiogroup"
    >
      {options.map((opt) => (
        <Radio
          key={opt.value}
          value={opt.value}
          label={opt.label}
          helperText={opt.helperText}
          selected={value === opt.value}
          disabled={disabled || opt.disabled}
          name={name}
          onChange={onChange}
        />
      ))}
    </div>
  );
};
