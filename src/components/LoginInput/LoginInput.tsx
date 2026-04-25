import { useState } from 'react';
import type { Ref } from 'react';
import { Icon } from '../Icon';

export type LoginInputType = 'text' | 'password' | 'email';
export type LoginInputState = 'default' | 'disabled' | 'readonly' | 'readonly-bold';
export type LoginInputValidation = 'default' | 'error' | 'success';

export interface LoginInputProps {
  /** Field type — 'password' renders the visibility toggle. */
  type?: LoginInputType;
  /** Placeholder shown when the field is empty. */
  placeholder?: string;
  /** Controlled value. */
  value?: string;
  /** Uncontrolled default value. */
  defaultValue?: string;
  /**
   * Field state:
   *  - 'default'        — interactive
   *  - 'disabled'       — non-interactive, dim
   *  - 'readonly'       — non-interactive, regular weight, no border
   *  - 'readonly-bold'  — non-interactive, bold weight, no border (display value)
   */
  state?: LoginInputState;
  /** Validation status — drives border color (error) and the trailing status icon. */
  validation?: LoginInputValidation;
  /** Hint text shown under the field. */
  hintText?: string;
  /** Change handler. */
  onChange?: (value: string) => void;
  /** HTML id for the native <input>. */
  id?: string;
  /** Name attribute for the native <input>. */
  name?: string;
  /** Auto-complete hint (e.g., 'username', 'current-password'). */
  autoComplete?: string;
  className?: string;
  /** Ref forwarded to the native <input> for programmatic focus. */
  inputRef?: Ref<HTMLInputElement>;
}

/**
 * LoginInput — Figma: Login - Form (auth-flow input field).
 *
 * Body-large (16px) text input intended for sign-in / sign-up flows.
 * Distinct from the generic <Input> in three ways:
 *   1. Uses 16px body-large typography for accessibility on auth forms.
 *   2. Renders an external status icon to the right of the field
 *      (red x-circle on error, green check-circle on success).
 *   3. Has a 'readonly-bold' state for displaying a confirmed value
 *      (e.g., the user's email after they've typed it on a multi-step form)
 *      with no border and bold weight.
 *
 * Tokens reused from the generic <Input>:
 *   --form-input-default-fill / -value-text / -placeholder-text
 *   --form-input-default-border / -focus-border / -danger-border
 */
