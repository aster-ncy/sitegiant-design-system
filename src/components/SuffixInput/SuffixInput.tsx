import { useState } from 'react';
import type { Ref } from 'react';
import { Icon } from '../Icon';

export type SuffixInputState = 'default' | 'disabled' | 'readonly' | 'readonly-bold';
export type SuffixInputValidation = 'default' | 'error' | 'success' | 'warning';
export type SuffixInputSize = 'default' | 'slim';

export interface SuffixInputProps {
  /** Suffix label shown after the divider (e.g. "kg", "USD", "%"). */
  suffix: string;
  /** Controlled numeric value. Use empty string for "no value". */
  value?: string;
  /** Uncontrolled default value. */
  defaultValue?: string;
  /** Placeholder for the number field. */
  placeholder?: string;
  /** Visual state. */
  state?: SuffixInputState;
  /** Validation status — drives border color + helperText color. */
  validation?: SuffixInputValidation;
  /** Helper text shown below the field. */
  helperText?: string;
  /** Form size — 'slim' reduces vertical padding for compact layouts. */
  size?: SuffixInputSize;
  /** Called with the new string value. */
  onChange?: (value: string) => void;
  /** HTML id for the native <input>. */
  id?: string;
  /** Name attribute for the native <input>. */
  name?: string;
  className?: string;
  /** Ref forwarded to the native <input>. */
  inputRef?: Ref<HTMLInputElement>;
}

const wrapperBorderByValidation: Record<SuffixInputValidation, string> = {
  default: 'border-[var(--form-input-default-border)]',
  error: 'border-[var(--form-input-danger-border)]',
  success: 'border-[var(--form-input-default-border)]',
  // Warning matches error red per Figma — only the icon shape differs.
  warning: 'border-[var(--form-input-danger-border)]',
};

/**
 * SuffixInput — Figma: Form field with Suffix (1972:1042).
 *
 * A number input with a small unit-label tag pinned to the right side
 * of the field, separated by a vertical divider (e.g. "0.00 | kg").
 * Mirrors PrefixInput's visual shell but for trailing units.
 *
 * Right-aligned numeric value, fixed unit on the right, optional
 * external validation icon (close / check / alert-triangle) outside
 * the field on the right, mirroring Input's pattern.
 */
export const SuffixInput = ({
  suffix,
  value,
  defaultValue,
  placeholder = '0.00',
  state = 'default',
  validation = 'default',
  helperText,
  size = 'default',
  onChange,
  id,
  name,
  className = '',
  inputRef,
}: SuffixInputProps) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(defaultValue ?? '');
  const currentValue = isControlled ? value : internalValue;

  const isDisabled = state === 'disabled';
  const isReadonly = state === 'readonly' || state === 'readonly-bold';
  const isReadonlyBold = state === 'readonly-bold';
  const isError = validation === 'error' && !isDisabled && !isReadonly;
  const isSuccess = validation === 'success' && !isDisabled && !isReadonly;
  const isWarning = validation === 'warning' && !isDisabled && !isReadonly;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const cellPaddingY = size === 'slim' ? 'py-[var(--spacing-2)]' : 'py-[var(--spacing-6)]';

  if (isReadonly) {
    return (
      <div
        className={[
          'inline-flex flex-col gap-[var(--spacing-4)] items-start',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="inline-flex items-center gap-[var(--spacing-8)]">
          <span
            aria-readonly="true"
            className={[
              'text-[length:var(--text-14)] leading-[var(--leading-21)]',
              'font-[family-name:var(--font-sans)]',
              isReadonlyBold ? 'font-[var(--font-weight-bold)]' : 'font-[var(--font-weight-regular)]',
              'text-[color:var(--form-input-value-text)]',
              'whitespace-nowrap',
            ].join(' ')}
          >
            {currentValue} {suffix}
          </span>
          {(isError || isSuccess || isWarning) && (
            <Icon
              name={isError ? 'close' : isWarning ? 'alert-triangle' : 'check'}
              size={21}
              className={[
                'shrink-0',
                isError || isWarning
                  ? 'text-[color:var(--color-sys-red-DEFAULT)]'
                  : 'text-[color:var(--color-sys-green-DEFAULT)]',
              ].join(' ')}
            />
          )}
        </div>
        {helperText && (
          <span
            className={[
              'text-[length:var(--text-12)] leading-[var(--leading-15)]',
              'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
              isError || isWarning
                ? 'text-[color:var(--color-sys-red-DEFAULT)]'
                : 'text-[color:var(--form-label-info-text)]',
            ].join(' ')}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={[
        'inline-flex flex-col gap-[var(--spacing-4)] items-start',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="inline-flex items-center gap-[var(--spacing-8)]">
        <div
          className={[
            'inline-flex items-stretch',
            'border border-solid rounded-[var(--radius-4)]',
            wrapperBorderByValidation[validation],
            isDisabled
              ? 'bg-[var(--form-input-disabled-fill)] cursor-not-allowed opacity-60'
              : 'bg-[var(--form-input-default-fill)]',
            !isDisabled && !isError
              ? 'focus-within:border-[var(--form-input-focus-border)]'
              : '',
            'transition-colors duration-150',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {/* Number cell — right-aligned. */}
          <input
            ref={inputRef}
            id={id}
            name={name}
            type="number"
            inputMode="decimal"
            value={currentValue}
            placeholder={placeholder}
            disabled={isDisabled}
            aria-invalid={isError || undefined}
            onChange={handleChange}
            className={[
              'min-w-0 w-[80px]',
              'bg-transparent outline-none border-none',
              `px-[var(--spacing-8)] ${cellPaddingY}`,
              // Hide native browser stepper; consumers wanting steppers
              // should use NumberInput instead.
              '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
              'text-right',
              'text-[length:var(--text-14)] leading-[var(--leading-21)]',
              'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
              isDisabled
                ? 'text-[color:var(--form-input-disabled-text)] cursor-not-allowed'
                : 'text-[color:var(--form-input-value-text)]',
              'placeholder:text-[color:var(--form-input-placeholder-text)]',
            ].join(' ')}
          />

          {/* Vertical divider between value and suffix. */}
          <div
            aria-hidden="true"
            className="self-stretch border-l border-solid border-[var(--form-input-default-border)]"
          />

          {/* Suffix cell — fixed unit label. */}
          <div
            className={[
              'inline-flex items-center justify-center shrink-0',
              `px-[var(--spacing-8)] ${cellPaddingY}`,
              'text-[length:var(--text-14)] leading-[var(--leading-21)]',
              'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
              isDisabled
                ? 'text-[color:var(--form-input-disabled-text)]'
                : 'text-[color:var(--form-input-value-text)]',
            ].join(' ')}
          >
            {suffix}
          </div>
        </div>

        {(isError || isSuccess || isWarning) && (
          <Icon
            name={isError ? 'close' : isWarning ? 'alert-triangle' : 'check'}
            size={21}
            className={[
              'shrink-0',
              isError || isWarning
                ? 'text-[color:var(--color-sys-red-DEFAULT)]'
                : 'text-[color:var(--color-sys-green-DEFAULT)]',
            ].join(' ')}
          />
        )}
      </div>

      {helperText && (
        <span
          className={[
            'text-[length:var(--text-12)] leading-[var(--leading-15)]',
            'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
            isError || isWarning
              ? 'text-[color:var(--color-sys-red-DEFAULT)]'
              : 'text-[color:var(--form-label-info-text)]',
          ].join(' ')}
        >
          {helperText}
        </span>
      )}
    </div>
  );
};
