import { useCallback, useEffect, useRef, useState } from 'react';
import type { Ref } from 'react';
import { Icon } from '../Icon';
import { DropdownMenu, DropdownMenuItem } from '../DropdownMenu';

/* ── Typography recipes (Figma Form Value section) ──────────────────────── */
const formValueTextClasses =
  'text-[length:var(--general-form-value-size)] leading-[var(--general-form-value-lineheight)] ' +
  'font-[family-name:var(--general-font-family)] font-[weight:var(--general-body-weight)]';

const formValueTextBoldClasses =
  'text-[length:var(--general-form-value-size)] leading-[var(--general-form-value-lineheight)] ' +
  'font-[family-name:var(--general-font-family)] font-[weight:var(--general-body-bold-weight)]';

const captionTextClasses =
  'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)] ' +
  'font-[family-name:var(--general-font-family)] font-[weight:var(--general-caption-weight)]';

export type SuffixInputState = 'default' | 'disabled' | 'readonly' | 'readonly-bold';
export type SuffixInputValidation = 'default' | 'error' | 'success' | 'warning';
export type SuffixInputSize = 'default' | 'slim';

export interface SuffixOption {
  value: string;
  label: string;
}

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
  /**
   * Suffix options for the dropdown. When provided, the suffix section
   * becomes clickable with a chevron icon. Selecting an option fires
   * `onSuffixChange` with the chosen option's value.
   */
  suffixOptions?: SuffixOption[];
  /** Fired when a suffix option is selected from the dropdown. */
  onSuffixChange?: (value: string) => void;
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
 * The suffix can be a static label (`suffix` only) or a clickable
 * dropdown picker (`suffix` + `suffixOptions` + `onSuffixChange`) for
 * unit switchers (kg / lb / g / etc).
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
  suffixOptions,
  onSuffixChange,
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

  const hasDropdown = !!suffixOptions && suffixOptions.length > 0;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const suffixRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const closeDropdown = useCallback(() => {
    setDropdownOpen(false);
    suffixRef.current?.focus();
  }, []);

  // Close dropdown when the component becomes disabled / readonly. The
  // visibility check (`effectiveDropdownOpen`) is also derived in render
  // for immediate UI hiding, but we ALSO need to clear the persistent
  // `dropdownOpen` state — otherwise switching back to default would
  // unexpectedly reopen the menu without user action.
  useEffect(() => {
    if (isDisabled || isReadonly) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate cross-prop sync
      setDropdownOpen(false);
    }
  }, [isDisabled, isReadonly]);
  const effectiveDropdownOpen = dropdownOpen && !isDisabled && !isReadonly;

  // Click-outside dismiss.
  useEffect(() => {
    if (!effectiveDropdownOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (suffixRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      closeDropdown();
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [effectiveDropdownOpen, closeDropdown]);

  // Move focus into the popover (selected option, fallback to first) on open.
  useEffect(() => {
    if (!effectiveDropdownOpen) return;
    requestAnimationFrame(() => {
      const selected = popoverRef.current?.querySelector<HTMLElement>(
        '[role="option"][aria-selected="true"]',
      );
      const fallback = popoverRef.current?.querySelector<HTMLElement>(
        '[role="option"]:not([aria-disabled="true"])',
      );
      (selected ?? fallback)?.focus();
    });
  }, [effectiveDropdownOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const cellPaddingY = size === 'slim' ? 'py-[var(--spacing-2)]' : 'py-[var(--spacing-6)]';

  const suffixContent = (
    <>
      <span>{suffix}</span>
      {hasDropdown && (
        <Icon
          name="chevron-down"
          size={17}
          className="text-[color:var(--color-icon-secondary)] shrink-0"
        />
      )}
    </>
  );

  // ── Readonly: static "value suffix" line, no shell. ──────
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
              isReadonlyBold ? formValueTextBoldClasses : formValueTextClasses,
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
              captionTextClasses,
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
        <div className="relative inline-flex items-stretch">
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
              'overflow-hidden',
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
                formValueTextClasses,
                isDisabled
                  ? 'text-[color:var(--form-input-disabled-text)] cursor-not-allowed'
                  : 'text-[color:var(--form-input-value-text)]',
                'placeholder:text-[color:var(--form-input-placeholder-text)]',
              ].join(' ')}
            />

            {/* Suffix section — border-l acts as the divider. */}
            {hasDropdown && !isDisabled ? (
              <button
                ref={suffixRef}
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={effectiveDropdownOpen}
                className={[
                  'inline-flex items-center justify-center gap-[var(--spacing-4)] shrink-0',
                  `px-[var(--spacing-8)] ${cellPaddingY}`,
                  'border-0 border-l border-solid border-[var(--form-input-default-border)]',
                  'bg-transparent outline-none cursor-pointer',
                  formValueTextClasses,
                  'text-[color:var(--form-input-value-text)]',
                  'whitespace-nowrap',
                ].join(' ')}
              >
                {suffixContent}
              </button>
            ) : (
              <span
                className={[
                  'inline-flex items-center justify-center shrink-0',
                  hasDropdown ? 'gap-[var(--spacing-4)]' : '',
                  `px-[var(--spacing-8)] ${cellPaddingY}`,
                  'border-l border-solid border-[var(--form-input-default-border)]',
                  formValueTextClasses,
                  isDisabled
                    ? 'text-[color:var(--form-input-disabled-text)]'
                    : 'text-[color:var(--form-input-value-text)]',
                  'whitespace-nowrap',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {suffixContent}
              </span>
            )}
          </div>

          {/* Suffix dropdown popover — anchored to the right edge so it
              opens beneath the suffix section, not the number cell. */}
          {hasDropdown && effectiveDropdownOpen && (
            <div
              ref={popoverRef}
              className={[
                'absolute z-50 right-0 top-full mt-[var(--spacing-4)]',
                'bg-[var(--form-input-default-fill)]',
                'border border-solid border-[var(--form-input-default-border)]',
                'rounded-[var(--radius-2)]',
                'shadow-[0_4px_12px_rgba(0,0,0,0.08)]',
                'overflow-hidden',
              ].join(' ')}
            >
              <DropdownMenu
                aria-label="Suffix options"
                onEscape={closeDropdown}
                className="!border-0 !rounded-none !shadow-none !bg-transparent !py-0"
              >
                {suffixOptions!.map((opt) => (
                  <DropdownMenuItem
                    key={opt.value}
                    label={opt.label}
                    selected={opt.value === suffix}
                    onClick={() => {
                      onSuffixChange?.(opt.value);
                      closeDropdown();
                    }}
                  />
                ))}
              </DropdownMenu>
            </div>
          )}
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
            captionTextClasses,
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
