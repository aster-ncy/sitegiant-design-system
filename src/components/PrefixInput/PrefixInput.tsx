import { useState, useRef, useCallback, useEffect } from 'react';
import type { Ref } from 'react';
import { Icon } from '../Icon';
import { DropdownMenu, DropdownMenuItem } from '../DropdownMenu';

export type PrefixInputState = 'default' | 'disabled' | 'readonly' | 'readonly-bold';
export type PrefixInputValidation = 'default' | 'error' | 'success';
export type PrefixInputSize = 'default' | 'slim';

export interface PrefixOption {
  value: string;
  label: string;
}

export interface PrefixInputProps {
  /** Prefix label shown before the divider (e.g. "RM", "SGD", "USD"). */
  prefix: string;
  /** Controlled numeric value. Use empty string for "no value". */
  value?: string;
  /** Uncontrolled default value. */
  defaultValue?: string;
  /** Placeholder for the number field. */
  placeholder?: string;
  /** Visual state. */
  state?: PrefixInputState;
  /** Validation status — drives border color + helperText color. */
  validation?: PrefixInputValidation;
  /** Helper text shown below the field. */
  helperText?: string;
  /** Form size — 'slim' reduces vertical padding for compact layouts. */
  size?: PrefixInputSize;
  /**
   * Prefix options for the dropdown. When provided, the prefix section
   * becomes clickable with a chevron icon. Selecting an option fires
   * `onPrefixChange` with the chosen option's value.
   */
  prefixOptions?: PrefixOption[];
  /** Fired when a prefix option is selected from the dropdown. */
  onPrefixChange?: (value: string) => void;
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

export const PrefixInput = ({
  prefix,
  value,
  defaultValue,
  placeholder,
  state = 'default',
  validation = 'default',
  helperText,
  size = 'default',
  prefixOptions,
  onPrefixChange,
  onChange,
  id,
  name,
  className = '',
  inputRef,
}: PrefixInputProps) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(defaultValue ?? '');
  const currentValue = isControlled ? value : internalValue;

  const isDisabled = state === 'disabled';
  const isReadonly = state === 'readonly' || state === 'readonly-bold';
  const isReadonlyBold = state === 'readonly-bold';
  const isError = validation === 'error' && !isDisabled && !isReadonly;
  const isSuccess = validation === 'success' && !isDisabled && !isReadonly;

