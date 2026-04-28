import { Fragment, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker, type DatePickerState, type DatePickerValidation } from './DatePicker';

const meta = {
  title: 'Forms/DatePicker',
  component: DatePicker,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'disabled', 'readonly', 'readonly-bold'] satisfies DatePickerState[],
    },
    validation: {
      control: 'inline-radio',
      options: ['default', 'error', 'success'] satisfies DatePickerValidation[],
    },
    showTime: { control: 'boolean' },
    format: { control: 'text' },
  },
  args: {
    placeholder: 'Select date',
  },
  decorators: [
    (Story) => (
      <div className="w-[328px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { helperText: 'Hint text' } };

export const Filled: Story = {
  args: { defaultValue: '2025-05-12', helperText: 'Hint text' },
};

export const WithTime: Story = {
  args: {
    showTime: true,
    defaultValue: '2025-05-12T14:30:00',
    helperText: 'Date + time picker',
  },
};

export const Error: Story = {
  args: {
    defaultValue: '2025-05-12',
    validation: 'error',
    helperText: 'Date is in the past.',
  },
};

export const Success: Story = {
  args: {
    defaultValue: '2025-12-25',
    validation: 'success',
    helperText: 'Looks good.',
  },
};

export const Disabled: Story = {
  args: {
    state: 'disabled',
    defaultValue: '2025-05-12',
  },
};

export const Readonly: Story = {
  args: {
    state: 'readonly',
    defaultValue: '2025-05-12',
    helperText: 'Hint text',
  },
};

export const ReadonlyBold: Story = {
  args: {
    state: 'readonly-bold',
    defaultValue: '2025-05-12',
    helperText: 'Hint text',
  },
};

/* ── Full state × validation matrix ────────────────────── */

const validations: DatePickerValidation[] = ['default', 'error', 'success'];
type MatrixRow = { label: string; state: DatePickerState; defaultValue?: string };
const rows: MatrixRow[] = [
  { label: 'default', state: 'default' },
  { label: 'filled', state: 'default', defaultValue: '2025-05-12' },
  { label: 'disabled', state: 'disabled', defaultValue: '2025-05-12' },
  { label: 'readonly', state: 'readonly', defaultValue: '2025-05-12' },
  { label: 'readonly-bold', state: 'readonly-bold', defaultValue: '2025-05-12' },
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
            <DatePicker
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
  const [date, setDate] = useState('');
  return (
    <div className="flex flex-col gap-[var(--spacing-12)]">
      <DatePicker
        value={date}
        onChange={setDate}
        helperText={date ? `Selected: ${date}` : 'Pick a date'}
      />
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};

export const Slim: Story = {
  args: {
    size: 'slim',
    placeholder: 'Select date',
  },
};
