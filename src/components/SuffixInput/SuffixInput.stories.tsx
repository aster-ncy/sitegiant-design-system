import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SuffixInput, type SuffixInputState, type SuffixInputValidation } from './SuffixInput';

const meta = {
  title: 'Forms/SuffixInput',
  component: SuffixInput,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'disabled', 'readonly', 'readonly-bold'] satisfies SuffixInputState[],
    },
    validation: {
      control: 'inline-radio',
      options: ['default', 'error', 'success', 'warning'] satisfies SuffixInputValidation[],
    },
    size: {
      control: 'inline-radio',
      options: ['default', 'slim'],
    },
  },
  args: {
    suffix: 'kg',
    placeholder: '0.00',
    helperText: 'Hint text',
  },
} satisfies Meta<typeof SuffixInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: { defaultValue: '12.5' },
};

export const Focus: Story = {
  args: { defaultValue: '12.5' },
  render: (args) => (
    <SuffixInput {...args} inputRef={(el) => el?.focus()} />
  ),
};

export const Error: Story = {
  args: { validation: 'error', defaultValue: '12.5' },
};

export const Success: Story = {
  args: { validation: 'success', defaultValue: '12.5' },
};

export const Warning: Story = {
  args: { validation: 'warning', defaultValue: '12.5' },
};

export const Disabled: Story = {
  args: { state: 'disabled', defaultValue: '12.5' },
};

export const Readonly: Story = {
  args: { state: 'readonly', defaultValue: '12.5' },
};

export const ReadonlyBold: Story = {
  args: { state: 'readonly-bold', defaultValue: '12.5' },
};

export const Slim: Story = {
  args: { size: 'slim', defaultValue: '12.5' },
};

export const SuffixUnits: Story = {
  render: (args) => (
    <div className="flex flex-col gap-[var(--spacing-12)] items-start">
      <SuffixInput {...args} suffix="kg" defaultValue="2.5" />
      <SuffixInput {...args} suffix="USD" defaultValue="100.00" />
      <SuffixInput {...args} suffix="%" defaultValue="50" />
      <SuffixInput {...args} suffix="cm" defaultValue="175" />
    </div>
  ),
};

export const Interactive: Story = {
  render: (args) => {
    const [val, setVal] = useState('12.5');
    return (
      <div className="flex flex-col gap-[var(--spacing-8)]">
        <SuffixInput {...args} value={val} onChange={setVal} />
        <p className="text-[length:var(--text-12)] text-[color:var(--form-label-info-text)]">
          Current: {val || <em>—</em>} {val && args.suffix}
        </p>
      </div>
    );
  },
};
