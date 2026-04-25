import { useState as useLocalState } from 'react';
import type { ReactNode, Ref } from 'react';
import { Icon } from '../Icon/Icon';

export type InputState = 'default' | 'focus' | 'danger' | 'disabled' | 'readonly';
export type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';

export interface InputAddonButton {
  label?: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export interface InputProps {
  /** Label text above the input */
  label?: string;
  /** Secondary info text beside the label */
  labelInfo?: string;
  /** Input type — 'password' shows a visibility toggle */
  type?: InputType;
  /** Input placeholder */
  placeholder?: string;
  /** Controlled value */
  value?: string;
  /** Uncontrolled default value */
  defaultValue?: string;
  /**
   * Force a visual state — used in Storybook stories only.
   * In production, focus is handled by CSS focus-within and
   * danger/disabled are driven by props.
   */
  state?: InputState;
  /** Helper text shown below the input */
  helperText?: string;
  /** Optional trailing icon inside the input */
  trailingIcon?: ReactNode;
  /** Optional button attached to the right side of the input */
  addonButton?: InputAddonButton;
  /** Disables the input */
  disabled?: boolean;
  /** Makes the input readonly */
  readonly?: boolean;
  /** Change handler */
  onChange?: (value: string) => void;
  /** HTML id for the input element */
  id?: string;
  /** Extra classes on the root wrapper */
  className?: string;
  /** Ref forwarded to the native <input> for programmatic focus. */
  inputRef?: Ref<HTMLInputElement>;
}

/* ── State → border class lookup ────────────────────── */
const stateBorderClasses: Record<InputState, string> = {
  default:  'border-[var(--form-input-default-border)]',
  focus:    'border-[var(--form-input-focus-border)]',
  danger:   'border-[var(--form-input-danger-border)]',
  disabled: 'border-[var(--form-input-default-border)]',
  readonly: 'border-transparent',
};

const stateFillClasses: Record<InputState, string> = {
  default:  'bg-[var(--form-input-default-fill)]',
  focus:    'bg-[var(--form-input-default-fill)]',
  danger:   'bg-[var(--form-input-default-fill)]',
  disabled: 'bg-[var(--form-input-disabled-fill)]',
  readonly: 'bg-transparent',
};

/**
 * SiteGiant Input component.
 *
 * Token-driven implementation from Figma Form/field section.
 * States: default, focus (CSS focus-within), danger, disabled.
 *
 * @example
 * <Input label="Email" placeholder="you@example.com" onChange={setValue} />
 */
export const Input = ({
  label,
  labelInfo,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  state = 'default',
  helperText,
  trailingIcon,
  addonButton,
  disabled = false,
  readonly = false,
  onChange,
  id,
  className = '',
  inputRef,
}: InputProps) => {
  const [passwordVisible, setPasswordVisible] = useLocalState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword && passwordVisible ? 'text' : type;
  const resolvedState: InputState = disabled ? 'disabled' : readonly ? 'readonly' : state;
  const isDisabled = resolvedState === 'disabled';
  const isReadonly = resolvedState === 'readonly';
  const isDanger   = resolvedState === 'danger';
  const hasForcedFocus = resolvedState === 'focus';

  /* ── Wrapper border/fill based on resolved state ────── */
  const wrapperBorder = stateBorderClasses[resolvedState];
  const wrapperFill   = stateFillClasses[resolvedState];

  /* ── Focus-within override (real interactive focus) ─── */
  // Focus-within always wins over default/danger states so users in a danger
  // field still get a focus indicator when they tab in. Disabled/readonly
  // stay unresponsive by design; `state='focus'` is a forced Storybook state
  // and skips the override so it renders a static focus look.
  const focusWithin = !hasForcedFocus && !isDisabled && !isReadonly
    ? 'focus-within:border-[var(--form-input-focus-border)]'
    : '';

  /* ── Input text color ────────────────────────────────── */
  const inputTextClass = isDisabled
    ? 'text-[color:var(--form-input-disabled-text)]'
    : 'text-[color:var(--form-input-value-text)]';

  /* ── Trailing icon color ─────────────────────────────── */
  const iconColorToken = isDisabled
    ? 'var(--form-button-disabled-icon)'
    : 'var(--form-icon)';

  /* ── Addon button classes ────────────────────────────── */
  const addonBase = [
    'flex items-center gap-[var(--spacing-4)]',
    'px-[var(--spacing-12)] py-[var(--spacing-8)]',
    'rounded-r-[var(--radius-4)]',
    'border-l border-[var(--form-button-border)]',
    'text-[length:var(--text-14)] leading-[var(--leading-17)]',
    'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
    'shrink-0',
  ].join(' ');

  const addonStateClasses = isDisabled
    ? [
        'bg-[var(--form-button-disabled-fill)]',
        'text-[color:var(--form-button-disabled-icon)]',
        'cursor-not-allowed',
      ].join(' ')
    : [
        'bg-[var(--form-button-default-fill)]',
        'text-[color:var(--form-button-text)]',
        'cursor-pointer',
        'hover:brightness-95',
        'active:brightness-90',
      ].join(' ');

  return (
    <div className={`flex flex-col gap-[var(--spacing-4)] ${className}`}>

      {/* ── Label row ─────────────────────────────────── */}
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

      {/* ── Input row with addon ──────────────────────── */}
      <div className="flex flex-row items-stretch">
        <div
          className={[
            'flex items-stretch flex-1',
            isReadonly ? '' : 'border border-solid rounded-[var(--radius-4)]',
            'overflow-hidden',
            'transition-colors duration-150',
            wrapperBorder,
            wrapperFill,
            focusWithin,
            isDisabled ? 'cursor-not-allowed opacity-60' : '',
            isReadonly ? 'cursor-default' : '',
            // When addon button is present, square off the right radius on the inner input
            addonButton ? 'rounded-r-none' : '',
          ].filter(Boolean).join(' ')}
        >
          {/* Native input */}
          <input
            ref={inputRef}
            id={id}
            type={resolvedType}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            disabled={isDisabled}
            readOnly={isReadonly}
            aria-invalid={isDanger || undefined}
            onChange={(e) => onChange?.(e.target.value)}
            className={[
              'flex-1 min-w-0',
              'bg-transparent outline-none border-none',
              isReadonly ? 'px-0 py-[var(--spacing-6)]' : 'px-[var(--spacing-12)] py-[var(--spacing-8)]',
              'text-[length:var(--text-14)] leading-[var(--leading-17)]',
              'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
              inputTextClass,
              'placeholder:text-[color:var(--form-input-placeholder-text)]',
              isDisabled ? 'cursor-not-allowed' : '',
              isReadonly ? 'cursor-default' : '',
            ].filter(Boolean).join(' ')}
          />

          {/* Password visibility toggle */}
          {isPassword && !isDisabled && !isReadonly && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setPasswordVisible(prev => !prev)}
              className={[
                'flex items-center pr-[var(--spacing-12)]',
                'cursor-pointer bg-transparent border-none outline-none',
              ].join(' ')}
              style={{ color: 'var(--form-icon)' }}
              aria-label={passwordVisible ? 'Hide password' : 'Show password'}
            >
              <Icon name={passwordVisible ? 'eye-open' : 'eye-close'} size={17} />
            </button>
          )}

          {/* Trailing icon */}
          {trailingIcon && !addonButton && !isPassword && (
            <span
              className="flex items-center pr-[var(--spacing-12)]"
              style={{ color: iconColorToken }}
            >
              {trailingIcon}
            </span>
          )}
        </div>

        {/* ── Addon button (outside the border wrapper) ─── */}
        {addonButton && (
          <button
            type="button"
            disabled={isDisabled}
            onClick={!isDisabled ? addonButton.onClick : undefined}
            className={[addonBase, addonStateClasses].join(' ')}
          >
            {addonButton.icon && (
              <span style={{ color: isDisabled ? 'var(--form-button-disabled-icon)' : 'var(--form-button-icon)' }}>
                {addonButton.icon}
              </span>
            )}
            {addonButton.label && addonButton.label}
          </button>
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
