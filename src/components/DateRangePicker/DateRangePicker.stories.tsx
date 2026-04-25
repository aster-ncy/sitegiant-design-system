import { Fragment, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DateRangePicker,
  type DateRangePickerState,
  type DateRangePickerValidation,
  type DateRangePickerValue,
} from './DateRangePicker';

const meta = {
  title: 'Forms/DateRangePicker',
  component: DateRangePicker,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'disabled', 'readonly', 'readonly-bold'] satisfies DateRangePickerState[],
    },
    validation: {
      control: 'inline-radio',
      options: ['default', 'error', 'success'] satisfies DateRangePickerValidation[],
    },
    showTime: { control: 'boolean' },
    presets: { control: 'boolean' },
  },
  args: {},
  decorators: [
    (Story) => (
      <div className="w-[328px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { helperText: 'Hint text' } };

export const Filled: Story = {
  args: {
    defaultValue: { start: '2025-04-01', end: '2025-04-30' },
    helperText: 'Hint text',
  },
};

export const WithTime: Story = {
  args: {
    showTime: true,
    defaultValue: { start: '2025-05-01T09:00:00', end: '2025-05-12T17:30:00' },
    helperText: 'Date + time range',
  },
};

export const NoPresets: Story = {
  args: {
    presets: false,
    helperText: 'Plain calendar with no preset bar',
  },
};

export const Error: Story = {
  args: {
    defaultValue: { start: '2025-05-12', end: '2025-05-01' },
    validation: 'error',
    helperText: 'End date must be after start date.',
  },
};

export const Success: Story = {
  args: {
    defaultValue: { start: '2025-05-01', end: '2025-05-31' },
    validation: 'success',
    helperText: 'Range looks good.',
  },
};

export const Disabled: Story = {
  args: {
    state: 'disabled',
    defaultValue: { start: '2025-05-01', end: '2025-05-31' },
  },
};

export const Readonly: Story = {
  args: {
    state: 'readonly',
    defaultValue: { start: '2025-05-01', end: '2025-05-31' },
    helperText: 'Hint text',
  },
};

export const ReadonlyBold: Story = {
  args: {
    state: 'readonly-bold',
    defaultValue: { start: '2025-05-01', end: '2025-05-31' },
    helperText: 'Hint text',
  },
};

/* ── Full state × validation matrix ────────────────────── */

const validations: DateRangePickerValidation[] = ['default', 'error', 'success'];
type MatrixRow = { label: string; state: DateRangePickerState; defaultValue?: DateRangePickerValue };
const rows: MatrixRow[] = [
  { label: 'default', state: 'default' },
  { label: 'filled', state: 'default', defaultValue: { start: '2025-05-01', end: '2025-05-31' } },
  { label: 'disabled', state: 'disabled', defaultValue: { start: '2025-05-01', end: '2025-05-31' } },
  { label: 'readonly', state: 'readonly', defaultValue: { start: '2025-05-01', end: '2025-05-31' } },
  { label: 'readonly-bold', state: 'readonly-bold', defaultValue: { start: '2025-05-01', end: '2025-05-31' } },
];

export const FullMatrix: Story = {
  args: {},
  decorators: [(Story) => <div className="w-[1100px]"><Story /></div>],
  render: () => (
    <div className="grid grid-cols-[140px_repeat(3,_minmax(0,_1fr))] gap-x-[var(--spacing-16)] gap-y-[var(--spacing-20)]">
      <span />
      {validations.map((v) => (
        <span key={v} className="text-[length:var(--text-12)] font-[var(--font-weight-medium)] text-[color:var(--color-text-info)]">
          validation = {v}
        </span>
      ))}
      {rows.map((row) => (
        <Fragment key={row.label}>
          <span className="text-[length:var(--text-12)] font-[var(--font-weight-medium)] text-[color:var(--color-text-info)] self-center">
            state = {row.label}
          </span>
          {validations.map((v) => (
            <DateRangePicker
              key={`${row.label}-${v}`}
              state={row.state}
              validation={v}
              defaultValue={row.defaultValue}
              helperText="Hint text"
            />
          ))}
        </Fragment>
      ))}
    </div>
  ),
};

/* ── Controlled example ────────────────────────────────── */

const ControlledExample = () => {
  const [range, setRange] = useState<DateRangePickerValue>({ start: '', end: '' });
  return (
    <div className="flex flex-col gap-[var(--spacing-12)]">
      <DateRangePicker
        value={range}
        onChange={setRange}
        helperText={
          range.start && range.end
            ? `Selected: ${range.start} to ${range.end}`
            : 'Pick a date range. Try a preset like Last 7 Days.'
        }
      />
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};
