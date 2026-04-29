import type { Meta, StoryObj } from '@storybook/react-vite';
import { NumberInput, type NumberInputState, type NumberInputValidation } from './NumberInput';

const meta = {
  title: 'Forms/NumberInput',
  component: NumberInput,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['default', 'stepper'],
    },
    state: {
      control: 'select',
      options: ['default', 'disabled', 'readonly', 'readonly-bold'] satisfies NumberInputState[],
    },
    validation: {
      control: 'inline-radio',
      options: ['default', 'error', 'success', 'warning'] satisfies NumberInputValidation[],
    },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
  },
  args: {
    placeholder: 'Quantity',
  },
  decorators: [
    (Story) => (
      <div className="w-[160px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { placeholder: 'Min.' } };

export const Filled: Story = { args: { defaultValue: '42' } };

export const Clamped: Story = {
  args: {
    defaultValue: '5',
    min: 0,
    max: 10,
  },
};

export const StepBy5: Story = {
  args: {
    defaultValue: '0',
    min: 0,
    max: 100,
    step: 5,
  },
};

export const Error: Story = {
  args: {
    defaultValue: '999',
    validation: 'error',
  },
};

export const Success: Story = {
  args: {
    defaultValue: '50',
    validation: 'success',
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: '42',
    state: 'disabled',
  },
};

export const Readonly: Story = {
  args: {
    defaultValue: '42',
    state: 'readonly',
  },
};

export const ReadonlyBold: Story = {
  args: {
    defaultValue: '42',
    state: 'readonly-bold',
  },
};

export const Slim: Story = {
  args: {
    placeholder: '0',
    size: 'slim',
  },
};

/* ── Stepper variant (horizontal − / + buttons) ──────── */

export const Stepper: Story = {
  args: {
    type: 'stepper',
    defaultValue: '1',
    min: 0,
    max: 99,
  },
};

export const StepperFocus: Story = {
  args: {
    type: 'stepper',
    defaultValue: '1',
  },
  render: (args) => (
    <NumberInput {...args} inputRef={(el) => el?.focus()} />
  ),
};

export const StepperError: Story = {
  args: {
    type: 'stepper',
    defaultValue: '1',
    validation: 'error',
  },
};

export const StepperWarning: Story = {
  args: {
    type: 'stepper',
    defaultValue: '1',
    validation: 'warning',
  },
};

export const StepperDisabled: Story = {
  args: {
    type: 'stepper',
    defaultValue: '1',
    state: 'disabled',
  },
};
