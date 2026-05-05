import React from 'react';

/* ── Typography recipes (Pattern C — selection-control labels) ────────── */
/* Label: 14 / 21 / regular — body. Per Figma node 1152:190 + 1165:239,
 * toggle option labels share the body/form-label recipe (both alias to
 * identical numbers; using --general-body-* to match Checkbox/Radio). */
const bodyTextClasses =
  'text-[length:var(--general-body-size)] leading-[var(--general-body-lineheight)] ' +
  'font-[family-name:var(--general-font-family)] font-[weight:var(--general-body-weight)]';

/* Helper / hint text: 12 / 17 / regular — caption. */
const captionTextClasses =
  'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)] ' +
  'font-[family-name:var(--general-font-family)] font-[weight:var(--general-caption-weight)]';

export type ToggleVariant = 'default' | 'special';

export interface ToggleProps {
  /** Whether the toggle is on */
  checked?: boolean;
  /** Visual variant: default (green) or special (blue) */
  variant?: ToggleVariant;
  /** Whether the toggle is disabled */
  disabled?: boolean;
  /** Label text */
  label?: string;
  /** Helper text below the label */
  helperText?: string;
  /** Change handler */
  onChange?: (checked: boolean) => void;
  /** Extra classes */
  className?: string;
  /** HTML id */
  id?: string;
}

/*
 * Figma spec (Form/toggle):
 * - Track: 36×20px (derived from spacing system)
 * - Knob: 16×16px circle, 2px offset from edges
 * - States: unchecked, checked (default green), checked (special blue), disabled
 */

/**
 * SiteGiant Toggle / Switch component.
 *
 * Token-driven from Figma Form/toggle section.
 * Variants: default (green), special (blue)
 * States: off, on, disabled
 */
export const Toggle = ({
  checked = false,
  variant = 'default',
  disabled = false,
  label,
  helperText,
  onChange,
  className = '',
  id,
}: ToggleProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange?.(!checked);
    }
  };

  /* ── Track styles ──────────────────────────────────── */
  const trackBase = [
    'relative shrink-0',
    'w-[var(--spacing-36)] h-[var(--spacing-20)]',
    'rounded-full',
    'border border-solid',
    'transition-colors duration-200',
    'flex items-center p-[var(--spacing-1)]',
  ].join(' ');

  let trackState: string;
  if (disabled) {
    trackState = 'bg-[var(--form-toggle-default-fill)] border-[var(--form-toggle-default-border)] opacity-50';
  } else if (checked) {
    if (variant === 'special') {
      trackState = 'bg-[var(--form-toggle-special-fill)] border-[var(--form-toggle-special-border)]';
    } else {
      trackState = 'bg-[var(--form-toggle-checked-fill)] border-[var(--form-toggle-checked-border)]';
    }
  } else {
    trackState = 'bg-[var(--form-toggle-default-fill)] border-[var(--form-toggle-default-border)]';
  }

  /* ── Knob styles ───────────────────────────────────── */
  const knobBase = [
    'w-[var(--spacing-16)] h-[var(--spacing-16)]',
    'rounded-full',
    'transition-transform duration-200 ease-in-out',
    'shadow-sm shrink-0',
  ].join(' ');

  let knobState: string;
  if (checked) {
    knobState = [
      'translate-x-[var(--spacing-16)]',
      'bg-[var(--form-toggle-checked-knob-fill)]',
    ].join(' ');
  } else {
    knobState = [
      'translate-x-0',
      'bg-[var(--form-toggle-default-knob-fill)]',
    ].join(' ');
  }

  return (
    <label
      className={`inline-flex items-start gap-[var(--spacing-8)] select-none ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      htmlFor={id}
    >
      {/* Hidden native input */}
      <input
        type="checkbox"
        role="switch"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange?.(!checked)}
        className="sr-only"
        aria-checked={checked}
      />

      {/* Custom track + knob */}
      <span
        className={`${trackBase} ${trackState}`}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="presentation"
      >
        <span className={`${knobBase} ${knobState}`} />
      </span>

      {/* Label + helper text */}
      {(label || helperText) && (
        <span className="flex flex-col gap-[var(--spacing-2)]">
          {label && (
            <span
              className={`${bodyTextClasses} ${
                disabled
                  ? 'text-[color:var(--form-input-disabled-text)]'
                  : 'text-[color:var(--form-label-text)]'
              }`}
            >
              {label}
            </span>
          )}
          {helperText && (
            <span className={`${captionTextClasses} text-[color:var(--form-label-info-text)]`}>
              {helperText}
            </span>
          )}
        </span>
      )}
    </label>
  );
};
