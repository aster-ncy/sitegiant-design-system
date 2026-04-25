import { Fragment, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NumberRange, type NumberRangeValue } from './NumberRange';
import type { NumberInputState, NumberInputValidation } from '../NumberInput';

const meta = {
  title: 'Forms/NumberRange',
  component: NumberRange,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'disabled', 'readonly', 'readonly-bold'] satisfies NumberInputState[],
    },
    validation: {
      control: 'inline-radio',
      options: ['default', 'error', 'success'] satisfies NumberInputValidation[],
    },
  },
  args: {
    minPlaceholder: 'Min.',
    maxPlaceholder: 'Max.',
  },
  decorators: [
    (Story) => (
      <div className="w-[328px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NumberRange>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { helperText: 'Hint text' },
};

export const Filled: Story = {
  args: {
    defaultValue: { min: '10', max: '300' },
    helperText: 'Hint text',
  },
};

export const Clamped: Story = {
  args: {
    min: 0,
    max: 1000,
    helperText: 'Range: 0–1000',
  },
};

export const PriceRange: Story = {
  args: {
    minPlaceholder: 'RM 0',
    maxPlaceholder: 'RM ∞',
    defaultValue: { min: '50', max: '500' },
    helperText: 'Filter by price.',
  },
};

export const Error: Story = {
  args: {
    defaultValue: { min: '500', max: '100' },
    validation: 'error',
    helperText: 'Min must be less than max.',
  },
};

export const Success: Story = {
  args: {
    defaultValue: { min: '10', max: '300' },
    validation: 'success',
    helperText: 'Range looks good.',
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: { min: '10', max: '300' },
    state: 'disabled',
  },
};

export const Readonly: Story = {
  args: {
    defaultValue: { min: '10', max: '300' },
    state: 'readonly',
  },
};

export const ReadonlyBold: Story = {
  args: {
    defaultValue: { min: '10', max: '300' },
    state: 'readonly-bold',
  },
};

/* ── Full state × validation matrix ────────────────────── */

const validations: NumberInputValidation[] = ['default', 'error', 'success'];

type MatrixRow = {
  label: string;
  state: NumberInputState;
  defaultValue?: NumberRangeValue;
};
const rows: MatrixRow[] = [
  { label: 'default', state: 'default' },
  { label: 'filled', state: 'default', defaultValue: { min: '10', max: '300' } },
  { label: 'disabled', state: 'disabled', defaultValue: { min: '10', max: '300' } },
  { label: 'readonly', state: 'readonly', defaultValue: { min: '10', max: '300' } },
  { label: 'readonly-bold', state: 'readonly-bold', defaultValue: { min: '10', max: '300' } },
];

export const FullMatrix: Story = {
  args: {},
  decorators: [(Story) => <div className="w-[1100px]"><Story /></div>],
  render: () => (
    <div className="grid grid-cols-[140px_repeat(3,_minmax(0,_1fr))] gap-x-[var(--spacing-16)] gap-y-[var(--spacing-20)]">
      <span />
      {validations.map((v) => (
        <span
          key={v}
          className="text-[length:var(--text-12)] font-[var(--font-weight-medium)] text-[color:var(--color-text-info)]"
        >
          validation = {v}
        </span>
      ))}
      {rows.map((row) => (
        <Fragment key={row.label}>
          <span className="text-[length:var(--text-12)] font-[var(--font-weight-medium)] text-[color:var(--color-text-info)] self-center">
            state = {row.label}
          </span>
          {validations.map((v) => (
            <NumberRange
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
  const [range, setRange] = useState<NumberRangeValue>({ min: '', max: '' });
  const minN = range.min === '' ? null : Number(range.min);
  const maxN = range.max === '' ? null : Number(range.max);
  const invalid = minN != null && maxN != null && minN > maxN;
  return (
    <div className="flex flex-col gap-[var(--spacing-12)]">
      <NumberRange
        value={range}
        onChange={setRange}
        validation={invalid ? 'error' : 'default'}
        helperText={invalid ? 'Min must be ≤ max.' : `Selected: ${range.min || '–'} ~ ${range.max || '–'}`}
      />
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};