export const LoginInput = ({
  type = 'text',
  placeholder,
  value,
  defaultValue,
  state = 'default',
  validation = 'default',
  hintText,
  onChange,
  id,
  name,
  autoComplete,
  className = '',
  inputRef,
}: LoginInputProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword && passwordVisible ? 'text' : type;

  const isDisabled = state === 'disabled';
  const isReadonly = state === 'readonly' || state === 'readonly-bold';
  const isReadonlyBold = state === 'readonly-bold';
  const isError = validation === 'error' && !isDisabled && !isReadonly;
  const isSuccess = validation === 'success' && !isDisabled && !isReadonly;

  // Track the field's current value so we know when to show the inline clear
  // button. Works for both controlled (`value`) and uncontrolled (`defaultValue`)
  // usage. Clear button is hidden when disabled / readonly per Figma.
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(defaultValue ?? '');
  const currentValue = isControlled ? value : internalValue;
  const showClear = !isDisabled && !isReadonly && (currentValue?.length ?? 0) > 0;

  const handleClear = () => {
    if (!isControlled) setInternalValue('');
    onChange?.('');
  };

  // Field wrapper border. Readonly variants drop the border entirely;
  // error overrides default; success uses the default border (the green
  // signal lives on the external status icon, not the border).
  const wrapperBorder = isReadonly
    ? 'border-transparent'
    : isError
      ? 'border-[var(--form-input-danger-border)]'
      : 'border-[var(--form-input-default-border)]';

  const wrapperFill = isDisabled
    ? 'bg-[var(--form-input-disabled-fill)]'
    : isReadonly
      ? 'bg-transparent'
      : 'bg-[var(--form-input-default-fill)]';

  const focusWithin = !isDisabled && !isReadonly && !isError
    ? 'focus-within:border-[var(--form-input-focus-border)]'
    : '';

  const valueWeight = isReadonlyBold
    ? 'font-[var(--font-weight-bold)]'
    : 'font-[var(--font-weight-regular)]';

  const valueTextColor = isDisabled
    ? 'text-[color:var(--form-input-disabled-text)]'
    : 'text-[color:var(--form-input-value-text)]';

  const hintTextColor = isError
    ? 'text-[color:var(--color-sys-red-DEFAULT)]'
    : 'text-[color:var(--color-text-info)]';

  return (
    <div className={['flex flex-col gap-[var(--spacing-4)] w-full', className].filter(Boolean).join(' ')}>
      {/* Field row: input wrapper + (external) status icon */}
      <div className="flex gap-[var(--spacing-8)] items-center w-full">
        <div
          className={[
            'flex items-center flex-1 min-w-0',
            isReadonly
              ? 'rounded-none'
              : 'rounded-[var(--radius-4)] border border-solid',
            // Readonly variants kill the horizontal padding (per Figma);
            // standard variants get the 12/8 box padding.
            isReadonly
              ? 'py-[var(--spacing-8)]'
              : 'gap-[var(--spacing-12)] px-[var(--spacing-12)] py-[var(--spacing-8)]',
            'transition-colors duration-150',
            wrapperBorder,
            wrapperFill,
            focusWithin,
            isDisabled ? 'cursor-not-allowed opacity-60' : '',
            isReadonly ? 'cursor-default' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <input
            ref={inputRef}
            id={id}
            name={name}
            type={resolvedType}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            disabled={isDisabled}
            readOnly={isReadonly}
            autoComplete={autoComplete}
            aria-invalid={isError || undefined}
            onChange={(e) => {
              if (!isControlled) setInternalValue(e.target.value);
              onChange?.(e.target.value);
            }}
            className={[
              'flex-1 min-w-0',
              'bg-transparent outline-none border-none',
              'p-0',
              'font-[family-name:var(--general-font-family)]',
              'text-[length:var(--general-body-large-size)]',
              'leading-[var(--general-body-large-lineheight)]',
              valueWeight,
              valueTextColor,
              'placeholder:text-[color:var(--form-input-placeholder-text)]',
              isDisabled ? 'cursor-not-allowed' : '',
              isReadonly ? 'cursor-default' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          />

          {/* Inline clear button — appears once the field has content (per Figma).
              Filled gray circle with white X glyph. Sits before the password eye. */}
          {showClear && (
            <button
              type="button"
              tabIndex={-1}
              onClick={handleClear}
              aria-label="Clear value"
              className={[
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

          {/* Visibility toggle — only on password type, hidden in readonly variants */}
          {isPassword && !isReadonly && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => !isDisabled && setPasswordVisible((prev) => !prev)}
              disabled={isDisabled}
              aria-label={passwordVisible ? 'Hide password' : 'Show password'}
              className={[
                'inline-flex items-center justify-center shrink-0',
                'bg-transparent border-none outline-none',
                isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
              ].join(' ')}
              style={{ color: 'var(--form-icon)' }}
            >
              <Icon name={passwordVisible ? 'eye-open' : 'eye-close'} size={21} />
            </button>
          )}
        </div>

        {/* External status icon — bare glyph (no circle), tinted red for error
            or green for success per Figma. Uses the standard Icon component. */}
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

      {hintText && (
        <span
          className={[
            'font-[family-name:var(--general-font-family)]',
            'text-[length:var(--general-caption-size)]',
            'leading-[var(--general-caption-lineheight)]',
            'font-[var(--font-weight-regular)]',
            hintTextColor,
          ].join(' ')}
        >
          {hintText}
        </span>
      )}
    </div>
  );
};
