import { Fragment, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Quantity, type QuantityValue, type QuantityState, type QuantityValidation, type QuantityType } from './Quantity';

const meta = {
  title: 'Forms/Quantity',
  component: Quantity,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['default', 'single'] satisfies QuantityType[],
    },
    state: {
      control: 'select',
      options: ['default', 'disabled', 'readonly', 'readonly-bold'] satisfies QuantityState[],
    },
    validation: {
      control: 'inline-radio',
      options: ['default', 'error', 'success', 'warning'] satisfies QuantityValidation[],
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
} satisfies Meta<typeof Quantity>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: { defaultValue: { current: '0', total: '1' } },
};

export const Focus: Story = {
  args: {
    defaultValue: { current: '0', total: '1' },
  },
  parameters: {
    pseudo: { focus: true },
  },
  render: (args) => (
    <Quantity
      {...args}
      // ref-driven autofocus so the focus ring is visible without
      // requiring the user to click into the field.
      inputRef={(el) => el?.focus()}
    />
  ),
};

export const Disabled: Story = {
  args: { state: 'disabled', defaultValue: { current: '0', total: '1' } },
};

export const Readonly: Story = {
  args: { state: 'readonly', defaultValue: { current: '0', total: '1' } },
};

export const ReadonlyBold: Story = {
  args: { state: 'readonly-bold', defaultValue: { current: '0', total: '1' } },
};

export const Error: Story = {
  args: {
    validation: 'error',
    defaultValue: { current: '0', total: '1' },
  },
};

export const Success: Story = {
  args: {
    validation: 'success',
    defaultValue: { current: '0', total: '1' },
  },
};

export const Warning: Story = {
  args: {
    validation: 'warning',
    defaultValue: { current: '0', total: '1' },
  },
};

export const Single: Story = {
  args: {
    type: 'single',
    defaultValue: { current: '0', total: '' },
  },
};

export const SingleError: Story = {
  args: {
    type: 'single',
    validation: 'error',
    defaultValue: { current: '0', total: '' },
  },
};

export const Slim: Story = {
  args: {
    size: 'slim',
    defaultValue: { current: '0', total: '1' },
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [val, setVal] = useState<QuantityValue>({ current: '3', total: '10' });
    return (
      <div className="flex flex-col gap-[var(--spacing-8)]">
        <Quantity {...args} value={val} onChange={setVal} />
        <p className="text-[length:var(--text-12)] text-[color:var(--form-label-info-text)]">
          Current: {val.current || <em>—</em>} / {val.total || <em>—</em>}
        </p>
      </div>
    );
  },
};

/* ── Composite: full Figma matrix ────────────────────── */

const states: { label: string; state: QuantityState }[] = [
  { label: 'Default', state: 'default' },
  { label: 'Filled', state: 'default' },
  { label: 'Focus', state: 'default' },
  { label: 'Disabled', state: 'disabled' },
  { label: 'Readonly', state: 'readonly' },
];
const validations: QuantityValidation[] = ['default', 'error', 'success', 'warning'];

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
            <Quantity
              key={`${row.label}-${v}`}
              label="Label"
              helperText="Hint text"
              state={row.state}
              validation={v}
              defaultValue={row.label === 'Default' ? { current: '', total: '' } : { current: '0', total: '1' }}
            />
          ))}
        </Fragment>
      ))}
    </div>
  ),
};
