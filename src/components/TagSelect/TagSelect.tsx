import { useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import { Tag } from '../Tag';
import { Icon } from '../Icon';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuCustomInput,
} from '../DropdownMenu';
import { useTagSelectMenu } from './useTagSelectMenu';

export interface TagSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type TagSelectState = 'default' | 'disabled' | 'readonly';
export type TagSelectValidation = 'default' | 'error' | 'success';
export type TagSelectSize = 'default' | 'slim';

export interface TagSelectProps {
  options: TagSelectOption[];
  /** Controlled value. */
  value?: string;
  /** Uncontrolled default value. */
  defaultValue?: string;
  /** Placeholder when empty. */
  placeholder?: string;
  state?: TagSelectState;
  validation?: TagSelectValidation;
  helperText?: string;
  /** Search input placeholder inside the popover. */
  searchPlaceholder?: string;
  /** Allow typing a new value not in `options`. */
  creatable?: boolean;
  /** Fires when user adds a new tag via the creatable flow. */
  onCreate?: (label: string) => void;
  onChange?: (value: string) => void;
  /** Form size — 'slim' reduces vertical padding for compact layouts */
  size?: TagSelectSize;
  id?: string;
  className?: string;
}

/**
 * TagSelect — single-select autocomplete with chip.
 *
 * Figma: Form Value / Type=Tag Selection (1627:345 and variants).
 * Trigger holds at most one <Tag>; selecting a different option replaces
 * the existing chip. Search is always on inside the popover. Pass
 * `creatable` to allow typing values not in `options`.
 */
export const TagSelect = ({
  options,
  value: valueProp,
  defaultValue = '',
  placeholder = 'Select',
  state = 'default',
  validation = 'default',
  helperText,
  searchPlaceholder = 'Search',
  creatable = false,
  onCreate,
  onChange,
  size = 'default',
  id,
  className = '',
}: TagSelectProps) => {
  const isDisabled = state === 'disabled';
  const isReadonly = state === 'readonly';
  const isError = validation === 'error' && !isDisabled && !isReadonly;
  const isSuccess = validation === 'success' && !isDisabled && !isReadonly;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = valueProp !== undefined ? valueProp : internalValue;

  const setValue = (next: string) => {
    if (valueProp === undefined) setInternalValue(next);
    onChange?.(next);
  };

  const {
    isOpen,
    close,
    toggle,
    query,
    setQuery,
    filteredOptions,
    triggerRef,
    popoverRef,
  } = useTagSelectMenu(options);

  const selectedOption = useMemo(
    () => options.find((o) => o.value === value),
    [options, value],
  );

  const queryMatchesExisting = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return false;
    return options.some((o) => o.label.toLowerCase() === q);
  }, [options, query]);

  const handleSelect = (optionValue: string) => {
    setValue(optionValue);
    close();
  };

  const handleChipClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const handleCreate = (label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    onCreate?.(trimmed);
    setValue(trimmed);
    close();
  };

  if (isReadonly) {
    return (
      <div className={['flex flex-col gap-[var(--spacing-4)] w-full', className].filter(Boolean).join(' ')}>
        <span
          aria-readonly="true"
          className={[
            `inline-flex items-center ${size === 'slim' ? 'py-[var(--spacing-2)]' : 'py-[var(--spacing-6)]'} w-fit`,
            'text-[length:var(--text-14)] leading-[var(--leading-21)]',
            'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)]',
            'text-[color:var(--form-input-value-text)]',
            'whitespace-nowrap',
          ].join(' ')}
        >
          {selectedOption?.label ?? ''}
        </span>
        {helperText && (
          <span
            className={[
              'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)]',
              'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)]',
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

  const triggerClass = [
    'relative flex items-center w-full gap-[var(--spacing-8)]',
    `${size === 'slim' ? 'min-h-[27px]' : 'min-h-[35px]'} px-[var(--spacing-12)] ${size === 'slim' ? 'py-[var(--spacing-2)]' : 'py-[var(--spacing-6)]'}`,
    'rounded-[var(--radius-4)] border border-solid',
    borderClass,
    fillClass,
    isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
    'focus-within:border-[var(--form-input-focus-border)]',
    'outline-none',
  ].join(' ');

  const helperColor = isError
    ? 'text-[color:var(--color-sys-red-DEFAULT)]'
    : 'text-[color:var(--color-text-info)]';

  return (
    <div className={['flex flex-col gap-[var(--spacing-4)] w-full', className].filter(Boolean).join(' ')}>
      <div className="flex items-center gap-[var(--spacing-8)] w-full">
        <div className="relative flex-1 min-w-0">
          <div
            ref={triggerRef}
            id={id}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            tabIndex={isDisabled ? -1 : 0}
            onClick={() => {
              if (isDisabled) return;
              toggle();
            }}
            onKeyDown={(e) => {
              if (isDisabled) return;
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
              }
            }}
            className={triggerClass}
          >
            {selectedOption ? (
              <span onClick={handleChipClick} className="inline-flex max-w-full">
                <Tag
                  label={selectedOption.label}
                  dismissible={!isDisabled}
                  onDismiss={() => setValue('')}
                  className="max-w-full"
                />
              </span>
            ) : (
              <span
                className={[
                  'flex-1 text-[length:var(--text-14)] leading-[var(--leading-21)]',
                  'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)]',
                  'text-[color:var(--form-input-placeholder-text)]',
                  'truncate',
                ].join(' ')}
              >
                {placeholder}
              </span>
            )}
          </div>

          {isOpen && (
            <div
              ref={popoverRef}
              role="listbox"
              className={[
                'absolute z-50 left-0 right-0 mt-[var(--spacing-4)]',
                'bg-[var(--form-input-default-fill)]',
                'border border-solid border-[var(--form-input-default-border)]',
                'rounded-[var(--radius-2)]',
                'shadow-[0_4px_12px_rgba(0,0,0,0.08)]',
                'overflow-hidden',
              ].join(' ')}
            >
              <div className="border-b border-solid border-[var(--color-divider-light)]">
                <DropdownMenuCustomInput
                  autoFocus
                  placeholder={searchPlaceholder}
                  value={query}
                  onChange={setQuery}
                  onAdd={handleCreate}
                  addLabel="Add"
                  hideAdd={!creatable || queryMatchesExisting || !query.trim()}
                  flush
                />
              </div>
              <div className="max-h-[280px] overflow-y-auto">
                <DropdownMenu
                  aria-label="Options"
                  onEscape={close}
                  className="!border-0 !rounded-none !shadow-none !bg-transparent !py-0"
                >
                  {filteredOptions.length === 0 && !creatable ? (
                    <div
                      className={[
                        'px-[var(--spacing-14)] py-[var(--spacing-8)]',
                        'text-[length:var(--text-14)] leading-[var(--leading-16)]',
                        'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)]',
                        'text-[color:var(--color-text-info)]',
                      ].join(' ')}
                    >
                      Select
                    </div>
                  ) : (
                    filteredOptions.map((opt) => (
                      <DropdownMenuItem
                        key={opt.value}
                        label={opt.label}
                        selected={opt.value === value}
                        disabled={opt.disabled}
                        onClick={() => handleSelect(opt.value)}
                      />
                    ))
                  )}
                </DropdownMenu>
              </div>
            </div>
          )}
        </div>
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
      {helperText && (
        <span
          className={[
            'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)]',
            'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)]',
            helperColor,
          ].join(' ')}
        >
          {helperText}
        </span>
      )}
    </div>
  );
};
