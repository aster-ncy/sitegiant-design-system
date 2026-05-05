import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Ref } from 'react';
import { createPortal } from 'react-dom';
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
  /**
   * Show the scroll-column time picker popover on cell focus. Default true.
   * When false, the cells behave as plain text inputs.
   */
  showPicker?: boolean;
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

/* ── Typography recipes (Pattern B — compact numeric fields) ───────────── */
/* Label: 14 / 21 / regular — table-body-* (these fields commonly sit in
 * table rows; routing label through table-body keeps row-resident
 * typography aligned with the body cells around them). */
const labelTextClasses =
  'text-[length:var(--table-body-size)] leading-[var(--table-body-lineheight)] ' +
  'font-[family-name:var(--general-font-family)] font-[weight:var(--table-body-weight)]';

/* Value (cell + separator + readonly span): 14 / 17 / regular — body-slim. */
const bodySlimTextClasses =
  'text-[length:var(--general-body-size)] leading-[var(--general-body-slim-lineheight)] ' +
  'font-[family-name:var(--general-font-family)] font-[weight:var(--general-body-weight)]';

/* Value bold (readonly-bold state): 14 / 17 / bold — body-slim-bold. */
const bodySlimBoldTextClasses =
  'text-[length:var(--general-body-size)] leading-[var(--general-body-slim-lineheight)] ' +
  'font-[family-name:var(--general-font-family)] font-[weight:var(--general-body-bold-weight)]';

/* Hint / helper text: 12 / 17 / regular — caption. */
const captionTextClasses =
  'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)] ' +
  'font-[family-name:var(--general-font-family)] font-[weight:var(--general-caption-weight)]';

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

/**
 * Parse "HH:MM" — returns [hour, minute] strings or [null, null] if malformed.
 */
const parseHM = (raw: string): [string | null, string | null] => {
  const m = raw.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return [null, null];
  const h = Number(m[1]);
  const mm = Number(m[2]);
  if (h < 0 || h > 23 || mm < 0 || mm > 59) return [null, null];
  return [String(h).padStart(2, '0'), String(mm).padStart(2, '0')];
};

