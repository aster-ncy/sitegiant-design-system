import { useState as useLocalState } from 'react';
import type { ReactNode, Ref } from 'react';
import { Icon } from '../Icon/Icon';

export type InputState = 'default' | 'focus' | 'danger' | 'disabled' | 'readonly' | 'readonly-bold';
export type InputValidation = 'default' | 'error' | 'success';
export type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
export type InputSize = 'default' | 'slim';

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
   *
   * `'readonly-bold'` matches Figma's "Readonly Bold" state — no border,
   * no horizontal padding, value text rendered in bold weight.
   */
  state?: InputState;
  /**
   * Validation status — controls the trailing external status icon.
   * Figma: `'success'` shows a green check beside the field; `'error'`
   * shows a red X. Mutually exclusive with `state='danger'` (which
   * paints a red border instead). Both can be set together if the
   * consumer wants both the red border AND the red X icon.
   */
  validation?: InputValidation;
  /** Helper text shown below the input */
  helperText?: string;
  /**
   * Optional leading slot rendered INSIDE the input wrapper, to the LEFT
   * of the value text. Used by composed components like CardNumberInput
   * to render a brand badge before the field content.
   */
  leadingNode?: ReactNode;
  /** Optional trailing icon inside the input */
  trailingIcon?: ReactNode;
  /** Optional button attached to the right side of the input */
  addonButton?: InputAddonButton;
  /** Disables the input */
  disabled?: boolean;
  /** Makes the input readonly */
  readonly?: boolean;
  /** Maximum allowed characters. Pairs with `showCount`. */
  maxLength?: number;
  /** Show a `0/maxLength` counter inside the field, right-aligned. */
  showCount?: boolean;
  /** Change handler */
  onChange?: (value: string) => void;
  /** HTML id for the input element */
  id?: string;
  /** Form size — 'slim' reduces vertical padding for compact layouts */
  size?: InputSize;
  /** Extra classes on the root wrapper */
  className?: string;
  /** Ref forwarded to the native <input> for programmatic focus. */
  inputRef?: Ref<HTMLInputElement>;
}

/* ── State → border class lookup ────────────────────── */
const stateBorderClasses: Record<InputState, string> = {
  default:        'border-[var(--form-input-default-border)]',
  focus:          'border-[var(--form-input-focus-border)]',
  danger:         'border-[var(--form-input-danger-border)]',
  disabled:       'border-[var(--form-input-default-border)]',
  readonly:       'border-transparent',
  'readonly-bold':'border-transparent',
};

const stateFillClasses: Record<InputState, string> = {
  default:        'bg-[var(--form-input-default-fill)]',
  focus:          'bg-[var(--form-input-default-fill)]',
  danger:         'bg-[var(--form-input-default-fill)]',
  disabled:       'bg-[var(--form-input-disabled-fill)]',
  readonly:       'bg-transparent',
  'readonly-bold':'bg-transparent',
};

/* ── Typography recipes (Figma Form Value section, node 873:965) ──────── */
/* Form value text: 14 / 21 / regular — General/Form/form-value-* */
const formValueTextClasses =
  'text-[length:var(--general-form-value-size)] leading-[var(--general-form-value-lineheight)] ' +
  'font-[family-name:var(--general-font-family)] font-[weight:var(--general-body-weight)]';

/* Form value text — bold variant (readonly-bold state) */
const formValueTextBoldClasses =
  'text-[length:var(--general-form-value-size)] leading-[var(--general-form-value-lineheight)] ' +
  'font-[family-name:var(--general-font-family)] font-[weight:var(--general-body-bold-weight)]';

