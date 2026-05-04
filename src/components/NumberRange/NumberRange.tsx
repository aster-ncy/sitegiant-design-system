import { useState } from 'react';
import { Icon } from '../Icon';
import { NumberInput, type NumberInputState, type NumberInputValidation, type NumberInputSize } from '../NumberInput';

/* ── Typography recipes (Figma Form Value section) ──────────────────────── */
const captionTextClasses =
  'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)] ' +
  'font-[family-name:var(--general-font-family)] font-[weight:var(--general-caption-weight)]';

export interface NumberRangeValue {
  min: string;
  max: string;
}

export interface NumberRangeProps {
  /** Controlled value pair. */
  value?: NumberRangeValue;
  /** Uncontrolled default. */
  defaultValue?: NumberRangeValue;
  /** Placeholder for the min field. */
  minPlaceholder?: string;
  /** Placeholder for the max field. */
  maxPlaceholder?: string;
  /** Lower-bound clamp for the min field's stepper. */
  min?: number;
  /** Upper-bound clamp for the max field's stepper. */
  max?: number;
  /** Stepper increment. */
  step?: number;
  /** Visual state — applied to BOTH fields. */
  state?: NumberInputState;
  /** Validation status — applied to BOTH fields. */
  validation?: NumberInputValidation;
  /** Form size — 'slim' reduces vertical padding for compact layouts */
  size?: NumberInputSize;
  /** Helper text below the field row. */
  helperText?: string;
  /** Change handler — fires when either field changes. */
  onChange?: (value: NumberRangeValue) => void;
  /** Optional id prefix for the inputs (uses `${id}-min`, `${id}-max`). */
  id?: string;
  className?: string;
}

/**
 * NumberRange — Figma: Form Value / Type=Number Range.
 *
 * A pair of NumberInputs with a decorative chevron-down separator
 * between them, representing a "min ~ max" numeric range. Useful for
 * filters like price-range, quantity-range, weight-range, etc.
 *
 * The chevron is decorative ("between") — it is NOT an operator picker.
 * If you need >= / <= / = / between, compose your own with a Dropdown
 * + a single NumberInput beside it.
 *
 * State + validation apply to both fields uniformly. Helper text turns
 * red on `validation='error'`.
 */
export const NumberRange = ({
  value,
  defaultValue,
  minPlaceholder = 'Min.',
  maxPlaceholder = 'Max.',
  min,
  max,
  step,
  size = 'default',
  state = 'default',
  validation = 'default',
  helperText,
  onChange,
  id,
  className = '',
}: NumberRangeProps) => {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<NumberRangeValue>(
    defaultValue ?? { min: '', max: '' },
  );
  const current = isControlled ? value : internal;

  const isError = validation === 'error';
  const helperColor = isError
    ? 'text-[color:var(--color-sys-red-DEFAULT)]'
    : 'text-[color:var(--color-text-info)]';

  const update = (next: NumberRangeValue) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const isReadonly = state === 'readonly' || state === 'readonly-bold';
  // In readonly states the values + dash sit close together as a phrase
  // (e.g. "10 — 300"), not stretched across the row. In editable states the
  // two fields share the row width 50/50 with the dash centred.
  const fieldShellClass = isReadonly ? 'shrink-0' : 'flex-1 min-w-0';

  return (
    <div className={['flex flex-col gap-[var(--spacing-4)] w-full', className].filter(Boolean).join(' ')}>
      <div className="flex items-center gap-[var(--spacing-6)]">
        <div className={fieldShellClass}>
          <NumberInput
            id={id ? `${id}-min` : undefined}
            value={current.min}
            placeholder={minPlaceholder}
            min={min}
            max={max}
            step={step}
            size={size}
            state={state}
            validation={validation}
            onChange={(next) => update({ min: next, max: current.max })}
          />
        </div>
        <Icon
          name="minus"
          size={21}
          aria-hidden="true"
          className="text-[color:var(--color-icon-secondary)] shrink-0"
        />
        <div className={fieldShellClass}>
          <NumberInput
            id={id ? `${id}-max` : undefined}
            value={current.max}
            placeholder={maxPlaceholder}
            min={min}
            max={max}
            step={step}
            size={size}
            state={state}
            validation={validation}
            onChange={(next) => update({ min: current.min, max: next })}
          />
        </div>
      </div>
      {helperText && (
        <span
          className={[
            captionTextClasses,
            helperColor,
          ].join(' ')}
        >
          {helperText}
        </span>
      )}
    </div>
  );
};