/**
 * TimeRange — Figma: Form field with Time Range (1642:430).
 *
 * A bordered shell holding `start - end` time cells separated by a
 * literal `-` glyph. Focusing a cell opens a 2-column HH / MM scroll
 * picker; users can also type `HH:MM` directly. The single-cell variant
 * (`type='single'`) drops the separator + end cell. Validation icons
 * (close / check / alert-triangle) sit to the right, mirroring Input.
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
  showPicker = true,
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
  const endCellRef = useRef<HTMLInputElement | null>(null);
  const focusStart = () => {
    if (isDisabled || isReadonly) return;
    startCellRef.current?.focus();
  };

  // ── Time-picker popover state ───────────────────────────────
  const pickerEnabled = showPicker && !isDisabled && !isReadonly;
  const [activeCell, setActiveCell] = useState<'start' | 'end' | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close popover when focus leaves the whole component, or click-outside.
  // The popover itself lives in a portal under <body>, so we mark its root
  // with [data-tr-popover] to recognize it as "inside" for click-outside.
  useEffect(() => {
    if (!activeCell) return;
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (containerRef.current && containerRef.current.contains(t)) return;
      if (t.closest('[data-tr-popover]')) return;
      setActiveCell(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveCell(null);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [activeCell]);

  const writeCell = (key: 'start' | 'end', hh: string, mm: string) => {
    update({ ...current, [key]: `${hh}:${mm}` });
  };

  // Selected H/M for the popover wheels — fall back to "00" when value is
  // empty or malformed so the column still has a sensible "current" row.
  const activeRaw = activeCell ? current[activeCell] : '';
  const [selH, selM] = parseHM(activeRaw);

  // ── Layout classes ──────────────────────────────────────────
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
      isReadonlyBold ? bodySlimBoldTextClasses : bodySlimTextClasses,
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
    bodySlimTextClasses,
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
      ref={containerRef}
      className={[
        'inline-flex items-start gap-[var(--spacing-8)]',
        'relative',
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
            labelTextClasses,
            'text-[color:var(--form-label-text)]',
            isDisabled ? 'opacity-60' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {label}
        </span>
      )}
      <div className="flex flex-col gap-[var(--spacing-4)] items-start relative">
        <div className="flex items-center gap-[var(--spacing-8)]">
          <div
            className={shellBaseClass}
            onClick={(e) => {
              // Click-anywhere-to-focus is for the dead space inside the
              // shell (between cells, around the dash). Bail if the click
              // already landed on an input — otherwise we'd steal focus
              // from whichever cell the user just clicked.
              if (isReadonly) return;
              if (e.target instanceof HTMLInputElement) return;
              focusStart();
            }}
          >
            {isReadonly ? (
              <span
                aria-readonly="true"
                className={[
                  'whitespace-nowrap',
                  isReadonlyBold ? bodySlimBoldTextClasses : bodySlimTextClasses,
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
                  onFocus={() => pickerEnabled && setActiveCell('start')}
                  onChange={(e) => onCellChange('start')(e.target.value)}
                  className={cellClass(isStartEmpty)}
                />
                {type === 'default' && (
                  <>
                    <span aria-hidden="true" className={separatorClass}>
                      -
                    </span>
                    <input
                      ref={endCellRef}
                      id={id ? `${id}-end` : undefined}
                      name={name ? `${name}-end` : undefined}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{1,2}:[0-9]{2}"
                      value={current.end}
                      placeholder={endPlaceholder}
                      disabled={isDisabled}
                      aria-invalid={isError || undefined}
                      onFocus={() => pickerEnabled && setActiveCell('end')}
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
              captionTextClasses,
              isError || isWarning
                ? 'text-[color:var(--color-sys-red-DEFAULT)]'
                : 'text-[color:var(--form-label-info-text)]',
            ].join(' ')}
          >
            {helperText}
          </span>
        )}

        {/* ── Time-picker popover (portaled to <body>) ─────── */}
        {pickerEnabled && activeCell && (
          <TimePickerPopover
            // Anchor under the active cell input, not the shared shell,
            // so the picker visually points at whichever field is focused.
            anchorRef={activeCell === 'start' ? startCellRef : endCellRef}
            selectedH={selH}
            selectedM={selM}
            onPick={(hh, mm) => writeCell(activeCell, hh, mm)}
            onConfirm={() => setActiveCell(null)}
          />
        )}
      </div>
    </div>
  );
};

/* ── Time-picker popover ───────────────────────────────── */

interface TimePickerPopoverProps {
  anchorRef: React.RefObject<HTMLElement | null>;
  selectedH: string | null;
  selectedM: string | null;
  onPick: (hh: string, mm: string) => void;
  onConfirm: () => void;
}

