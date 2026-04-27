import { useMemo } from 'react';
import { DatePicker as AntDatePicker } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { Icon } from '../Icon';

export type DatePickerState = 'default' | 'disabled' | 'readonly' | 'readonly-bold';
export type DatePickerValidation = 'default' | 'error' | 'success';

export interface DatePickerProps {
  /** Controlled value as ISO date string ('YYYY-MM-DD') or '' for empty. */
  value?: string;
  /** Uncontrolled default value. */
  defaultValue?: string;
  /** Placeholder when empty. */
  placeholder?: string;
  /** Visual state. */
  state?: DatePickerState;
  /** Validation status — drives border color + helperText color. */
  validation?: DatePickerValidation;
  /** Helper text shown below the field. */
  helperText?: string;
  /** Display format. Default 'DD-MM-YYYY' (matches live SiteGiant ERP). */
  format?: string;
  /** Show time picker columns and an Ok confirmation button. */
  showTime?: boolean;
  /** Called with the new ISO string ('YYYY-MM-DD' or '' when cleared). */
  onChange?: (isoValue: string) => void;
  /** HTML id forwarded to the antd input. */
  id?: string;
  /** Name attribute. */
  name?: string;
  className?: string;
}

/**
 * DatePicker — Figma: Form Value / Type=Date Picker (1966:18481).
 *
 * Wraps Ant Design's DatePicker with a focused API matching the rest of
 * the SiteGiant form components (state, validation, helperText). Values
 * round-trip as ISO date strings ('YYYY-MM-DD' for date-only,
 * 'YYYY-MM-DDTHH:mm:ss' for date+time) so consumers don't have to think
 * about Day.js objects unless they want to.
 *
 * Pass `showTime` to render the date+time variant (calendar + HH:MM:SS
 * scroll columns + Ok button — see the second screenshot Aster shared).
 *
 * Wrap your app root with <AntdThemeProvider> so antd's calendar popover
 * picks up SiteGiant's primary color (--color-sys-blue-DEFAULT) and
 * spacing tokens. Storybook applies it globally via .storybook/preview.tsx.
 */
export const DatePicker = ({
  value,
  defaultValue,
  placeholder,
  state = 'default',
  validation = 'default',
  helperText,
  format,
  showTime = false,
  onChange,
  id,
  name,
  className = '',
}: DatePickerProps) => {
  const isDisabled = state === 'disabled';
  const isReadonly = state === 'readonly' || state === 'readonly-bold';
  const isReadonlyBold = state === 'readonly-bold';
  const isError = validation === 'error' && !isDisabled && !isReadonly;
  const isSuccess = validation === 'success' && !isDisabled && !isReadonly;

  // Display format matches live SiteGiant ERP: DD-MM-YYYY (+ HH:mm:ss when showTime).
  const displayFormat = format ?? (showTime ? 'DD-MM-YYYY HH:mm:ss' : 'DD-MM-YYYY');
  const isoFormat = showTime ? 'YYYY-MM-DDTHH:mm:ss' : 'YYYY-MM-DD';

  // Convert ISO string ↔ Dayjs for antd
  const dayjsValue = useMemo<Dayjs | undefined>(() => {
    if (value === undefined) return undefined;
    if (value === '') return null as unknown as Dayjs;
    const d = dayjs(value);
    return d.isValid() ? d : (null as unknown as Dayjs);
  }, [value]);

  const dayjsDefault = useMemo<Dayjs | undefined>(() => {
    if (defaultValue === undefined || defaultValue === '') return undefined;
    const d = dayjs(defaultValue);
    return d.isValid() ? d : undefined;
  }, [defaultValue]);

  // Readonly variants render plain text (no antd picker) so the field can sit
  // tight to neighbouring text without antd's input chrome.
  if (isReadonly) {
    const displayValue = dayjsValue?.isValid?.()
      ? dayjsValue.format(displayFormat)
      : dayjsDefault?.format?.(displayFormat) ?? '';
    return (
      <div className={['flex flex-col gap-[var(--spacing-4)] w-full', className].filter(Boolean).join(' ')}>
        <span
          aria-readonly="true"
          className={[
            'inline-flex items-center py-[var(--spacing-6)] w-fit',
            'text-[length:var(--text-14)] leading-[var(--leading-21)]',
            'font-[family-name:var(--general-font-family)]',
            isReadonlyBold ? 'font-[var(--font-weight-bold)]' : 'font-[var(--font-weight-regular)]',
            'text-[color:var(--form-input-value-text)]',
            'whitespace-nowrap',
          ].join(' ')}
        >
          {displayValue}
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
        <AntDatePicker
          id={id}
          name={name}
          value={dayjsValue}
          defaultValue={dayjsDefault}
          placeholder={placeholder ?? 'Select date'}
          format={displayFormat}
          showTime={showTime ? { format: 'HH:mm:ss' } : false}
          disabled={isDisabled}
          status={isError ? 'error' : undefined}
          allowClear
          className="w-full"
          onChange={(d) => {
            const next = d && (d as Dayjs).isValid?.() ? (d as Dayjs).format(isoFormat) : '';
            onChange?.(next);
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
