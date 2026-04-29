import { useRef, useState } from 'react';
import type { Ref } from 'react';
import { Icon } from '../Icon';

export type QuantityState = 'default' | 'disabled' | 'readonly' | 'readonly-bold';
export type QuantityValidation = 'default' | 'error' | 'success' | 'warning';
export type QuantitySize = 'default' | 'slim';
export type QuantityType = 'default' | 'single';

export interface QuantityValue {
  /** Current count. */
  current: string;
  /** Total / capacity. Ignored when `type='single'`. */
  total: string;
}

export interface QuantityProps {
  /** Field type — paired `current / total` or a single number cell. */
  type?: QuantityType;
  /** Optional label text rendered to the left of the field. */
  label?: string;
  /** Helper / hint text below the field. Tinted on error/warning. */
  helperText?: string;
  /** Visual state. */
  state?: QuantityState;
  /** Validation status — paints the border + external icon. */
  validation?: QuantityValidation;
  /** Form size — 'slim' reduces vertical padding for compact layouts. */
  size?: QuantitySize;
  /** Controlled value pair. */
  value?: QuantityValue;
  /** Uncontrolled default. */
  defaultValue?: QuantityValue;
  /** Lower-bound clamp for both fields. */
  min?: number;
  /** Upper-bound clamp for both fields. */
  max?: number;
  /** Placeholder for the `current` cell. */
  currentPlaceholder?: string;
  /** Placeholder for the `total` cell. Ignored when `type='single'`. */
  totalPlaceholder?: string;
  /** Change handler — fires when either cell changes. */
  onChange?: (value: QuantityValue) => void;
  /** Optional id prefix; cells get `${id}-current` / `${id}-total`. */
  id?: string;
  /** Name attribute prefix; cells get `${name}-current` / `${name}-total`. */
  name?: string;
  /** Extra classes on the root wrapper. */
  className?: string;
  /** Ref forwarded to the `current` cell's native <input>. */
  inputRef?: Ref<HTMLInputElement>;
}

const wrapperBorderByValidation: Record<QuantityValidation, string> = {
  default: 'border-[var(--form-input-default-border)]',
  error: 'border-[var(--form-input-danger-border)]',
  success: 'border-[var(--form-input-default-border)]',
  // Warning uses the same danger red as error per Figma — the
  // semantic difference is icon shape (triangle vs X), not color.
  warning: 'border-[var(--form-input-danger-border)]',
};

const clamp = (n: number, min?: number, max?: number) => {
  if (min != null && n < min) return min;
  if (max != null && n > max) return max;
  return n;
};

/**
 * Quantity — Figma: Form field with Quantity (1476:7068).
 *
 * A bordered shell holding `current / total` numeric cells separated by
 * a literal `/` glyph (e.g. "stock used / capacity"). The single-cell
 * variant (`type='single'`) drops the separator + total cell and renders
 * just `current`. Validation icons (close / check / alert-triangle) sit
 * to the right of the entire shell, mirroring Input's pattern.
 *
 * Distinct from NumberRange (min — max with two separate bordered
 * fields). Use NumberRange for filter ranges; Quantity for "x of y".
 */
