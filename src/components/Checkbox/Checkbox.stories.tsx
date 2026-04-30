import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';
import { useRef, useState } from 'react';
import { Button } from '../Button';

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    label: { control: 'text' },
    helperText: { control: 'text' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Default (unchecked) ───────────────────────────────── */

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
};

/* ── Checked ───────────────────────────────────────────── */

export const Checked: Story = {
  args: {
    checked: true,
    label: 'I agree to the privacy policy',
  },
};

/* ── Indeterminate ─────────────────────────────────────── */

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    label: 'Select all items',
  },
};

/* ── With Helper Text ──────────────────────────────────── */

export const WithHelperText: Story = {
  args: {
    label: 'Email notifications',
    helperText: 'Receive order updates via email',
  },
};

/* ── Disabled States ───────────────────────────────────── */

export const DisabledUnchecked: Story = {
  args: {
    disabled: true,
    label: 'Disabled option',
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
    label: 'Disabled selected',
  },
};

export const DisabledIndeterminate: Story = {
  args: {
    disabled: true,
    indeterminate: true,
    label: 'Disabled indeterminate',
  },
};

/* ── No Label (standalone) ─────────────────────────────── */

export const NoLabel: Story = {
  args: {
    checked: true,
  },
};

/* ── Sizes ─────────────────────────────────────────────── */

/**
 * Two box sizes: `md` (20×20, default — used in forms) and `sm` (17×17 —
 * used in table headers / rows to match the smaller checkbox Figma uses
 * inside table contexts, e.g. node 747:3744).
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-12)]">
      <Checkbox size="md" label="Medium (20×20) — forms" />
      <Checkbox size="sm" label="Small (17×17) — tables" />
      <Checkbox size="md" checked label="Medium checked" />
      <Checkbox size="sm" checked label="Small checked" />
    </div>
  ),
};

/* ── Interactive (controlled) ──────────────────────────── */

const ControlledCheckbox = () => {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      checked={checked}
      onChange={setChecked}
      label={checked ? 'Checked — click to uncheck' : 'Unchecked — click to check'}
    />
  );
};

export const Interactive: Story = {
  render: () => <ControlledCheckbox />,
};

/* ── All States Overview ───────────────────────────────── */

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-16)]">
      <p className="text-[length:var(--text-14)] font-[var(--font-weight-semibold)] text-[color:var(--color-text-primary)]">
        All Checkbox States
      </p>

      <div className="flex flex-col gap-[var(--spacing-12)]">
        <Checkbox label="Unchecked (default)" />
        <Checkbox checked label="Checked" />
        <Checkbox indeterminate label="Indeterminate" />
        <Checkbox label="With helper text" helperText="This is helper text shown below the label" />
        <Checkbox disabled label="Disabled unchecked" />
        <Checkbox disabled checked label="Disabled checked" />
        <Checkbox disabled indeterminate label="Disabled indeterminate" />
      </div>
    </div>
  ),
};

/* ── Checkbox Group ────────────────────────────────────── */

const CheckboxGroup = () => {
  const [selected, setSelected] = useState<string[]>(['option2']);
  const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

  const toggle = (option: string) => {
    setSelected((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option],
    );
  };

  const allChecked = selected.length === options.length;
  const someChecked = selected.length > 0 && !allChecked;

  return (
    <div className="flex flex-col gap-[var(--spacing-12)]">
      <Checkbox
        checked={allChecked}
        indeterminate={someChecked}
        onChange={() => setSelected(allChecked ? [] : [...options])}
        label="Select All"
      />
      <div className="flex flex-col gap-[var(--spacing-8)] pl-[var(--spacing-24)]">
        {options.map((opt) => (
          <Checkbox
            key={opt}
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
            label={opt}
          />
        ))}
      </div>
    </div>
  );
};

export const Group: Story = {
  render: () => <CheckboxGroup />,
};

/* ── Danger state ─────────────────────────────────────── */

export const Danger: Story = {
  args: {
    state: 'danger',
    label: 'I agree',
  },
};

export const DangerChecked: Story = {
  args: {
    state: 'danger',
    checked: true,
    label: 'I agree',
  },
};

export const DangerWithHelperText: Story = {
  args: {
    state: 'danger',
    label: 'I agree',
    helperText: 'This is informational copy, not an error',
  },
};

/* ── Programmatic ref focus ───────────────────────────── */

const RefFocusDemo = () => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col gap-[var(--spacing-12)]">
      <Checkbox label="I agree" inputRef={ref} />
      <Button label="Focus the checkbox" onClick={() => ref.current?.focus()} />
    </div>
  );
};

export const RefFocus: Story = {
  render: () => <RefFocusDemo />,
};
