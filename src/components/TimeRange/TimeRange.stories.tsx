import { Fragment, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimeRange, type TimeRangeValue, type TimeRangeState, type TimeRangeValidation, type TimeRangeType } from './TimeRange';

const meta = {
  title: 'Forms/TimeRange',
  component: TimeRange,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['default', 'single'] satisfies TimeRangeType[],
    },
    state: {
      control: 'select',
      options: ['default', 'disabled', 'readonly', 'readonly-bold'] satisfies TimeRangeState[],
    },
    validation: {
      control: 'inline-radio',
      options: ['default', 'error', 'success', 'warning'] satisfies TimeRangeValidation[],
    },
    size: {
      control: 'inline-radio',
      options: ['default', 'slim'],
    },
  },
  args: {
    label: 'Label',
    helperText: 'Hint text',
  },
} satisfies Meta<typeof TimeRange>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: { defaultValue: { start: '09:00', end: '17:30' } },
};

export const Focus: Story = {
  args: { defaultValue: { start: '09:00', end: '17:30' } },
  render: (args) => (
    <TimeRange {...args} inputRef={(el) => el?.focus()} />
  ),
};

export const Disabled: Story = {
  args: { state: 'disabled', defaultValue: { start: '09:00', end: '17:30' } },
};

export const Readonly: Story = {
  args: { state: 'readonly', defaultValue: { start: '09:00', end: '17:30' } },
};

export const ReadonlyBold: Story = {
  args: { state: 'readonly-bold', defaultValue: { start: '09:00', end: '17:30' } },
};

export const Error: Story = {
  args: { validation: 'error', defaultValue: { start: '09:00', end: '17:30' } },
};

export const Success: Story = {
  args: { validation: 'success', defaultValue: { start: '09:00', end: '17:30' } },
};

export const Warning: Story = {
  args: { validation: 'warning', defaultValue: { start: '09:00', end: '17:30' } },
};

export const Single: Story = {
  args: { type: 'single', defaultValue: { start: '09:00', end: '' } },
};

export const SingleError: Story = {
  args: { type: 'single', validation: 'error', defaultValue: { start: '09:00', end: '' } },
};

export const Slim: Story = {
  args: { size: 'slim', defaultValue: { start: '09:00', end: '17:30' } },
};

export const Interactive: Story = {
  render: (args) => {
    const [val, setVal] = useState<TimeRangeValue>({ start: '09:00', end: '17:00' });
    return (
      <div className="flex flex-col gap-[var(--spacing-8)]">
        <TimeRange {...args} value={val} onChange={setVal} />
        <p className="text-[length:var(--text-12)] text-[color:var(--form-label-info-text)]">
          {val.start || <em>—</em>} → {val.end || <em>—</em>}
        </p>
      </div>
    );
  },
};

/* ── Composite: full Figma matrix ────────────────────── */

const states: { label: string; state: TimeRangeState }[] = [
  { label: 'Default', state: 'default' },
  { label: 'Filled', state: 'default' },
  { label: 'Focus', state: 'default' },
  { label: 'Disabled', state: 'disabled' },
  { label: 'Readonly', state: 'readonly' },
];
const validations: TimeRangeValidation[] = ['default', 'error', 'success', 'warning'];

export const AllStates: Story = {
  render: () => (
    <div className="grid grid-cols-[repeat(5,auto)] gap-[var(--spacing-16)] items-start">
      <div />
      {validations.map((v) => (
        <span
          key={v}
          className="text-[length:var(--text-12)] font-[var(--font-weight-medium)] capitalize text-[color:var(--form-label-info-text)]"
        >
          {v === 'default' ? 'None' : v}
        </span>
      ))}
      {states.map((row, i) => (
        <Fragment key={`${row.label}-${i}`}>
          <span className="text-[length:var(--text-12)] font-[var(--font-weight-medium)] text-[color:var(--form-label-info-text)] self-center">
            {row.label}
          </span>
          {validations.map((v) => (
            <TimeRange
              key={`${row.label}-${v}`}
              label="Label"
              helperText="Hint text"
              state={row.state}
              validation={v}
              defaultValue={row.label === 'Default' ? { start: '', end: '' } : { start: '09:00', end: '17:30' }}
            />
          ))}
        </Fragment>
      ))}
    </div>
  ),
};