export const Quantity = ({
  type = 'default',
  label,
  helperText,
  state = 'default',
  validation = 'default',
  size = 'default',
  value,
  defaultValue,
  min,
  max,
  currentPlaceholder = '0',
  totalPlaceholder = '0',
  onChange,
  id,
  name,
  className = '',
  inputRef,
}: QuantityProps) => {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<QuantityValue>(
    defaultValue ?? { current: '', total: '' },
  );
  const current = isControlled ? value : internal;

  const isDisabled = state === 'disabled';
  const isReadonly = state === 'readonly' || state === 'readonly-bold';
  const isReadonlyBold = state === 'readonly-bold';
  const isError = validation === 'error' && !isDisabled && !isReadonly;
  const isSuccess = validation === 'success' && !isDisabled && !isReadonly;
  const isWarning = validation === 'warning' && !isDisabled && !isReadonly;

  const update = (next: QuantityValue) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const onCellChange = (key: 'current' | 'total') => (raw: string) => {
    const parsed = raw === '' ? '' : String(clamp(Number(raw), min, max));
    update({ ...current, [key]: parsed });
  };

  // Wrapper acts as the bordered shell. Click-anywhere focuses the
  // current cell — improves the hit-target for the small inputs.
  const currentCellRef = useRef<HTMLInputElement | null>(null);
  const focusCurrent = () => {
    if (isDisabled || isReadonly) return;
    currentCellRef.current?.focus();
  };

  const shellBaseClass = [
    'inline-flex items-center',
    'gap-[var(--spacing-4)]',
    isReadonly ? '' : 'border border-solid rounded-[var(--radius-4)]',
    isReadonly ? '' : wrapperBorderByValidation[validation],
    isReadonly ? '' : `px-[var(--spacing-8)] ${size === 'slim' ? 'py-[var(--spacing-2)]' : 'py-[var(--spacing-6)]'}`,
    isDisabled
      ? 'bg-[var(--form-input-disabled-fill)] cursor-not-allowed opacity-60'
      : isReadonly
        ? 'bg-transparent cursor-default'
        : 'bg-[var(--form-input-default-fill)] cursor-text',
    !isDisabled && !isReadonly && !isError
      ? 'focus-within:border-[var(--form-input-focus-border)]'
      : '',
    'transition-colors duration-150',
  ]
    .filter(Boolean)
    .join(' ');

  const cellClass = (isPlaceholder: boolean) =>
    [
      'min-w-0',
      'w-[32px]',
      'bg-transparent outline-none border-none',
      'text-center',
      // Hide native browser stepper.
      '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
      'text-[length:var(--text-14)] leading-[var(--leading-17)]',
      'font-[family-name:var(--font-sans)]',
      isReadonlyBold ? 'font-[var(--font-weight-bold)]' : 'font-[var(--font-weight-regular)]',
      isDisabled
        ? 'text-[color:var(--form-input-disabled-text)] cursor-not-allowed'
        : isPlaceholder
          ? 'text-[color:var(--form-input-placeholder-text)]'
          : 'text-[color:var(--form-input-value-text)]',
      'placeholder:text-[color:var(--form-input-placeholder-text)]',
    ]
      .filter(Boolean)
      .join(' ');

  const separatorClass = [
    'shrink-0',
    'text-[length:var(--text-14)] leading-[var(--leading-17)]',
    'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
    isDisabled
      ? 'text-[color:var(--form-input-disabled-text)]'
      : 'text-[color:var(--form-input-value-text)]',
  ].join(' ');

  const isCurrentEmpty = current.current === '';
  const isTotalEmpty = current.total === '';

  // Readonly renders a static "current / total" string instead of inputs.
  const readonlyText =
    type === 'single'
      ? current.current
      : `${current.current} / ${current.total}`;

  return (
    <div
      className={[
        'inline-flex items-start gap-[var(--spacing-8)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label && (
        <span
          className={[
            'shrink-0',
            size === 'slim' ? 'py-[var(--spacing-2)]' : 'py-[var(--spacing-6)]',
            'text-[length:var(--text-14)] leading-[var(--leading-21)]',
            'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
            'text-[color:var(--form-label-text)]',
            isDisabled ? 'opacity-60' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {label}
        </span>
      )}
      <div className="flex flex-col gap-[var(--spacing-4)] items-start">
        <div className="flex items-center gap-[var(--spacing-8)]">
          <div
            className={shellBaseClass}
            onClick={isReadonly ? undefined : focusCurrent}
          >
            {isReadonly ? (
              <span
                aria-readonly="true"
                className={[
                  'whitespace-nowrap',
                  'text-[length:var(--text-14)] leading-[var(--leading-17)]',
                  'font-[family-name:var(--font-sans)]',
                  isReadonlyBold
                    ? 'font-[var(--font-weight-bold)]'
                    : 'font-[var(--font-weight-regular)]',
                  'text-[color:var(--form-input-value-text)]',
                ].join(' ')}
              >
                {readonlyText}
              </span>
            ) : (
              <>
                <input
                  ref={(el) => {
                    currentCellRef.current = el;
                    if (typeof inputRef === 'function') {
                      inputRef(el);
                    } else if (inputRef) {
                      // React 19 RefObject: `current` is intentionally mutable.
                      // Use Object.assign to satisfy `react-hooks/immutability`,
                      // which forbids direct prop-property assignment.
                      Object.assign(inputRef, { current: el });
                    }
                  }}
                  id={id ? `${id}-current` : undefined}
                  name={name ? `${name}-current` : undefined}
                  type="number"
                  inputMode="numeric"
                  value={current.current}
                  placeholder={currentPlaceholder}
                  min={min}
                  max={max}
                  disabled={isDisabled}
                  aria-invalid={isError || undefined}
                  onChange={(e) => onCellChange('current')(e.target.value)}
                  className={cellClass(isCurrentEmpty)}
                />
                {type === 'default' && (
                  <>
                    <span aria-hidden="true" className={separatorClass}>
                      /
                    </span>
                    <input
                      id={id ? `${id}-total` : undefined}
                      name={name ? `${name}-total` : undefined}
                      type="number"
                      inputMode="numeric"
                      value={current.total}
                      placeholder={totalPlaceholder}
                      min={min}
                      max={max}
                      disabled={isDisabled}
                      aria-invalid={isError || undefined}
                      onChange={(e) => onCellChange('total')(e.target.value)}
                      className={cellClass(isTotalEmpty)}
                    />
                  </>
                )}
              </>
            )}
          </div>

          {/* External validation icon — bare glyph, sits right of the shell. */}
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
              'text-[length:var(--text-12)] leading-[var(--leading-15)]',
              'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
              isError || isWarning
                ? 'text-[color:var(--color-sys-red-DEFAULT)]'
                : 'text-[color:var(--form-label-info-text)]',
            ].join(' ')}
          >
            {helperText}
          </span>
        )}
      </div>
    </div>
  );
};
