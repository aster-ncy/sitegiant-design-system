import { useEffect, useRef, useState } from 'react';
import type { Ref } from 'react';
import { Icon } from '../Icon';

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

export type OTPState = 'default' | 'disabled' | 'readonly' | 'readonly-bold';
export type OTPValidation = 'default' | 'error' | 'success';

export interface OTPProps {
  /** Number of digit cells. Default 6. */
  length?: number;
  /** Controlled value — string of length 0..length, digits only. */
  value?: string;
  /** Uncontrolled default value. */
  defaultValue?: string;
  /** Visual state. */
  state?: OTPState;
  /** Validation status — paints all cell borders + external icon. */
  validation?: OTPValidation;
  /** Helper text shown below the field row. */
  helperText?: string;
  /** Fired with the new value on every input change. */
  onChange?: (value: string) => void;
  /** Fired once the user types into the final cell (full code entered). */
  onComplete?: (value: string) => void;
  /** HTML id prefix; cells get `${id}-0` ... `${id}-N`. */
  id?: string;
  /** Name attribute for the first cell (typical autofill target). */
  name?: string;
  /** Auto-focus the first cell on mount. */
  autoFocus?: boolean;
  /** Extra classes on the root wrapper. */
  className?: string;
  /** Ref forwarded to the first cell's native <input>. */
  inputRef?: Ref<HTMLInputElement>;
}

const cellBorderByValidation: Record<OTPValidation, string> = {
  default: 'border-[var(--form-input-default-border)]',
  error: 'border-[var(--form-input-danger-border)]',
  success: 'border-[var(--form-input-default-border)]',
};

/**
 * OTP — Figma: Form Value with 6-digit (2041:1825).
 *
 * A row of N (default 6) single-digit input cells for one-time codes
 * or PIN entry. Typing in a cell auto-advances to the next; backspace
 * clears the current cell and steps back to the previous; pasting a
 * code fills all cells at once.
 *
 * The whole row shares one `validation` border colour. Validation
 * icons (close / check) sit to the right of the row, mirroring Input.
 *
 * Value is always digits-only; non-digit characters are stripped from
 * input/paste. Empty cells render with placeholder colour.
 */
