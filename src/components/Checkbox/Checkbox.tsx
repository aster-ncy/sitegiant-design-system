import type { Ref } from 'react';
import { Icon } from '../Icon';

export interface CheckboxProps {
  /** Whether the checkbox is checked */
  checked?: boolean;
  /** Whether the checkbox is in indeterminate state */
  indeterminate?: boolean;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Visual state — 'danger' paints the box border red. */
  state?: 'default' | 'danger';
  /** Label text next to the checkbox */
  label?: string;
  /** Helper/info text below the label */
  helperText?: string;
  /** Change handler */
  onChange?: (checked: boolean) => void;
  /** Extra Tailwind/CSS classes on the root wrapper */
  className?: string;
  /** HTML id for the checkbox input */
  id?: string;
  /** Ref forwarded to the hidden native checkbox input. */
  inputRef?: Ref<HTMLInputElement>;
}

/**
 * SiteGiant Checkbox component.
 *
 * Token-driven implementation from Figma Form/checkbox section.
 * States: unchecked, checked, indeterminate, disabled (+checked), disabled (+unchecked)
 *
 * Focus model: the hidden native <input> is the canonical focus target —
 * the browser handles space/enter/tab natively, and the visible <span> box
 * paints a focus ring via Tailwind's `peer-focus-visible:` prefix when the
 * sibling input has visible focus. This avoids a double-tab-stop and makes
 * `inputRef.current?.focus()` produce a visible focus indicator.
 *
 * @example
 * <Checkbox label="Agree to terms" checked={true} onChange={setChecked} />
 */
export const Checkbox = ({
  checked = false,
  indeterminate = false,
  disabled = false,
  state = 'default',
  label,
  helperText,
  onChange,
  className = '',
  id,
  inputRef,
}: CheckboxProps) => {
  const isActive = checked || indeterminate;
  const isDanger = state === 'danger' && !disabled;

  /* ── Box styles (token-driven) ─────────────────────── */
  const boxBase = [
    'relative shrink-0',
    'w-[var(--spacing-20)] h-[var(--spacing-20)]',
    'rounded-[var(--radius-4)]',
    'border-2 border-solid',
    'transition-all duration-150',
    'flex items-center justify-center',
    // Focus ring driven by sibling <input>'s :focus-visible state.
    'peer-focus-visible:outline-none',
    'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-1',
    'peer-focus-visible:ring-[var(--button-primary-default-fill)]',
  ].join(' ');

  let boxState: string;
  if (disabled) {
    boxState = isActive
      ? 'bg-[var(--checkbox-disabled)] border-[var(--checkbox-disabled)]'
      : 'bg-[var(--checkbox-disabled-inset)] border-[var(--checkbox-disabled)]';
  } else if (isDanger) {
    // Danger overrides hover/checked border — error state takes priority.
    boxState = isActive
      ? 'bg-[var(--checkbox-checked)] border-[var(--form-input-danger-border)]'
      : 'bg-[var(--checkbox-fill)] border-[var(--form-input-danger-border)] hover:border-[var(--form-input-danger-border)]';
  } else if (isActive) {
    boxState = 'bg-[var(--checkbox-checked)] border-[var(--checkbox-checked)]';
  } else {
    boxState = 'bg-[var(--checkbox-fill)] border-[var(--checkbox-default)] hover:border-[var(--checkbox-checked)]';
  }

  return (
    <label
      className={`inline-flex items-start gap-[var(--spacing-8)] select-none ${
        disabled ? 'cursor-not-allowed opacity-100' : 'cursor-pointer'
      } ${className}`}
      htmlFor={id}
    >
      {/* Native input — canonical focus target. `peer` makes the visible box
          react to its :focus-visible state via peer-focus-visible: classes. */}
      <input
        ref={inputRef}
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange?.(!checked)}
        className="peer sr-only"
        aria-checked={indeterminate ? 'mixed' : checked}
        aria-invalid={isDanger || undefined}
      />

      {/* Visible box — purely presentational, focus ring driven by peer. */}
      <span className={`${boxBase} ${boxState}`} aria-hidden="true">
        {isActive && (
          indeterminate ? (
            <Icon name="minus" size={12} color={disabled ? 'var(--checkbox-disabled-inset)' : 'var(--color-white)'} />
          ) : (
            <Icon name="check" size={12} color={disabled ? 'var(--checkbox-disabled-inset)' : 'var(--color-white)'} />
          )
        )}
      </span>

      {/* Label + helper text */}
      {(label || helperText) && (
        <span className="flex flex-col gap-[var(--spacing-2)] pt-[var(--spacing-1)]">
          {label && (
            <span
              className={`text-[length:var(--text-14)] leading-[var(--leading-17)] font-[var(--font-weight-regular)] font-[family-name:var(--font-sans)] ${
                disabled
                  ? 'text-[color:var(--form-input-disabled-text)]'
                  : 'text-[color:var(--form-label-text)]'
              }`}
            >
              {label}
            </span>
          )}
          {helperText && (
            <span className="text-[length:var(--text-12)] leading-[var(--leading-15)] text-[color:var(--form-label-info-text)]">
              {helperText}
            </span>
          )}
        </span>
      )}
    </label>
  );
};
