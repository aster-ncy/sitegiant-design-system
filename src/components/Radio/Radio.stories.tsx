import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio, RadioGroup } from './Radio';
import { useState } from 'react';

/* ── Single Radio stories ──────────────────────────────── */

const radioMeta = {
  title: 'Components/Radio',
  component: Radio,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    helperText: { control: 'text' },
  },
} satisfies Meta<typeof Radio>;

export default radioMeta;
type Story = StoryObj<typeof radioMeta>;

export const Default: Story = {
  args: { value: 'opt1', label: 'Option 1' },
};

export const Selected: Story = {
  args: { value: 'opt1', label: 'Selected option', selected: true },
};

export const WithHelperText: Story = {
  args: { value: 'opt1', label: 'Premium Plan', helperText: 'Includes all features and priority support' },
};

export const DisabledUnselected: Story = {
  args: { value: 'opt1', label: 'Disabled option', disabled: true },
};

export const DisabledSelected: Story = {
  args: { value: 'opt1', label: 'Disabled selected', selected: true, disabled: true },
};

/* ── All States ────────────────────────────────────────── */

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-16)]">
      <p className="text-[length:var(--text-14)] font-[var(--font-weight-semibold)] text-[color:var(--color-text-primary)]">
        All Radio States
      </p>
      <div className="flex flex-col gap-[var(--spacing-12)]">
        <Radio value="1" label="Unselected (default)" />
        <Radio value="2" label="Selected" selected />
        <Radio value="3" label="With helper text" helperText="Helper text is shown below" />
        <Radio value="4" label="Disabled unselected" disabled />
        <Radio value="5" label="Disabled selected" selected disabled />
      </div>
    </div>
  ),
};

/* ── Radio Group ───────────────────────────────────────── */

const VerticalGroupDemo = () => {
  const [value, setValue] = useState('monthly');
  return (
    <div className="flex flex-col gap-[var(--spacing-12)]">
      <p className="text-[length:var(--text-14)] font-[var(--font-weight-semibold)] text-[color:var(--color-text-primary)]">
        Billing Cycle
      </p>
      <RadioGroup
        name="billing"
        value={value}
        onChange={setValue}
        options={[
          { value: 'monthly', label: 'Monthly', helperText: 'RM 99/month' },
          { value: 'quarterly', label: 'Quarterly', helperText: 'RM 269/quarter (save 10%)' },
          { value: 'yearly', label: 'Yearly', helperText: 'RM 999/year (save 16%)' },
        ]}
      />
      <p className="text-[length:var(--text-12)] text-[color:var(--form-label-info-text)]">
        Selected: {value}
      </p>
    </div>
  );
};

export const GroupVertical: Story = {
  render: () => <VerticalGroupDemo />,
};

/* ── Horizontal Group ──────────────────────────────────── */

const HorizontalGroupDemo = () => {
  const [value, setValue] = useState('sm');
  return (
    <div className="flex flex-col gap-[var(--spacing-12)]">
      <p className="text-[length:var(--text-14)] font-[var(--font-weight-semibold)] text-[color:var(--color-text-primary)]">
        Size
      </p>
      <RadioGroup
        name="size"
        value={value}
        onChange={setValue}
        direction="horizontal"
        options={[
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
          { value: 'xl', label: 'Extra Large' },
        ]}
      />
    </div>
  );
};

export const GroupHorizontal: Story = {
  render: () => <HorizontalGroupDemo />,
};

/* ── With Disabled Options ─────────────────────────────── */

const MixedDisabledDemo = () => {
  const [value, setValue] = useState('standard');
  return (
    <RadioGroup
      name="shipping"
      value={value}
      onChange={setValue}
      options={[
        { value: 'standard', label: 'Standard Shipping', helperText: '5-7 business days' },
        { value: 'express', label: 'Express Shipping', helperText: '2-3 business days' },
        { value: 'overnight', label: 'Overnight Shipping', helperText: 'Currently unavailable', disabled: true },
      ]}
    />
  );
};

export const WithDisabledOptions: Story = {
  render: () => <MixedDisabledDemo />,
};
