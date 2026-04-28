import { useState, useMemo } from 'react';
import type { MouseEvent } from 'react';
import { Tag } from '../Tag';
import { Icon } from '../Icon';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuCustomInput,
} from '../DropdownMenu';
import { useTagSelectMenu } from '../TagSelect/useTagSelectMenu';
import type {
  TagSelectOption,
  TagSelectState,
  TagSelectValidation,
  TagSelectSize,
} from '../TagSelect/TagSelect';

export interface MultiTagSelectProps {
  options: TagSelectOption[];
  /** Controlled value. */
  value?: string[];
  /** Uncontrolled default value. */
  defaultValue?: string[];
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
  onChange?: (value: string[]) => void;
  /** Hide the trailing clear-all (×) circle. Default false (shown). */
  hideClearAll?: boolean;
  /** Form size — 'slim' reduces vertical padding for compact layouts */
  size?: TagSelectSize;
  id?: string;
  className?: string;
}

/**
 * MultiTagSelect — multi-select autocomplete with chip pills.
 *
 * Figma: Form Value / Type=Multi-tag Selection (1950:9923 and variants).
 * Trigger holds many <Tag> chips that wrap to multiline; each chip has
 * its own × dismiss; trailing gray clear-all × removes all selections.
 * Selecting an option in the popover toggles it (popover stays open);
 * selected items show DropdownMenuItem's `selected` checkmark.
 */
export const MultiTagSelect = ({
  options,
  value: valueProp,
  defaultValue,
  placeholder = 'Select',
  state = 'default',
  validation = 'default',
  helperText,
  searchPlaceholder = 'Search',
  creatable = false,
  onCreate,
  onChange,
  hideClearAll = false,
  size = 'default',
  id,
  className = '',
}: MultiTagSelectProps) => {
  const isDisabled = state === 'disabled';
  const isReadonly = state === 'readonly';
  const isError = validation === 'error' && !isDisabled && !isReadonly;
  const isSuccess = validation === 'success' && !isDisabled && !isReadonly;

  const [internalValue, setInternalValue] = useState<string[]>(defaultValue ?? []);
  const value = valueProp !== undefined ? valueProp : internalValue;

  const setValue = (next: string[]) => {
    if (valueProp === undefined) setInternalValue(next);
    onChange?.(next);
  };

  const {
    isOpen,
    close,
    query,
    setQuery,
    filteredOptions,
    toggle,
    triggerRef,
    popoverRef,
  } = useTagSelectMenu(options);

  const selectedOptions = useMemo(
    () => value.map((v) => options.find((o) => o.value === v) ?? { value: v, label: v }),
    [options, value],
  );

  const queryMatchesExisting = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return false;
    return options.some((o) => o.label.toLowerCase() === q);
  }, [options, query]);

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      setValue(value.filter((v) => v !== optionValue));
    } else {
      setValue([...value, optionValue]);
    }
  };

  const handleChipsContainerClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const clearAll = (e: MouseEvent) => {
    e.stopPropagation();
    setValue([]);
  };

  const handleCreate = (label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    onCreate?.(trimmed);
    if (!value.includes(trimmed)) {
      setValue([...value, trimmed]);
    }
    setQuery('');
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
          ].join(' ')}
        >
          {selectedOptions.map((o) => o.label).join(', ')}
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

  const showClearAll = !hideClearAll && !isDisabled && value.length > 0;

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
            {selectedOptions.length > 0 ? (
              <div
                onClick={handleChipsContainerClick}
                className="flex flex-wrap gap-[var(--spacing-4)] flex-1 min-w-0"
              >
                {selectedOptions.map((opt) => (
                  <Tag
                    key={opt.value}
                    label={opt.label}
                    dismissible={!isDisabled}
                    onDismiss={() => setValue(value.filter((v) => v !== opt.value))}
                    className="max-w-full"
                  />
                ))}
              </div>
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
            {showClearAll && (
              <button
                type="button"
                aria-label="Clear all"
                onClick={clearAll}
                className="shrink-0 inline-flex items-center justify-center cursor-pointer outline-none"
              >
                <Icon
                  name="close-circle"
                  size={17}
                  className="text-[color:var(--color-icon-secondary)]"
                />
              </button>
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
                        selected={value.includes(opt.value)}
                        disabled={opt.disabled}
                        onClick={() => toggleOption(opt.value)}
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