/* Caption text (label info, hint/helper text): 12 / 17 / regular — General/Caption/caption-* */
const captionTextClasses =
  'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)] ' +
  'font-[family-name:var(--general-font-family)] font-[weight:var(--general-caption-weight)]';

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
  validation = 'default',
  helperText,
  leadingNode,
  trailingIcon,
  addonButton,
  disabled = false,
  readonly = false,
  maxLength,
  showCount = false,
  size = 'default',
  onChange,
  id,
  className = '',
  inputRef,
}: InputProps) => {
  const [passwordVisible, setPasswordVisible] = useLocalState(false);
  // Track value internally so the word-count counter updates on uncontrolled
  // usage. Always reflects the latest value, controlled or not.
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useLocalState<string>(defaultValue ?? '');
  const currentValue = isControlled ? value : internalValue;

  const isPassword = type === 'password';
  const resolvedType = isPassword && passwordVisible ? 'text' : type;
  const resolvedState: InputState = disabled
    ? 'disabled'
    : readonly
      ? 'readonly'
      : state;
  const isDisabled = resolvedState === 'disabled';
  const isReadonly = resolvedState === 'readonly' || resolvedState === 'readonly-bold';
  const isReadonlyBold = resolvedState === 'readonly-bold';
  const isDanger   = resolvedState === 'danger';
  const hasForcedFocus = resolvedState === 'focus';
  const isError = validation === 'error' && !isDisabled && !isReadonly;
  const isSuccess = validation === 'success' && !isDisabled && !isReadonly;

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
  // Per Figma (874:2811), the addon button sits INSIDE the wrapper border
  // and shares its right edge. The wrapper has overflow-hidden + rounded-4
  // which clips the button's right rounded corners against the wrapper.
  // self-stretch makes the button fill the wrapper's height; the left
  // border-l acts as the divider between input value and button.
  const addonPy = size === 'slim' ? 'py-[var(--spacing-2)]' : 'py-[var(--spacing-6)]';
  const addonBase = [
    'flex items-center gap-[var(--spacing-4)]',
    `px-[var(--spacing-12)] ${addonPy}`,
    'border-l border-solid border-[var(--form-button-border)]',
    formValueTextClasses,
    'shrink-0 self-stretch',
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
                formValueTextClasses,
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
                captionTextClasses,
                'text-[color:var(--form-label-info-text)]',
              ].join(' ')}
            >
              {labelInfo}
            </span>
          )}
        </div>
      )}

      {/* ── Input row with addon + optional external status icon ─── */}
      <div className="flex items-center gap-[var(--spacing-8)]">
        <div
          className={[
            'flex items-stretch flex-1 min-w-0',
            isReadonly ? '' : 'border border-solid rounded-[var(--radius-4)]',
            'overflow-hidden',
            'transition-colors duration-150',
            wrapperBorder,
            wrapperFill,
            focusWithin,
            isDisabled ? 'cursor-not-allowed opacity-60' : '',
            isReadonly ? 'cursor-default' : '',
          ].filter(Boolean).join(' ')}
        >
            {/* Leading slot (e.g. brand badge for CardNumberInput) — sits inside
                the wrapper, before the value text. In normal states the badge
                gets pl-12 to match the wrapper's left edge; in readonly the
                wrapper has no border and the badge sits flush at pl-0. */}
            {leadingNode && (
              <span
                className={[
                  'flex items-center shrink-0',
                  isReadonly
                    ? 'pl-0'
                    : `pl-[var(--spacing-12)] ${size === 'slim' ? 'py-[var(--spacing-2)]' : 'py-[var(--spacing-6)]'}`,
                ].join(' ')}
              >
                {leadingNode}
              </span>
            )}

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
              maxLength={maxLength}
              aria-invalid={isDanger || isError || undefined}
              onChange={(e) => {
                if (!isControlled) setInternalValue(e.target.value);
                onChange?.(e.target.value);
              }}
              className={[
                'flex-1 min-w-0',
                'bg-transparent outline-none border-none',
                isReadonly
                  ? leadingNode
                    ? `pl-[var(--spacing-8)] pr-0 ${size === 'slim' ? 'py-[var(--spacing-2)]' : 'py-[var(--spacing-6)]'}`
                    : `px-0 ${size === 'slim' ? 'py-[var(--spacing-2)]' : 'py-[var(--spacing-6)]'}`
                  : leadingNode
                    ? `pl-[var(--spacing-8)] pr-[var(--spacing-12)] ${size === 'slim' ? 'py-[var(--spacing-2)]' : 'py-[var(--spacing-6)]'}`
                    : `px-[var(--spacing-12)] ${size === 'slim' ? 'py-[var(--spacing-2)]' : 'py-[var(--spacing-6)]'}`,
                isReadonlyBold ? formValueTextBoldClasses : formValueTextClasses,
                inputTextClass,
                'placeholder:text-[color:var(--form-input-placeholder-text)]',
                isDisabled ? 'cursor-not-allowed' : '',
                isReadonly ? 'cursor-default' : '',
              ].filter(Boolean).join(' ')}
            />

            {/* Word-count counter — sits inside the field, right-aligned, before any
                trailing icon / password toggle. Hidden in readonly variants per Figma. */}
            {showCount && !isReadonly && (
              <span
                aria-hidden="true"
                className={[
                  'flex items-center pr-[var(--spacing-12)] shrink-0',
                  formValueTextClasses,
                  'text-[color:var(--form-input-placeholder-text)]',
                ].join(' ')}
              >
                {(currentValue ?? '').length}
                {maxLength != null ? `/${maxLength}` : ''}
              </span>
            )}

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

            {/* Addon button — sits INSIDE the wrapper border per Figma 874:2811.
                Negative -my-px / -mr-px lets its border overlap the wrapper's
                border so they visually merge into one line. */}
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

        {/* External status icon — bare glyph, red close on error / green check on success.
            Sits to the right of the entire input + addon group, per Figma. */}
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

      {/* ── Helper text ────────────────────────────────── */}
      {helperText && (
        <span
          className={[
            captionTextClasses,
            isDanger || isError
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
