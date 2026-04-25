import { useMemo } from 'react';
import { DatePicker as AntDatePicker } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { Icon } from '../Icon';

const { RangePicker } = AntDatePicker;

export type DateRangePickerState = 'default' | 'disabled' | 'readonly' | 'readonly-bold';
export type DateRangePickerValidation = 'default' | 'error' | 'success';

export interface DateRangePickerValue {
  start: string;
  end: string;
}

export interface DateRangePreset {
  label: string;
  value: DateRangePickerValue;
}

export interface DateRangePickerProps {
  /** Controlled value pair as ISO strings. Use empty strings for cleared. */
  value?: DateRangePickerValue;
  /** Uncontrolled default. */
  defaultValue?: DateRangePickerValue;
  /** Placeholders for the start/end fields inside the trigger. */
  startPlaceholder?: string;
  endPlaceholder?: string;
  /** Visual state. */
  state?: DateRangePickerState;
  /** Validation status. */
  validation?: DateRangePickerValidation;
  /** Helper text below the field. */
  helperText?: string;
  /** Display format. Default 'DD MMM YYYY'. */
  format?: string;
  /** Show time picker on both ends. */
  showTime?: boolean;
  /**
   * Quick-pick preset chips below the calendar (Today / Yesterday /
   * Last 7 Days / Last 30 Days / This Month / Last Month). Pass `false`
   * to hide. Pass an array to override with custom presets.
   */
  presets?: boolean | DateRangePreset[];
  /** Called with the new range — empty strings if cleared. */
  onChange?: (value: DateRangePickerValue) => void;
  /** HTML id forwarded to the antd input. */
  id?: string;
  className?: string;
}

const today = () => dayjs().startOf('day');

