import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { OTP, type OTPState, type OTPValidation } from './OTP';

const meta = {
  title: 'Forms/OTP',
  component: OTP,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'disabled', 'readonly', 'readonly-bold'] satisfies OTPState[],
    },
    validation: {
      control: 'inline-radio',
      options: ['default', 'error', 'success'] satisfies OTPValidation[],
    },
    length: {
      control: 'number',
    },
  },
  args: {
    length: 6,
    helperText: 'Hint text',
  },
} satisfies Meta<typeof OTP>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: { defaultValue: '123456' },
};

export const PartiallyFilled: Story = {
  args: { defaultValue: '123' },
};

export const Error: Story = {
  args: { validation: 'error', defaultValue: '123456' },
};

export const Success: Story = {
  args: { validation: 'success', defaultValue: '123456' },
};

export const Disabled: Story = {
  args: { state: 'disabled', defaultValue: '123456' },
};

export const Readonly: Story = {
  args: { state: 'readonly', defaultValue: '123456' },
};

export const ReadonlyBold: Story = {
  args: { state: 'readonly-bold', defaultValue: '123456' },
};

export const FourDigit: Story = {
  args: { length: 4 },
};

export const Interactive: Story = {
  render: (args) => {
    const [val, setVal] = useState('');
    const [completed, setCompleted] = useState<string | null>(null);
    return (
      <div className="flex flex-col gap-[var(--spacing-12)]">
        <OTP
          {...args}
          value={val}
          onChange={setVal}
          onComplete={(v) => setCompleted(v)}
          autoFocus
        />
        <p className="text-[length:var(--text-12)] text-[color:var(--form-label-info-text)]">
          Current: {val || <em>—</em>}
        </p>
        {completed && (
          <p className="text-[length:var(--text-12)] text-[color:var(--color-sys-green-DEFAULT)]">
            ✓ Code complete: {completed}
          </p>
        )}
      </div>
    );
  },
};
