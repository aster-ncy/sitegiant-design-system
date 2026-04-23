import { useState } from 'react';
import { Icon } from '../Icon';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type DropdownState = 'default' | 'danger';

export interface DropdownProps {
  /** List of selectable options */
  options: DropdownOption[];
  /** Controlled selected value */
  value?: string;
  /** Placeholder shown when no value is selected */
  placeholder?: string;
  /** Disables the dropdown */
  disabled?: boolean;
  /** Makes the dropdown readonly */
  readonly?: boolean;
  /** Visual state — 'danger' paints the border red and tints helper text */
  state?: DropdownState;
  /** Helper/error text shown below the dropdown */
  helperText?: string;
  /** Optional label above the dropdown */
  label?: string;
  /** Optional secondary info text beside the label */
  labelInfo?: string;
  /** Change handler — receives the selected option value */
  onChange?: (value: string) => void;
  /** HTML id for the select element */
  id?: string;
  /** Extra classes on the root wrapper */
  className?: string;
}

/**
 * SiteGiant Dropdown component.
 *
 * Token-driven implementation from Figma Form/dropdown section.
 * Uses a styled native <select> with appearance-none for full accessibility.
 * States: default, hover (CSS), disabled.
 *
 * @example
 * <Dropdown
 *   label="Category"
 *   options={[{ value: 'electronics', label: 'Electronics' }]}
 *   value={selected}
 *   onChange={setSelected}
 * />
 */
export const Dropdown = ({
  options,
  value,
  placeholder,
  disabled = false,
  readonly = false,
  state = 'default',
  helperText,
  label,
  labelInfo,
  onChange,
  id,
  className = '',
}: DropdownProps) => {
  const isDisabled = disabled;
  const isReadonly = readonly;
  const isDanger = state === 'danger' && !isDisabled && !isReadonly;
  const [isOpen, setIsOpen] = useState(false);

  /* ── Wrapper classes ─────────────────────────────────── */
  const wrapperClasses = [
    'relative flex items-center',
    isReadonly ? '' : 'border border-solid rounded-[var(--radius-4)]',
    'transition-colors duration-150',
    isDisabled
      ? [
          'bg-[var(--dropdown-disabled-fill)]',
          'border-[var(--dropdown-default-border)]',
          'cursor-not-allowed opacity-60',
        ].join(' ')
      : isReadonly
      ? [
          'bg-transparent',
          'border-transparent',
          'cursor-default',
        ].join(' ')
      : isDanger
      ? [
          'bg-[var(--dropdown-default-fill)]',
          'border-[var(--form-input-danger-border)]',
          'hover:bg-[var(--dropdown-hover-fill)]',
          // Focus still wins so a user tabbing into a danger field sees focus
          'focus-within:border-[var(--form-input-focus-border)]',
          'cursor-pointer',
        ].join(' ')
      : [
          'bg-[var(--dropdown-default-fill)]',
          'border-[var(--dropdown-default-border)]',
          'hover:bg-[var(--dropdown-hover-fill)]',
          'focus-within:border-[var(--form-input-focus-border)]',
          'cursor-pointer',
        ].join(' '),
  ].join(' ');

  /* ── Select text color ───────────────────────────────── */
  const selectTextClass = isDisabled
    ? 'text-[color:var(--dropdown-disabled-text)]'
    : 'text-[color:var(--dropdown-value-text)]';

  /* ── Chevron icon color ──────────────────────────────── */
  const chevronColor = isDisabled
    ? 'var(--dropdown-disabled-icon)'
    : 'var(--dropdown-icon)';

  return (
    <div className={`flex flex-col gap-[var(--spacing-4)] ${className}`}>

      {/* ── Label row ───────────────────────────────────── */}
      {(label || labelInfo) && (
        <div className="flex items-center gap-[var(--spacing-4)]">
          {label && (
            <label
              htmlFor={id}
              className={[
                'text-[length:var(--text-14)] leading-[var(--leading-17)]',
                'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
                'text-[color:var(--form-label-text)]',
                isDisabled ? 'opacity-60' : '',
              ].filter(Boolean).join(' ')}
            >
              {label}
            </label>
          )}
          {labelInfo && (
            <span
              className={[
                'text-[length:var(--text-12)] leading-[var(--leading-15)]',
                'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
                'text-[color:var(--form-label-info-text)]',
              ].join(' ')}
            >
              {labelInfo}
            </span>
          )}
        </div>
      )}

      {/* ── Dropdown wrapper ────────────────────────────── */}
      <div className={wrapperClasses}>

        {/* Native select — fills the wrapper, invisible arrow */}
        <select
          id={id}
          value={value ?? ''}
          disabled={isDisabled || isReadonly}
          onMouseDown={() => {
            if (!isDisabled && !isReadonly) setIsOpen((prev) => !prev);
          }}
          onKeyDown={(e) => {
            if (!isDisabled && !isReadonly && (e.key === 'Enter' || e.key === ' ')) {
              setIsOpen((prev) => !prev);
            }
          }}
          onBlur={() => setIsOpen(false)}
          onChange={(e) => {
            if (!isReadonly) onChange?.(e.target.value);
            setIsOpen(false);
          }}
          className={[
            'w-full appearance-none bg-transparent outline-none border-none',
            isReadonly ? 'px-0 py-[var(--spacing-6)]' : 'pl-[var(--spacing-12)] pr-[var(--spacing-36)] py-[var(--spacing-8)]',
            'text-[length:var(--text-14)] leading-[var(--leading-17)]',
            'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
            selectTextClass,
            isDisabled ? 'cursor-not-allowed' : isReadonly ? 'cursor-default pointer-events-none' : 'cursor-pointer',
          ].filter(Boolean).join(' ')}
        >
          {/* Placeholder option */}
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}

          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
            >
              {opt.label}
            </option>
          ))}
        </select>

        {/* Chevron icon overlay (non-interactive) */}
        {!isReadonly && (
          <span
            className={[
              'absolute right-[var(--spacing-12)] top-1/2 -translate-y-1/2',
              'pointer-events-none flex items-center',
              'transition-transform duration-150',
              isOpen ? 'rotate-180' : '',
            ].filter(Boolean).join(' ')}
            style={{ color: chevronColor }}
          >
            <Icon name="chevron-down" size={21} />
          </span>
        )}
      </div>

      {/* ── Helper text ────────────────────────────────── */}
      {helperText && (
        <span
          className={[
            'text-[length:var(--text-12)] leading-[var(--leading-15)]',
            'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
            isDanger
              ? 'text-[color:var(--badge-attention-fill)]'
              : 'text-[color:var(--form-label-info-text)]',
          ].join(' ')}
        >
          {helperText}
        </span>
      )}
    </div>
  );
};
