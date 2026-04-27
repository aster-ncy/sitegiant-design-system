import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TagSelect } from './TagSelect';
import type { TagSelectOption } from './TagSelect';

const sampleOptions: TagSelectOption[] = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'home', label: 'Home & Living' },
  { value: 'sports', label: 'Sports & Outdoors' },
  { value: 'beauty', label: 'Beauty & Health' },
  { value: 'toys', label: 'Toys & Games' },
];

const longOptions: TagSelectOption[] = Array.from({ length: 30 }, (_, i) => ({
  value: `opt-${i + 1}`,
  label: `Option ${i + 1}`,
}));

const longLabelOptions: TagSelectOption[] = [
  { value: 'a', label: 'This is an extremely long category label that should truncate inside the chip with ellipsis' },
  { value: 'b', label: 'Short' },
];

const meta = {
  title: 'Forms/TagSelect',
  component: TagSelect,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    options: sampleOptions,
    placeholder: 'Select',
  },
  argTypes: {
    state: { control: 'select', options: ['default', 'disabled', 'readonly'] },
    validation: { control: 'select', options: ['default', 'error', 'success'] },
    creatable: { control: 'boolean' },
    onChange: { action: 'changed' },
    onCreate: { action: 'created' },
  },
} satisfies Meta<typeof TagSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: { defaultValue: 'fashion' },
};

export const Disabled: Story = {
  args: { state: 'disabled', defaultValue: 'fashion' },
};

export const Readonly: Story = {
  args: { state: 'readonly', defaultValue: 'fashion' },
};

export const Error: Story = {
  args: {
    validation: 'error',
    helperText: 'Please select a category.',
  },
};

export const Success: Story = {
  args: {
    defaultValue: 'fashion',
    validation: 'success',
    helperText: 'Looks good.',
  },
};

export const Creatable: Story = {
  args: { creatable: true },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div className="flex flex-col gap-[var(--spacing-12)]">
        <TagSelect {...args} value={value} onChange={setValue} />
        <div className="text-[length:var(--text-14)] text-[color:var(--color-text-info)]">
          Selected: {value || '(none)'}
        </div>
      </div>
    );
  },
};

export const LongList: Story = {
  args: { options: longOptions },
};

export const LongLabels: Story = {
  args: { options: longLabelOptions, defaultValue: 'a' },
};
