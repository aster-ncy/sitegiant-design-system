import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fragment, useRef } from 'react';
import { Input } from './Input';
import { Icon } from '../Icon';
import { Button } from '../Button';

const meta = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'focus', 'danger', 'disabled', 'readonly', 'readonly-bold'],
    },
    validation: {
      control: 'inline-radio',
      options: ['default', 'error', 'success'],
    },
    showCount: { control: 'boolean' },
    maxLength: { control: 'number' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Individual stories ──────────────────────────────── */

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
  },
};

export const WithLabelAndInfo: Story = {
  args: {
    label: 'Password',
    labelInfo: '(required)',
    placeholder: 'Enter password',
  },
};

export const Focused: Story = {
  args: {
    label: 'Search',
    placeholder: 'Type to search...',
    state: 'focus',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Company name',
    value: 'SiteGiant Sdn Bhd',
  },
};

export const Danger: Story = {
  args: {
    label: 'Email address',
    value: 'not-an-email',
    state: 'danger',
    helperText: 'Please enter a valid email address.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    disabled: true,
  },
};

export const DisabledWithValue: Story = {
  args: {
    label: 'Account ID',
    value: 'SG-00123',
    disabled: true,
  },
};

export const Readonly: Story = {
  args: {
    label: 'Company profile',
    value: 'SiteGiant Sdn Bhd',
    readonly: true,
  },
};

export const WithTrailingIcon: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    trailingIcon: <Icon name="eye" size={16} />,
  },
};

export const WithAddonButton: Story = {
  args: {
    label: 'Referral code',
    value: 'SG-REF-2026',
    addonButton: {
      label: 'Copy',
      icon: <Icon name="copy" size={16} />,
    },
  },
};

export const WithAddonButtonDisabled: Story = {
  args: {
    label: 'Referral code',
    value: 'SG-REF-2026',
    disabled: true,
    addonButton: {
      label: 'Copy',
      icon: <Icon name="copy" size={16} />,
    },
  },
};

/* ── Composite: all states ───────────────────────────── */

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-16)] max-w-sm">
      <Input
        label="Default"
        placeholder="Placeholder text"
        state="default"
      />
      <Input
        label="Focus"
        placeholder="Focused input"
        state="focus"
      />
      <Input
        label="With value"
        value="Some entered value"
        state="default"
      />
      <Input
        label="Danger"
        value="invalid-value"
        state="danger"
        helperText="This field has an error."
      />
      <Input
        label="Disabled"
        placeholder="Disabled input"
        disabled
      />
      <Input
        label="Disabled with value"
        value="Read-only value"
        disabled
      />
      <Input
        label="Readonly text layout"
        value="This looks like plain text"
        readonly
      />
      <Input
        label="With trailing icon"
        placeholder="Enter password"
        trailingIcon={<Icon name="eye" size={16} />}
      />
      <Input
        label="With addon button"
        value="SG-REF-2026"
        addonButton={{ label: 'Copy', icon: <Icon name="copy" size={16} /> }}
      />
    </div>
  ),
};

/* ── Programmatic ref focus ────────────────────────────── */

const RefFocusDemo = () => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col gap-[var(--spacing-12)]">
      <Input label="Email" placeholder="you@example.com" inputRef={ref} />
      <Button label="Focus the input" onClick={() => ref.current?.focus()} />
    </div>
  );
};

export const RefFocus: Story = {
  render: () => <RefFocusDemo />,
};

/* ── Validation: success / error ───────────────────────── */

export const ValidationSuccess: Story = {
  args: {
    label: 'Email',
    defaultValue: 'aster.ng@sitegiant.com',
    validation: 'success',
    helperText: 'Looks good.',
  },
};

export const ValidationError: Story = {
  args: {
    label: 'Email',
    defaultValue: 'not-an-email',
    validation: 'error',
    helperText: 'Please enter a valid email address.',
  },
};

/* ── State: readonly-bold ──────────────────────────────── */

export const ReadonlyBold: Story = {
  args: {
    label: 'Email',
    defaultValue: 'aster.ng@sitegiant.com',
    state: 'readonly-bold',
    helperText: 'Bold value, no border, no padding.',
  },
};

/* ── Word-count counter inside the field ───────────────── */

export const WithWordCount: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    showCount: true,
    maxLength: 50,
  },
};

export const WithWordCountFilled: Story = {
  args: {
    label: 'Bio',
    defaultValue: 'I sell electronics on multiple channels.',
    showCount: true,
    maxLength: 50,
  },
};

/* ── State × Validation matrix (per Figma Form Value) ──── */

const matrixStates = [
  { label: 'default', state: 'default' as const },
  { label: 'filled', state: 'default' as const, value: 'Value' },
  { label: 'disabled', state: 'disabled' as const },
  { label: 'readonly', state: 'readonly' as const, value: 'Value' },
  { label: 'readonly-bold', state: 'readonly-bold' as const, value: 'Value' },
];
const matrixValidations: Array<'default' | 'error' | 'success'> = ['default', 'error', 'success'];

export const FullMatrix: Story = {
  args: { placeholder: 'Label' },
  render: () => (
    <div className="grid grid-cols-[140px_repeat(3,_minmax(0,_320px))] gap-x-[var(--spacing-16)] gap-y-[var(--spacing-20)]">
      <span />
      {matrixValidations.map((v) => (
        <span
          key={v}
          className="text-[length:var(--text-12)] font-[var(--font-weight-medium)] text-[color:var(--color-text-info)]"
        >
          validation = {v}
        </span>
      ))}
      {matrixStates.map((row) => (
        <Fragment key={row.label}>
          <span className="text-[length:var(--text-12)] font-[var(--font-weight-medium)] text-[color:var(--color-text-info)] self-center">
            state = {row.label}
          </span>
          {matrixValidations.map((v) => (
            <Input
              key={`${row.label}-${v}`}
              state={row.state}
              validation={v}
              placeholder="Label"
              defaultValue={row.value}
              helperText="Hint text"
            />
          ))}
        </Fragment>
      ))}
    </div>
  ),
};