export const OTP = ({
  length = 6,
  value,
  defaultValue,
  state = 'default',
  validation = 'default',
  helperText,
  onChange,
  onComplete,
  id,
  name,
  autoFocus = false,
  className = '',
  inputRef,
}: OTPProps) => {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string>(defaultValue ?? '');
  const current = (isControlled ? value : internal) ?? '';

  const isDisabled = state === 'disabled';
  const isReadonly = state === 'readonly' || state === 'readonly-bold';
  const isReadonlyBold = state === 'readonly-bold';
  const isError = validation === 'error' && !isDisabled && !isReadonly;
  const isSuccess = validation === 'success' && !isDisabled && !isReadonly;

  // Per-cell refs so we can manage focus on type / backspace / paste.
  const cellRefs = useRef<Array<HTMLInputElement | null>>([]);
  const setCellRef = (idx: number) => (el: HTMLInputElement | null) => {
    cellRefs.current[idx] = el;
    if (idx === 0) {
      if (typeof inputRef === 'function') {
        inputRef(el);
      } else if (inputRef) {
        Object.assign(inputRef, { current: el });
      }
    }
  };

  useEffect(() => {
    if (autoFocus) cellRefs.current[0]?.focus();
  }, [autoFocus]);

  const update = (next: string) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
    if (next.length === length) onComplete?.(next);
  };

  const onCellInput = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Take the LAST typed digit so re-typing on a filled cell replaces.
    const digit = raw.replace(/\D/g, '').slice(-1);
    if (!digit) {
      // Empty input (e.g. user selected and deleted) — clear this cell only
      // when it's within the filled prefix. Beyond that the value already
      // has no digit at idx, so nothing to clear.
      if (idx < current.length) {
        const next = current.slice(0, idx) + current.slice(idx + 1);
        update(next);
      }
      return;
    }
    // Standard OTP UX: typing always lands at the first-empty position.
    // If the user focuses an empty cell past the current end and types,
    // the digit slots in at `current.length` (next empty), not the cell
    // they clicked — otherwise we'd have to track sparse cell state.
    const writeIdx = Math.min(idx, current.length);
    const before = current.slice(0, writeIdx);
    const after = current.slice(writeIdx + 1);
    const merged = (before + digit + after).slice(0, length);
    update(merged);
    // Advance focus to next cell (or stay if last).
    if (writeIdx < length - 1) cellRefs.current[writeIdx + 1]?.focus();
  };

  const onCellKeyDown = (idx: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isDisabled || isReadonly) return;
    if (e.key === 'Backspace') {
      // Empty cell → step back. Filled cell → clear and stay.
      const cellEmpty = !current[idx];
      if (cellEmpty && idx > 0) {
        e.preventDefault();
        const next = current.slice(0, idx - 1) + current.slice(idx);
        update(next);
        cellRefs.current[idx - 1]?.focus();
      } else if (!cellEmpty) {
        e.preventDefault();
        const next = current.slice(0, idx) + current.slice(idx + 1);
        update(next);
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      e.preventDefault();
      cellRefs.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && idx < length - 1) {
      e.preventDefault();
      cellRefs.current[idx + 1]?.focus();
    }
  };

  const onCellPaste = (idx: number) => (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (isDisabled || isReadonly) return;
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '');
    if (!pasted) return;
    e.preventDefault();
    const before = current.slice(0, idx);
    const merged = (before + pasted).slice(0, length);
    update(merged);
    // Move focus to either the cell after the last filled one, or the
    // last cell if everything is filled.
    const focusIdx = Math.min(merged.length, length - 1);
    cellRefs.current[focusIdx]?.focus();
  };

  // Readonly renders as a single static "0 0 0 0 0 0" line — no cells.
  if (isReadonly) {
    const display = current.split('').join(' ');
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
              'whitespace-nowrap tabular-nums',
            ].join(' ')}
          >
            {display}
          </span>
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
              captionTextClasses,
              isError
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
        <div className="inline-flex items-start gap-[var(--spacing-4)]">
          {Array.from({ length }).map((_, idx) => {
            const cellValue = current[idx] ?? '';
            const isCellEmpty = cellValue === '';
            return (
              <input
                key={idx}
                ref={setCellRef(idx)}
                id={id ? `${id}-${idx}` : undefined}
                name={idx === 0 ? name : undefined}
                type="text"
                inputMode="numeric"
                autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                maxLength={1}
                value={cellValue}
                disabled={isDisabled}
                aria-label={`Digit ${idx + 1} of ${length}`}
                aria-invalid={isError || undefined}
                onChange={onCellInput(idx)}
                onKeyDown={onCellKeyDown(idx)}
                onPaste={onCellPaste(idx)}
                onFocus={(e) => {
                  // Standard OTP UX: redirect focus to the first empty
                  // cell so the user can't skip ahead. If the cell they
                  // clicked is at or before current.length, leave focus
                  // there and select the digit so retyping replaces it.
                  if (idx > current.length && cellRefs.current[current.length]) {
                    cellRefs.current[current.length]?.focus();
                    return;
                  }
                  e.currentTarget.select();
                }}
                className={[
                  'w-[33px] shrink-0',
                  'border border-solid rounded-[var(--radius-4)]',
                  cellBorderByValidation[validation],
                  'px-[var(--spacing-12)] py-[var(--spacing-6)]',
                  isDisabled
                    ? 'bg-[var(--form-input-disabled-fill)] cursor-not-allowed opacity-60'
                    : 'bg-[var(--form-input-default-fill)]',
                  !isDisabled && !isError
                    ? 'focus:border-[var(--form-input-focus-border)]'
                    : '',
                  'outline-none',
                  'text-center',
                  formValueTextClasses,
                  'tabular-nums',
                  isDisabled
                    ? 'text-[color:var(--form-input-disabled-text)]'
                    : isCellEmpty
                      ? 'text-[color:var(--form-input-placeholder-text)]'
                      : 'text-[color:var(--form-input-value-text)]',
                  'placeholder:text-[color:var(--form-input-placeholder-text)]',
                  'transition-colors duration-150',
                ].join(' ')}
                placeholder="0"
              />
            );
          })}
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
            captionTextClasses,
            isError
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
