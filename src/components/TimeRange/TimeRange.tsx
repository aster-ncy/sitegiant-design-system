import { useRef, useState } from 'react';
import type { Ref } from 'react';
import { Icon } from '../Icon';

export type TimeRangeState = 'default' | 'disabled' | 'readonly' | 'readonly-bold';
export type TimeRangeValidation = 'default' | 'error' | 'success' | 'warning';
export type TimeRangeSize = 'default' | 'slim';
export type TimeRangeType = 'default' | 'single';

export interface TimeRangeValue {
  /** Start time as `HH:MM`. */
  start: string;
  /** End time as `HH:MM`. Ignored when `type='single'`. */
  end: string;
}

export interface TimeRangeProps {
  /** Field type — paired `start - end` or a single time cell. */
  type?: TimeRangeType;
  /** Optional label text rendered to the left of the field. */
  label?: string;
  /** Helper / hint text below the field. Tinted on error/warning. */
  helperText?: string;
  /** Visual state. */
  state?: TimeRangeState;
  /** Validation status — paints the border + external icon. */
  validation?: TimeRangeValidation;
  /** Form size — 'slim' reduces vertical padding for compact layouts. */
  size?: TimeRangeSize;
  /** Controlled value pair. */
  value?: TimeRangeValue;
  /** Uncontrolled default. */
  defaultValue?: TimeRangeValue;
  /** Placeholder for the start cell (and for single-type cell). */
  startPlaceholder?: string;
  /** Placeholder for the end cell. Ignored when `type='single'`. */
  endPlaceholder?: string;
  /** Change handler. */
  onChange?: (value: TimeRangeValue) => void;
  /** Optional id prefix; cells get `${id}-start` / `${id}-end`. */
  id?: string;
  /** Name attribute prefix; cells get `${name}-start` / `${name}-end`. */
  name?: string;
  /** Extra classes on the root wrapper. */
  className?: string;
  /** Ref forwarded to the start cell's native <input>. */
  inputRef?: Ref<HTMLInputElement>;
}

const wrapperBorderByValidation: Record<TimeRangeValidation, string> = {
  default: 'border-[var(--form-input-default-border)]',
  error: 'border-[var(--form-input-danger-border)]',
  success: 'border-[var(--form-input-default-border)]',
  // Warning uses the same danger red as error per Figma — the
  // semantic difference is icon shape (triangle vs X), not color.
  warning: 'border-[var(--form-input-danger-border)]',
};

/**
 * TimeRange — Figma: Form field with Time Range (1642:430).
 *
 * A bordered shell holding `start - end` time cells separated by a
 * literal `-` glyph. The single-cell variant (`type='single'`) drops
 * the separator + end cell and renders just `start`. Validation icons
 * (close / check / alert-triangle) sit to the right, mirroring Input.
 *
 * Time values are kept as free-text `HH:MM` strings — the component
 * does not validate or coerce; pair with form-level validation.
 */
export const TimeRange = ({
  type = 'default',
  label,
  helperText,
  state = 'default',
  validation = 'default',
  size = 'default',
  value,
  defaultValue,
  startPlaceholder = '00:00',
  endPlaceholder = '00:00',
  onChange,
  id,
  name,
  className = '',
  inputRef,
}: TimeRangeProps) => {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<TimeRangeValue>(
    defaultValue ?? { start: '', end: '' },
  );
  const current = isControlled ? value : internal;

  const isDisabled = state === 'disabled';
  const isReadonly = state === 'readonly' || state === 'readonly-bold';
  const isReadonlyBold = state === 'readonly-bold';
  const isError = validation === 'error' && !isDisabled && !isReadonly;
  const isSuccess = validation === 'success' && !isDisabled && !isReadonly;
  const isWarning = validation === 'warning' && !isDisabled && !isReadonly;

  const update = (next: TimeRangeValue) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const onCellChange = (key: 'start' | 'end') => (raw: string) => {
    update({ ...current, [key]: raw });
  };

  const startCellRef = useRef<HTMLInputElement | null>(null);
  const focusStart = () => {
    if (isDisabled || isReadonly) return;
    startCellRef.current?.focus();
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
      'w-[84px]',
      'bg-transparent outline-none border-none',
      'text-center',
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

  const isStartEmpty = current.start === '';
  const isEndEmpty = current.end === '';

  const readonlyText =
    type === 'single' ? current.start : `${current.start} - ${current.end}`;

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
            onClick={isReadonly ? undefined : focusStart}
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
                    startCellRef.current = el;
                    if (typeof inputRef === 'function') {
                      inputRef(el);
                    } else if (inputRef) {
                      // React 19 RefObject: `current` is intentionally mutable.
                      // Use Object.assign to satisfy `react-hooks/immutability`,
                      // which forbids direct prop-property assignment.
                      Object.assign(inputRef, { current: el });
                    }
                  }}
                  id={id ? `${id}-start` : undefined}
                  name={name ? `${name}-start` : undefined}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{1,2}:[0-9]{2}"
                  value={current.start}
                  placeholder={startPlaceholder}
                  disabled={isDisabled}
                  aria-invalid={isError || undefined}
                  onChange={(e) => onCellChange('start')(e.target.value)}
                  className={cellClass(isStartEmpty)}
                />
                {type === 'default' && (
                  <>
                    <span aria-hidden="true" className={separatorClass}>
                      -
                    </span>
                    <input
                      id={id ? `${id}-end` : undefined}
                      name={name ? `${name}-end` : undefined}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{1,2}:[0-9]{2}"
                      value={current.end}
                      placeholder={endPlaceholder}
                      disabled={isDisabled}
                      aria-invalid={isError || undefined}
                      onChange={(e) => onCellChange('end')(e.target.value)}
                      className={cellClass(isEndEmpty)}
                    />
                  </>
                )}
              </>
            )}
          </div>

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