  const hasDropdown = prefixOptions && prefixOptions.length > 0;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const canOpenDropdown = Boolean(hasDropdown && !isDisabled && !isReadonly);
  const isDropdownVisible = dropdownOpen && canOpenDropdown;
  const prefixRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const closeDropdown = useCallback(() => {
    setDropdownOpen(false);
    prefixRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isDropdownVisible) return;
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (prefixRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      closeDropdown();
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [isDropdownVisible, closeDropdown]);

  useEffect(() => {
    if (!isDropdownVisible) return;
    requestAnimationFrame(() => {
      const selected = popoverRef.current?.querySelector<HTMLElement>('[role="option"][aria-selected="true"]');
      const fallback = popoverRef.current?.querySelector<HTMLElement>('[role="option"]:not([aria-disabled="true"])');
      (selected ?? fallback)?.focus();
    });
  }, [isDropdownVisible]);

  const setValue = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const py = size === 'slim' ? 'py-[var(--spacing-2)]' : 'py-[var(--spacing-6)]';

  if (isReadonly) {
    return (
      <div className={['flex flex-col gap-[var(--spacing-4)] w-full', className].filter(Boolean).join(' ')}>
        <span
          aria-readonly="true"
          className={[
            `inline-flex items-center gap-[var(--spacing-4)] ${py} w-fit`,
            'text-[length:var(--text-14)] leading-[var(--leading-21)]',
            'font-[family-name:var(--general-font-family)]',
            isReadonlyBold ? 'font-[var(--font-weight-bold)]' : 'font-[var(--font-weight-regular)]',
            'text-[color:var(--form-input-value-text)]',
            'whitespace-nowrap',
          ].join(' ')}
        >
          <span>{prefix}</span>
          <span>{currentValue}</span>
        </span>
        {helperText && (
          <span
            className={[
              'font-[family-name:var(--general-font-family)]',
              'text-[length:var(--general-caption-size)]',
              'leading-[var(--general-caption-lineheight)]',
              'font-[var(--font-weight-regular)]',
              'text-[color:var(--color-text-info)]',
            ].join(' ')}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }

  const borderClass = isError
    ? 'border-[var(--form-input-danger-border)]'
    : 'border-[var(--form-input-default-border)]';
  const fillClass = isDisabled
    ? 'bg-[var(--form-input-disabled-fill)]'
    : 'bg-[var(--form-input-default-fill)]';

  const helperColor = isError
    ? 'text-[color:var(--color-sys-red-DEFAULT)]'
    : 'text-[color:var(--color-text-info)]';

  const textColor = isDisabled
    ? 'text-[color:var(--form-input-disabled-text)]'
    : 'text-[color:var(--form-input-value-text)]';

  const prefixContent = (
    <>
      <span>{prefix}</span>
      {hasDropdown && (
        <Icon
          name="chevron-down"
          size={17}
          className="text-[color:var(--color-icon-secondary)] shrink-0"
        />
      )}
    </>
  );

  return (
    <div className={['flex flex-col gap-[var(--spacing-4)] w-full', className].filter(Boolean).join(' ')}>
      <div className="flex items-center gap-[var(--spacing-4)] w-full">
        <div className="relative flex-1 min-w-0">
          <div
            className={[
              'flex items-center',
              'rounded-[var(--radius-4)] border border-solid',
              borderClass,
              fillClass,
              isDisabled ? 'cursor-not-allowed opacity-60' : '',
              !isDisabled && !isError
                ? 'focus-within:border-[var(--form-input-focus-border)]'
                : '',
              'transition-colors duration-150',
              'overflow-hidden',
            ].filter(Boolean).join(' ')}
          >
            {/* Prefix section — border-r acts as the divider (no standalone div). */}
            {canOpenDropdown ? (
              <button
                ref={prefixRef}
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                className={[
                  'flex items-center gap-[var(--spacing-4)] shrink-0',
                  `px-[var(--spacing-8)] ${py}`,
                  'border-0 border-r border-solid border-[var(--form-input-default-border)]',
                  'bg-transparent outline-none',
                  'cursor-pointer',
                  'text-[length:var(--text-14)] leading-[var(--leading-21)]',
                  'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)]',
                  textColor,
                  'whitespace-nowrap',
                ].join(' ')}
              >
                {prefixContent}
              </button>
            ) : (
              <span
                className={[
                  'flex items-center shrink-0',
                  hasDropdown ? 'gap-[var(--spacing-4)]' : '',
                  `px-[var(--spacing-8)] ${py}`,
                  'border-r border-solid border-[var(--form-input-default-border)]',
                  'text-[length:var(--text-14)] leading-[var(--leading-21)]',
                  'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)]',
                  textColor,
                  'whitespace-nowrap',
                ].filter(Boolean).join(' ')}
              >
                {prefixContent}
              </span>
            )}

            {/* Number input */}
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
              onChange={(e) => setValue(e.target.value)}
              className={[
                'flex-1 min-w-[80px]',
                'bg-transparent outline-none border-none',
                '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                `px-[var(--spacing-8)] ${py}`,
                'text-right',
                'text-[length:var(--text-14)] leading-[var(--leading-21)]',
                'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)]',
                textColor,
                'placeholder:text-[color:var(--form-input-placeholder-text)]',
                isDisabled ? 'cursor-not-allowed' : '',
              ].filter(Boolean).join(' ')}
            />
          </div>

          {/* Prefix dropdown popover */}
          {isDropdownVisible && (
            <div
              ref={popoverRef}
              className={[
                'absolute z-50 left-0 mt-[var(--spacing-4)]',
                'bg-[var(--form-input-default-fill)]',
                'border border-solid border-[var(--form-input-default-border)]',
                'rounded-[var(--radius-2)]',
                'shadow-[0_4px_12px_rgba(0,0,0,0.08)]',
                'overflow-hidden',
              ].join(' ')}
            >
              <DropdownMenu
                aria-label="Prefix options"
                onEscape={closeDropdown}
                className="!border-0 !rounded-none !shadow-none !bg-transparent !py-0"
              >
                {prefixOptions!.map((opt) => (
                  <DropdownMenuItem
                    key={opt.value}
                    label={opt.label}
                    selected={opt.value === prefix}
                    onClick={() => {
                      onPrefixChange?.(opt.value);
                      closeDropdown();
                    }}
                  />
                ))}
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* External validation icon */}
        {(isError || isSuccess) && (
          <Icon
            name={isError ? 'close' : 'check'}
            size={21}
            className={[
              'shrink-0',
              isError
                ? 'text-[color:var(--color-sys-red-DEFAULT)]'
                : 'text-[color:var(--color-sys-green-DEFAULT)]',
            ].join(' ')}
          />
        )}
      </div>

      {/* Helper text */}
      {helperText && (
        <span
          className={[
            'font-[family-name:var(--general-font-family)]',
            'text-[length:var(--general-caption-size)]',
            'leading-[var(--general-caption-lineheight)]',
            'font-[var(--font-weight-regular)]',
            helperColor,
          ].join(' ')}
        >
          {helperText}
        </span>
      )}
    </div>
  );
};