const TimePickerPopover = ({
  anchorRef,
  selectedH,
  selectedM,
  onPick,
  onConfirm,
}: TimePickerPopoverProps) => {
  const hourCol = useRef<HTMLDivElement | null>(null);
  const minuteCol = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  // Position the portal popover beneath the anchor field. Recompute on
  // mount and on scroll/resize so the popover tracks the field.
  useLayoutEffect(() => {
    const reposition = () => {
      const el = anchorRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // 4px gap matches the inline mt-[var(--spacing-4)] from the previous impl.
      setPos({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX });
    };
    reposition();
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => {
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [anchorRef]);

  // Auto-scroll selected row into view on open and when selection changes.
  // Depend on `pos` so the effect re-runs once the popover has actually
  // mounted (it returns null until pos is computed, so refs aren't valid
  // on the first commit). Scrolls the column only — never the page.
  useEffect(() => {
    if (!pos) return;
    const scrollToSelected = (col: HTMLDivElement | null, value: string | null) => {
      if (!col || !value) return;
      const row = col.querySelector<HTMLButtonElement>(`[data-value="${value}"]`);
      if (row) {
        const colRect = col.getBoundingClientRect();
        const rowRect = row.getBoundingClientRect();
        const offset = rowRect.top - colRect.top - col.clientHeight / 2 + row.clientHeight / 2;
        col.scrollTop += offset;
      }
    };
    scrollToSelected(hourCol.current, selectedH);
    scrollToSelected(minuteCol.current, selectedM);
  }, [pos, selectedH, selectedM]);

  const safeH = selectedH ?? '00';
  const safeM = selectedM ?? '00';

  if (!pos) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-label="Select time"
      data-tr-popover=""
      style={{ position: 'absolute', top: pos.top, left: pos.left }}
      className={[
        'z-50',
        'flex flex-col',
        'bg-[var(--form-input-default-fill)]',
        'border border-solid border-[var(--form-input-default-border)]',
        'rounded-[var(--radius-4)]',
        'shadow-[0_4px_12px_rgba(0,0,0,0.08)]',
        'overflow-hidden',
      ].join(' ')}
      onMouseDown={(e) => {
        // Stop the input from blurring (which would close the popover) when
        // the user clicks anywhere inside the picker.
        e.preventDefault();
      }}
    >
      <div className="flex">
        <TimeColumn
          ref={hourCol}
          label="HH"
          options={HOURS}
          selected={safeH}
          onSelect={(h) => onPick(h, safeM)}
        />
        <div
          aria-hidden="true"
          className="self-stretch border-l border-solid border-[var(--form-input-default-border)]"
        />
        <TimeColumn
          ref={minuteCol}
          label="MM"
          options={MINUTES}
          selected={safeM}
          onSelect={(m) => onPick(safeH, m)}
        />
      </div>
      <div className="flex justify-end border-t border-solid border-[var(--form-input-default-border)] p-[var(--spacing-8)]">
        <button
          type="button"
          onClick={onConfirm}
          className={[
            'inline-flex items-center justify-center',
            'h-[27px] px-[var(--spacing-12)] rounded-[var(--radius-120)]',
            'bg-[var(--button-primary-default-fill)]',
            'text-[color:var(--button-primary-text)]',
            'text-[length:var(--text-14)] leading-[var(--leading-17)]',
            'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
            'border-none outline-none cursor-pointer',
            'hover:bg-[var(--button-primary-hover-fill)]',
            'transition-colors duration-150',
          ].join(' ')}
        >
          Ok
        </button>
      </div>
    </div>,
    document.body,
  );
};

interface TimeColumnProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

// Forward-ref-less impl: just attach the ref via a callback prop, lighter API.
const TimeColumn = ({
  ref,
  label,
  options,
  selected,
  onSelect,
}: TimeColumnProps & { ref?: Ref<HTMLDivElement> }) => {
  return (
    <div className="flex flex-col">
      <div
        className={[
          'px-[var(--spacing-12)] py-[var(--spacing-4)]',
          'text-[length:var(--text-12)] leading-[var(--leading-15)]',
          'font-[family-name:var(--font-sans)] font-[var(--font-weight-medium)]',
          'text-[color:var(--form-label-info-text)]',
          'text-center',
          'border-b border-solid border-[var(--form-input-default-border)]',
        ].join(' ')}
      >
        {label}
      </div>
      <div
        ref={ref}
        className={[
          'flex flex-col',
          'h-[160px] w-[60px]',
          'overflow-y-auto',
          'scrollbar-thin',
        ].join(' ')}
      >
        {options.map((opt) => {
          const isSelected = opt === selected;
          return (
            <button
              key={opt}
              type="button"
              data-value={opt}
              tabIndex={-1}
              onClick={() => onSelect(opt)}
              className={[
                'shrink-0',
                'px-[var(--spacing-12)] py-[var(--spacing-4)]',
                'text-[length:var(--text-14)] leading-[var(--leading-21)]',
                'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
                'text-center',
                'border-none outline-none cursor-pointer',
                'transition-colors duration-100',
                isSelected
                  ? 'bg-[var(--color-sys-blue-lighter)] text-[color:var(--color-sys-blue-DEFAULT)] font-[var(--font-weight-medium)]'
                  : 'bg-transparent text-[color:var(--form-input-value-text)] hover:bg-[var(--color-space-lighter)]',
              ].join(' ')}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};
