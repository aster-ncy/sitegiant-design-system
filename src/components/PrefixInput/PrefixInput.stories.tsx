import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { PrefixInput } from './PrefixInput';

const meta: Meta<typeof PrefixInput> = {
  title: 'Form/PrefixInput',
  component: PrefixInput,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'disabled', 'readonly', 'readonly-bold'],
    },
    validation: {
      control: 'select',
      options: ['default', 'error', 'success'],
    },
    size: {
      control: 'select',
      options: ['default', 'slim'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof PrefixInput>;

const currencyOptions = [
  { value: 'RM', label: 'RM - Malaysia' },
  { value: 'SGD', label: 'SGD - Singapore' },
  { value: 'USD', label: 'USD - United States' },
  { value: 'TWD', label: 'TWD - Taiwan' },
];

export const Default: Story = {
  args: {
    prefix: 'RM',
    placeholder: '0.00',
  },
};

export const Filled: Story = {
  args: {
    prefix: 'RM',
    value: '128.50',
  },
};

export const Error: Story = {
  args: {
    prefix: 'RM',
    value: '0',
    validation: 'error',
    helperText: 'Amount must be greater than 0',
  },
};

export const Success: Story = {
  args: {
    prefix: 'RM',
    value: '99.90',
    validation: 'success',
  },
};

export const Disabled: Story = {
  args: {
    prefix: 'RM',
    value: '50.00',
    state: 'disabled',
  },
};

export const Readonly: Story = {
  args: {
    prefix: 'RM',
    value: '250.00',
    state: 'readonly',
  },
};

export const ReadonlyBold: Story = {
  args: {
    prefix: 'RM',
    value: '250.00',
    state: 'readonly-bold',
  },
};

export const Slim: Story = {
  args: {
    prefix: 'RM',
    placeholder: '0.00',
    size: 'slim',
  },
};

export const SlimFilled: Story = {
  args: {
    prefix: 'SGD',
    value: '1200.00',
    size: 'slim',
  },
};

export const SGD: Story = {
  args: {
    prefix: 'SGD',
    placeholder: '0.00',
  },
};

export const USD: Story = {
  args: {
    prefix: 'USD',
    placeholder: '0.00',
  },
};

export const TWD: Story = {
  args: {
    prefix: 'TWD',
    placeholder: '0',
  },
};

export const WithDropdown: Story = {
  render: () => {
    const [currency, setCurrency] = useState('RM');
    const [val, setVal] = useState('');
    return (
      <PrefixInput
        prefix={currency}
        prefixOptions={currencyOptions}
        onPrefixChange={setCurrency}
        value={val}
        placeholder="0.00"
        onChange={setVal}
      />
    );
  },
};

export const WithDropdownFilled: Story = {
  render: () => {
    const [currency, setCurrency] = useState('SGD');
    const [val, setVal] = useState('1200.00');
    return (
      <PrefixInput
        prefix={currency}
        prefixOptions={currencyOptions}
        onPrefixChange={setCurrency}
        value={val}
        placeholder="0.00"
        onChange={setVal}
      />
    );
  },
};

export const WithDropdownDisabled: Story = {
  args: {
    prefix: 'RM',
    value: '50.00',
    prefixOptions: currencyOptions,
    state: 'disabled',
  },
};

export const WithHelperText: Story = {
  args: {
    prefix: 'RM',
    placeholder: '0.00',
    helperText: 'Enter the product price',
  },
};

export const Controlled: Story = {
  render: () => {
    const [val, setVal] = useState('');
    return (
      <div className="flex flex-col gap-[var(--spacing-8)]">
        <PrefixInput
          prefix="RM"
          value={val}
          placeholder="0.00"
          onChange={setVal}
        />
        <span className="text-[length:var(--text-12)] text-[color:var(--color-text-secondary)]">
          Value: "{val}"
        </span>
      </div>
    );
  },
};

export const FullMatrix: Story = {
  render: () => {
    const [currency, setCurrency] = useState('RM');
    return (
      <div className="flex flex-col gap-[var(--spacing-16)]" style={{ width: 400 }}>
        <PrefixInput prefix="RM" placeholder="0.00" />
        <PrefixInput prefix="RM" value="128.50" />
        <PrefixInput prefix="RM" value="0" validation="error" helperText="Amount is required" />
        <PrefixInput prefix="RM" value="99.90" validation="success" />
        <PrefixInput prefix="RM" value="50.00" state="disabled" />
        <PrefixInput prefix="RM" value="250.00" state="readonly" />
        <PrefixInput prefix="RM" value="250.00" state="readonly-bold" />
        <PrefixInput prefix="RM" placeholder="0.00" size="slim" />
        <PrefixInput prefix="RM" value="128.50" size="slim" />
        <PrefixInput
          prefix={currency}
          prefixOptions={currencyOptions}
          onPrefixChange={setCurrency}
          placeholder="0.00"
        />
      </div>
    );
  },
};
