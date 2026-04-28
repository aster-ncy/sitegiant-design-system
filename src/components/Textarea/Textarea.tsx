import { useState } from 'react';
import type { Ref } from 'react';

export type TextareaState = 'default' | 'disabled' | 'readonly' | 'readonly-bold';
export type TextareaValidation = 'default' | 'error';

export interface TextareaProps {
  /** Controlled value. */
  value?: string;
  /** Uncontrolled default value. */
  defaultValue?: string;
  /** Placeholder when empty. */
  placeholder?: string;
  /** Visual state. */
  state?: TextareaState;
  /** Validation status — controls border color and helper text color. */
  validation?: TextareaValidation;
  /** Helper text shown below the textarea. */
  helperText?: string;
  /** Maximum allowed characters. Pairs with `showCount`. */
  maxLength?: number;
  /** Show a character counter below the textarea, right-aligned. */
  showCount?: boolean;
  /** Minimum visible rows. Default 3 (maps to Figma's 63px min-height). */
  rows?: number;
  /** Change handler — called with the new string value. */
  onChange?: (value: string) => void;
  /** HTML id for the native <textarea>. */
  id?: string;
  /** Name attribute for the native <textarea>. */
  name?: string;
  /** Extra classes on the root wrapper. */
  className?: string;
  /** Ref forwarded to the native <textarea>. */
  textareaRef?: Ref<HTMLTextAreaElement>;
}

export const Textarea = ({
  value,
  defaultValue,
  placeholder,
  state = 'default',
  validation = 'default',
  helperText,
  maxLength,
  showCount = false,
  rows = 3,
  onChange,
  id,
  name,
  className = '',
  textareaRef,
}: TextareaProps) => {
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

  const borderClass = isError
    ? 'border-[var(--form-input-danger-border)]'
    : 'border-[var(--form-input-default-border)]';

  const fillClass = isDisabled
    ? 'bg-[var(--form-input-disabled-fill)]'
    : 'bg-[var(--form-input-default-fill)]';

  const textClass = isDisabled
    ? 'text-[color:var(--form-input-disabled-text)]'
    : 'text-[color:var(--form-input-value-text)]';

  const helperColor = isError
    ? 'text-[color:var(--color-sys-red-DEFAULT)]'
    : 'text-[color:var(--color-text-info)]';

  const charsLeft = maxLength != null ? maxLength - (currentValue ?? '').length : null;

  if (isReadonly) {
    return (
      <div className={['flex flex-col gap-[var(--spacing-4)] w-full', className].filter(Boolean).join(' ')}>
        <span
          aria-readonly="true"
          className={[
            'inline-flex items-start py-[var(--spacing-6)]',
            'text-[length:var(--text-14)] leading-[var(--leading-21)]',
            'font-[family-name:var(--general-font-family)]',
            isReadonlyBold
              ? 'font-[var(--font-weight-bold)]'
              : 'font-[var(--font-weight-regular)]',
            'text-[color:var(--form-input-value-text)]',
            'whitespace-pre-wrap',
          ].join(' ')}
        >
          {currentValue}
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

  return (
    <div className={['flex flex-col gap-[var(--spacing-4)] w-full', className].filter(Boolean).join(' ')}>
      <textarea
        ref={textareaRef}
        id={id}
        name={name}
        value={isControlled ? value : undefined}
        defaultValue={!isControlled ? defaultValue : undefined}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={isDisabled}
        aria-invalid={isError || undefined}
        onChange={(e) => setValue(e.target.value)}
        className={[
          'w-full min-h-0',
          'rounded-[var(--radius-4)] border border-solid',
          borderClass,
          fillClass,
          'outline-none',
          'resize-y',
          'p-[var(--spacing-12)]',
          'text-[length:var(--text-14)] leading-[var(--leading-21)]',
          'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)]',
          textClass,
          'placeholder:text-[color:var(--form-input-placeholder-text)]',
          'transition-colors duration-150',
          !isDisabled && !isError
            ? 'focus:border-[var(--form-input-focus-border)]'
            : '',
          isDisabled ? 'cursor-not-allowed opacity-60' : '',
        ].filter(Boolean).join(' ')}
      />

      {(helperText || showCount) && (
        <div className="flex gap-[var(--spacing-16)] items-start w-full">
          {helperText && (
            <span
              className={[
                'flex-1 min-w-0',
                'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)]',
                'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)]',
                helperColor,
              ].join(' ')}
            >
              {helperText}
            </span>
          )}
          {showCount && (
            <span
              className={[
                'shrink-0 text-right',
                'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)]',
                'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)]',
                'text-[color:var(--color-text-info)]',
              ].join(' ')}
            >
              {charsLeft != null ? `${charsLeft} characters left` : `${(currentValue ?? '').length} characters`}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
