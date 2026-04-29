import { useState } from 'react';
import type { Ref } from 'react';
import { Icon } from '../Icon';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type DropdownState = 'default' | 'danger';
export type DropdownSize = 'default' | 'slim';

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
  /** Form size — 'slim' reduces vertical padding for compact layouts */
  size?: DropdownSize;
  /** Extra classes on the root wrapper */
  className?: string;
  /** Ref forwarded to the native <select> for programmatic focus. */
  selectRef?: Ref<HTMLSelectElement>;
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
  size = 'default',
  onChange,
  id,
  className = '',
  selectRef,
}: DropdownProps) => {
  const isDisabled = disabled;
  const isReadonly = readonly;
  const isDanger = state === 'danger' && !isDisabled && !isReadonly;
  const [isOpen, setIsOpen] = useState(false);
  const showClear = !isDisabled && !isReadonly && (value?.length ?? 0) > 0;

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
  // The trigger uses muted gray when the placeholder is showing,
  // value color otherwise. Each <option> below gets its own value
  // color override so the open dropdown list is NOT inherited by
  // this muted color.
  const isPlaceholderShown = !isDisabled && (value === undefined || value === '');
  const selectTextClass = isDisabled
    ? 'text-[color:var(--dropdown-disabled-text)]'
    : isPlaceholderShown
    ? 'text-[color:var(--form-input-placeholder-text)]'
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
                'text-[length:var(--text-14)] leading-[var(--leading-21)]',
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
          ref={selectRef}
          id={id}
          value={value ?? ''}
          disabled={isDisabled || isReadonly}
          aria-invalid={isDanger || undefined}
          onMouseDown={() => {
            if (!isDisabled && !isReadonly) setIsOpen((prev) => !prev);
          }}
          onKeyDown={(e) => {
            if (isDisabled || isReadonly) return;
            if (e.key === 'Enter' || e.key === ' ') {
              setIsOpen((prev) => !prev);
              return;
            }
            // Keyboard path to clear the selection — mirrors the X button.
            if (e.key === 'Escape' && (value?.length ?? 0) > 0) {
              e.preventDefault();
              onChange?.('');
            }
          }}
          onBlur={() => setIsOpen(false)}
          onChange={(e) => {
            if (!isReadonly) onChange?.(e.target.value);
            setIsOpen(false);
          }}
          className={[
            'w-full appearance-none bg-transparent outline-none border-none',
            isReadonly
              ? `px-0 ${size === 'slim' ? 'py-[var(--spacing-2)]' : 'py-[var(--spacing-6)]'}`
              : `pl-[var(--spacing-12)] ${showClear ? 'pr-[var(--spacing-64)]' : 'pr-[var(--spacing-36)]'} ${size === 'slim' ? 'py-[var(--spacing-2)]' : 'py-[var(--spacing-6)]'}`,
            'text-[length:var(--text-14)] leading-[var(--leading-21)]',
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
              // Explicit color so the open dropdown list does not
              // inherit the placeholder muted color from the <select>.
              style={{ color: 'var(--dropdown-value-text)' }}
            >
              {opt.label}
            </option>
          ))}
        </select>

        {/* Right-edge controls: optional clear button + chevron.
            Wrapper is pointer-events-none so clicks on the chevron / gap fall
            through to the native <select>; the clear button re-enables pointer
            events for itself so it can still be clicked. */}
        {(showClear || !isReadonly) && (
          <div
            className={[
              'absolute right-[var(--spacing-12)] top-1/2 -translate-y-1/2',
              'flex items-center gap-[var(--spacing-6)]',
              'pointer-events-none',
            ].join(' ')}
          >
            {showClear && (
              <button
                type="button"
                tabIndex={-1}
                aria-label="Clear selection"
                onMouseDown={(e) => {
                  // Stop the native <select> from toggling open on press.
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange?.('');
                }}
                className={[
                  'pointer-events-auto',
                  'inline-flex items-center justify-center shrink-0',
                  'size-[17px] rounded-[var(--radius-120)]',
                  'bg-[var(--color-set-lightest)]',
                  'text-[color:var(--color-white)]',
                  'border-none outline-none cursor-pointer',
                  'hover:bg-[var(--color-set-DEFAULT)]',
                  'transition-colors duration-150',
                ].join(' ')}
              >
                <Icon name="close" size={11} />
              </button>
            )}
            {!isReadonly && (
              <span
                className={[
                  'flex items-center',
                  'transition-transform duration-150',
                  isOpen ? 'rotate-180' : '',
                ].filter(Boolean).join(' ')}
                style={{ color: chevronColor }}
              >
                <Icon name="chevron-down" size={21} />
              </span>
            )}
          </div>
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
