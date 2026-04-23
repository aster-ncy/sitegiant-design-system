import React from 'react';

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
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange?.(value);
    }
  };

  /* ── Circle styles (token-driven) ──────────────────── */
  const circleBase = [
    'relative shrink-0',
    'w-[var(--spacing-20)] h-[var(--spacing-20)]',
    'rounded-full',
    'border-2 border-solid',
    'transition-all duration-150',
    'flex items-center justify-center',
  ].join(' ');

  let circleState: string;
  if (disabled) {
    circleState = selected
      ? 'bg-[var(--form-radio-disabled-fill)] border-[var(--form-radio-disabled-border)]'
      : 'bg-[var(--form-radio-disabled-fill)] border-[var(--form-radio-disabled-border)]';
  } else if (selected) {
    circleState = 'bg-[var(--form-radio-default-fill)] border-[var(--form-radio-selected-border)]';
  } else {
    circleState = 'bg-[var(--form-radio-default-fill)] border-[var(--form-radio-default-border)] hover:border-[var(--form-radio-selected-border)]';
  }

  return (
    <label
      className={`inline-flex items-start gap-[var(--spacing-8)] select-none ${
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

      {/* Custom radio circle */}
      <span
        className={`${circleBase} ${circleState}`}
        role="presentation"
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
      >
        {/* Inner dot when selected */}
        {selected && (
          <span
            className={`w-[var(--spacing-10)] h-[var(--spacing-10)] rounded-full ${
              disabled
                ? 'bg-[var(--form-radio-disabled-border)]'
                : 'bg-[var(--form-radio-selected-dot)]'
            } transition-all duration-150`}
          />
        )}
      </span>

      {/* Label + helper text */}
      {(label || helperText) && (
        <span className="flex flex-col gap-[var(--spacing-2)] pt-[var(--spacing-1)]">
          {label && (
            <span
              className={`text-[length:var(--text-14)] leading-[var(--leading-17)] font-[var(--font-weight-regular)] font-[family-name:var(--font-sans)] ${
                disabled
                  ? 'text-[color:var(--form-input-disabled-text)]'
                  : 'text-[color:var(--form-label-text)]'
              }`}
            >
              {label}
            </span>
          )}
          {helperText && (
            <span className="text-[length:var(--text-12)] leading-[var(--leading-15)] text-[color:var(--form-label-info-text)]">
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
