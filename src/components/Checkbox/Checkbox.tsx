import type { KeyboardEvent } from 'react';
import { Icon } from '../Icon';

export interface CheckboxProps {
  /** Whether the checkbox is checked */
  checked?: boolean;
  /** Whether the checkbox is in indeterminate state */
  indeterminate?: boolean;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
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
}

/**
 * SiteGiant Checkbox component.
 *
 * Token-driven implementation from Figma Form/checkbox section.
 * States: unchecked, checked, indeterminate, disabled (+checked), disabled (+unchecked)
 *
 * @example
 * <Checkbox label="Agree to terms" checked={true} onChange={setChecked} />
 */
export const Checkbox = ({
  checked = false,
  indeterminate = false,
  disabled = false,
  label,
  helperText,
  onChange,
  className = '',
  id,
}: CheckboxProps) => {
  const isActive = checked || indeterminate;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange?.(!checked);
    }
  };

  /* ── Box styles (token-driven) ─────────────────────── */
  const boxBase = [
    'relative shrink-0',
    'w-[var(--spacing-20)] h-[var(--spacing-20)]',
    'rounded-[var(--radius-4)]',
    'border-2 border-solid',
    'transition-all duration-150',
    'flex items-center justify-center',
  ].join(' ');

  let boxState: string;
  if (disabled) {
    boxState = isActive
      ? 'bg-[var(--checkbox-disabled)] border-[var(--checkbox-disabled)]'
      : 'bg-[var(--checkbox-disabled-inset)] border-[var(--checkbox-disabled)]';
  } else if (isActive) {
    boxState = 'bg-[var(--checkbox-checked)] border-[var(--checkbox-checked)]';
  } else {
    boxState = 'bg-[var(--checkbox-fill)] border-[var(--checkbox-default)] hover:border-[var(--checkbox-checked)]';
  }

  return (
    <label
      className={`inline-flex items-start gap-[var(--spacing-8)] select-none ${
        disabled ? 'cursor-not-allowed opacity-100' : 'cursor-pointer'
      } ${className}`}
      htmlFor={id}
    >
      {/* Hidden native input for a11y */}
      <input
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange?.(!checked)}
        className="sr-only"
        aria-checked={indeterminate ? 'mixed' : checked}
      />

      {/* Custom checkbox box */}
      <span
        className={`${boxBase} ${boxState}`}
        role="presentation"
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
      >
        {isActive && (
          indeterminate ? (
            <Icon name="minus" size={12} color={disabled ? 'var(--checkbox-disabled-inset)' : 'var(--color-white)'} />
          ) : (
            <Icon name="check" size={12} color={disabled ? 'var(--checkbox-disabled-inset)' : 'var(--color-white)'} />
          )
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
