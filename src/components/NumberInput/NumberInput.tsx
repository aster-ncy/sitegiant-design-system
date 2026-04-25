import { useState } from 'react';
import type { Ref } from 'react';
import { Icon } from '../Icon';

export type NumberInputState =
  | 'default'
  | 'disabled'
  | 'readonly'
  | 'readonly-bold';
export type NumberInputValidation = 'default' | 'error' | 'success';

export interface NumberInputProps {
  /** Controlled value. Use empty string for "no value". */
  value?: string;
  /** Uncontrolled default value. */
  defaultValue?: string;
  /** Placeholder when empty. */
  placeholder?: string;
  /** Min allowed value (clamps stepper increments). */
  min?: number;
  /** Max allowed value (clamps stepper increments). */
  max?: number;
  /** Step amount per up/down click. Default 1. */
  step?: number;
  /** Visual state. */
  state?: NumberInputState;
  /** Validation status — only affects the wrapper border. */
  validation?: NumberInputValidation;
  /** Change handler — called with the new string value. */
  onChange?: (value: string) => void;
  /** HTML id for the native <input>. */
  id?: string;
  /** Name attribute for the native <input>. */
  name?: string;
  className?: string;
  /** Ref forwarded to the native <input>. */
  inputRef?: Ref<HTMLInputElement>;
  /**
   * If true, hides the custom stepper buttons (used when NumberInput
   * is composed inside NumberRange's compound shell, where the parent
   * could optionally show shared steppers — for now Figma keeps them
   * per-field, so this defaults to false).
   */
  hideStepper?: boolean;
}

const wrapperBorderByValidation: Record<NumberInputValidation, string> = {
  default: 'border-[var(--form-input-default-border)]',
  error: 'border-[var(--form-input-danger-border)]',
  success: 'border-[var(--form-input-default-border)]',
};

const clamp = (n: number, min?: number, max?: number) => {
  if (min != null && n < min) return min;
  if (max != null && n > max) return max;
  return n;
};

/**
 * NumberInput — Figma: Form Value / Type=Number Range (single field).
 *
 * A numeric input with custom up/down stepper buttons stacked on the
 * right edge of the field. Replaces the browser's native number stepper
 * with a token-driven UI matching Figma. Composes inside NumberRange
 * for paired min/max ranges.
 *
 * Steppers are click-once (no hold-to-repeat). Each click +1 / -1 by
 * `step` (default 1), clamped to `min` / `max` if set.
 */
export const NumberInput = ({
  value,
  defaultValue,
  placeholder,
  min,
  max,
  step = 1,
  state = 'default',
  validation = 'default',
  onChange,
  id,
  name,
  className = '',
  inputRef,
  hideStepper = false,
}: NumberInputProps) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(defaultValue ?? '');
  const currentValue = isControlled ? value : internalValue;

  const isDisabled = state === 'disabled';
  const isReadonly = state === 'readonly' || state === 'readonly-bold';
  const isReadonlyBold = state === 'readonly-bold';
  const isError = validation === 'error' && !isDisabled && !isReadonly;

  const setValue = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const adjust = (delta: number) => {
    if (isDisabled || isReadonly) return;
    const parsed = currentValue === '' ? 0 : Number(currentValue);
    const next = Number.isFinite(parsed)
      ? clamp(parsed + delta, min, max)
      : clamp(delta, min, max);
    setValue(String(next));
  };

  const wrapperClasses = [
    'inline-flex items-stretch',
    isReadonly ? 'w-fit' : 'w-full',
    'rounded-[var(--radius-4)]',
    'overflow-hidden',
    isReadonly ? '' : 'border border-solid',
    isReadonly ? '' : wrapperBorderByValidation[validation],
    isDisabled
      ? 'bg-[var(--form-input-disabled-fill)] cursor-not-allowed opacity-60'
      : isReadonly
        ? 'bg-transparent cursor-default'
        : 'bg-[var(--form-input-default-fill)]',
    !isDisabled && !isReadonly && !isError
      ? 'focus-within:border-[var(--form-input-focus-border)]'
      : '',
    'transition-colors duration-150',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={[wrapperClasses, className].filter(Boolean).join(' ')}>
      {isReadonly ? (
        // Readonly states render as plain text — no native <input> needed.
        // Sized to fit content so a NumberRange like "10 — 300" reads as a
        // tight phrase, not stretched across the row.
        <span
          aria-readonly="true"
          className={[
            'inline-flex items-center',
            'py-[var(--spacing-6)]',
            'text-[length:var(--text-14)] leading-[var(--leading-21)]',
            'font-[family-name:var(--font-sans)]',
            isReadonlyBold
              ? 'font-[var(--font-weight-bold)]'
              : 'font-[var(--font-weight-regular)]',
            'text-[color:var(--form-input-value-text)]',
            'whitespace-nowrap',
          ].join(' ')}
        >
          {currentValue}
        </span>
      ) : (
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="number"
          inputMode="numeric"
          value={currentValue}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          disabled={isDisabled}
          aria-invalid={isError || undefined}
          onChange={(e) => setValue(e.target.value)}
          className={[
            'flex-1 min-w-0',
            'bg-transparent outline-none border-none',
            // Hide native browser stepper — we render our own.
            '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            'pl-[var(--spacing-12)] pr-[var(--spacing-8)] py-[var(--spacing-6)]',
            'text-[length:var(--text-14)] leading-[var(--leading-21)]',
            'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
            isDisabled
              ? 'text-[color:var(--form-input-disabled-text)]'
              : 'text-[color:var(--form-input-value-text)]',
            'placeholder:text-[color:var(--form-input-placeholder-text)]',
            isDisabled ? 'cursor-not-allowed' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        />
      )}

      {/* Custom up/down stepper — hidden in readonly/disabled by visual choice
          (steppers would be unusable in those states anyway). The two buttons
          fill the wrapper's full height (top + bottom halves), with a 1px
          divider between them and a left border separating them from the
          input value column. */}
      {!hideStepper && !isReadonly && !isDisabled && (
        <div
          aria-hidden="true"
          className="flex flex-col self-stretch shrink-0 border-l border-solid border-[var(--form-input-default-border)]"
        >
          <button
            type="button"
            tabIndex={-1}
            onClick={() => adjust(step)}
            aria-label="Increment"
            className={[
              'flex flex-1 items-center justify-center',
              'w-[16px]',
              'bg-[var(--form-input-default-fill)]',
              'cursor-pointer outline-none',
              'hover:bg-[var(--color-space-lighter)]',
            ].join(' ')}
          >
            <Icon
              name="arrow-up"
              size={15}
              className="text-[color:var(--color-icon-secondary)]"
            />
          </button>
          <div
            className="border-t border-solid border-[var(--form-input-default-border)]"
            aria-hidden="true"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => adjust(-step)}
            aria-label="Decrement"
            className={[
              'flex flex-1 items-center justify-center',
              'w-[16px]',
              'bg-[var(--form-input-default-fill)]',
              'cursor-pointer outline-none',
              'hover:bg-[var(--color-space-lighter)]',
            ].join(' ')}
          >
            <Icon
              name="arrow-down"
              size={15}
              className="text-[color:var(--color-icon-secondary)]"
            />
          </button>
        </div>
      )}
    </div>
  );
};
