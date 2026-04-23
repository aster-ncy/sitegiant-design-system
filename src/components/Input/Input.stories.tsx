import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';
import { Icon } from '../Icon';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'focus', 'danger', 'disabled', 'readonly'],
    },
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