const defaultPresets: DateRangePreset[] = [
  { label: 'Today', value: { start: today().format('YYYY-MM-DD'), end: today().format('YYYY-MM-DD') } },
  { label: 'Yesterday', value: { start: today().subtract(1, 'day').format('YYYY-MM-DD'), end: today().subtract(1, 'day').format('YYYY-MM-DD') } },
  { label: 'Last 7 Days', value: { start: today().subtract(6, 'day').format('YYYY-MM-DD'), end: today().format('YYYY-MM-DD') } },
  { label: 'Last 30 Days', value: { start: today().subtract(29, 'day').format('YYYY-MM-DD'), end: today().format('YYYY-MM-DD') } },
  { label: 'This Month', value: { start: today().startOf('month').format('YYYY-MM-DD'), end: today().endOf('month').format('YYYY-MM-DD') } },
  { label: 'Last Month', value: { start: today().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'), end: today().subtract(1, 'month').endOf('month').format('YYYY-MM-DD') } },
];

const isoToDayjs = (iso: string | undefined): Dayjs | null => {
  if (!iso) return null;
  const d = dayjs(iso);
  return d.isValid() ? d : null;
};

/**
 * DateRangePicker — Figma: Form Value / Type=Date Range Picker (1960:9867).
 *
 * Wraps Ant Design's DatePicker.RangePicker. The trigger field shows
 * two values separated by a horizontal minus icon (matches Figma); the
 * popover shows two months side-by-side with a presets bar at the
 * bottom (Today / Yesterday / Last 7/30 Days / This/Last Month).
 *
 * Values round-trip as `{ start, end }` ISO date strings.
 *
 * Wrap your app root with <AntdThemeProvider> for the SiteGiant blue
 * primary in the calendar popover.
 */
export const DateRangePicker = ({
  value,
  defaultValue,
  startPlaceholder = 'Start Date',
  endPlaceholder = 'End Date',
  state = 'default',
  validation = 'default',
  helperText,
  format = 'DD MMM YYYY',
  showTime = false,
  presets = true,
  onChange,
  id,
  className = '',
}: DateRangePickerProps) => {
  const isDisabled = state === 'disabled';
  const isReadonly = state === 'readonly' || state === 'readonly-bold';
  const isReadonlyBold = state === 'readonly-bold';
  const isError = validation === 'error' && !isDisabled && !isReadonly;
  const isSuccess = validation === 'success' && !isDisabled && !isReadonly;

  const displayFormat = format ?? (showTime ? 'DD MMM YYYY HH:mm' : 'DD MMM YYYY');
  const isoFormat = showTime ? 'YYYY-MM-DDTHH:mm:ss' : 'YYYY-MM-DD';

  const dayjsValue = useMemo<[Dayjs | null, Dayjs | null] | undefined>(() => {
    if (value === undefined) return undefined;
    return [isoToDayjs(value.start), isoToDayjs(value.end)];
  }, [value]);

  const dayjsDefault = useMemo<[Dayjs | null, Dayjs | null] | undefined>(() => {
    if (defaultValue === undefined) return undefined;
    return [isoToDayjs(defaultValue.start), isoToDayjs(defaultValue.end)];
  }, [defaultValue]);

  const antdPresets = useMemo(() => {
    if (presets === false) return undefined;
    const list = Array.isArray(presets) ? presets : defaultPresets;
    return list.map((p) => ({
      label: p.label,
      value: [isoToDayjs(p.value.start), isoToDayjs(p.value.end)] as [Dayjs, Dayjs],
    }));
  }, [presets]);

  // Readonly variants render plain text "start — end" sized to content.
  if (isReadonly) {
    const startText = dayjsValue?.[0]?.format(displayFormat) ?? dayjsDefault?.[0]?.format(displayFormat) ?? '';
    const endText = dayjsValue?.[1]?.format(displayFormat) ?? dayjsDefault?.[1]?.format(displayFormat) ?? '';
    return (
      <div className={['flex flex-col gap-[var(--spacing-4)] w-full', className].filter(Boolean).join(' ')}>
        <span
          aria-readonly="true"
          className={[
            'inline-flex items-center gap-[var(--spacing-6)] py-[var(--spacing-6)] w-fit',
            'text-[length:var(--text-14)] leading-[var(--leading-21)]',
            'font-[family-name:var(--general-font-family)]',
            isReadonlyBold ? 'font-[var(--font-weight-bold)]' : 'font-[var(--font-weight-regular)]',
            'text-[color:var(--form-input-value-text)]',
            'whitespace-nowrap',
          ].join(' ')}
        >
          <span>{startText}</span>
          <Icon
            name="minus"
            size={17}
            aria-hidden="true"
            className="text-[color:var(--color-icon-secondary)] shrink-0"
          />
          <span>{endText}</span>
        </span>
        {helperText && (
          <span
            className={[
              'font-[family-name:var(--general-font-family)]',
              'text-[length:var(--general-caption-size)]',
              'leading-[var(--general-caption-lineheight)]',
              'font-[var(--font-weight-regular)]',
              'text-[color:var(--color-text-info)]',
            ].join(' ')}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }

  const helperColor = isError
    ? 'text-[color:var(--color-sys-red-DEFAULT)]'
    : 'text-[color:var(--color-text-info)]';

  return (
    <div className={['flex flex-col gap-[var(--spacing-4)] w-full', className].filter(Boolean).join(' ')}>
      <div className="flex items-center gap-[var(--spacing-8)] w-full">
        <RangePicker
          id={id}
          value={dayjsValue}
          defaultValue={dayjsDefault}
          placeholder={[startPlaceholder, endPlaceholder]}
          format={displayFormat}
          showTime={showTime}
          disabled={isDisabled}
          status={isError ? 'error' : undefined}
          allowClear
          presets={antdPresets}
          separator={
            <Icon
              name="minus"
              size={17}
              aria-hidden="true"
              className="text-[color:var(--color-icon-secondary)]"
            />
          }
          className="w-full"
          onChange={(range) => {
            const [start, end] = range ?? [null, null];
            onChange?.({
              start: start && start.isValid() ? start.format(isoFormat) : '',
              end: end && end.isValid() ? end.format(isoFormat) : '',
            });
          }}
        />
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
            'font-[family-name:var(--general-font-family)]',
            'text-[length:var(--general-caption-size)]',
            'leading-[var(--general-caption-lineheight)]',
            'font-[var(--font-weight-regular)]',
            helperColor,
          ].join(' ')}
        >
          {helperText}
        </span>
      )}
    </div>
  );
};
