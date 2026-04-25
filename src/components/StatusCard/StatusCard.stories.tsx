import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { StatusCard } from './StatusCard';
import type { StatusCardStatus } from './StatusCard';

const meta = {
  title: 'Feedback/StatusCard',
  component: StatusCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['basic', 'subtle', 'default', 'warning', 'success', 'alert', 'danger'],
    },
    size: { control: 'select', options: ['default', 'large'] },
    count: { control: 'text' },
    label: { control: 'text' },
  },
  args: {
    onClick: fn(),
    count: '00',
    label: 'Status Card',
  },
} satisfies Meta<typeof StatusCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Default size stories ────────────────────────────── */

export const Basic: Story = {
  args: { status: 'basic', size: 'default' },
};

export const Subtle: Story = {
  args: { status: 'subtle', size: 'default' },
};

export const Default: Story = {
  args: { status: 'default', size: 'default' },
};

export const Warning: Story = {
  args: { status: 'warning', size: 'default' },
};

export const Success: Story = {
  args: { status: 'success', size: 'default' },
};

export const Alert: Story = {
  args: { status: 'alert', size: 'default' },
};

export const Danger: Story = {
  args: { status: 'danger', size: 'default' },
};

/* ── Large size stories ──────────────────────────────── */

export const BasicLarge: Story = {
  args: { status: 'basic', size: 'large' },
};

export const SubtleLarge: Story = {
  args: { status: 'subtle', size: 'large' },
};

export const DefaultLarge: Story = {
  args: { status: 'default', size: 'large' },
};

export const WarningLarge: Story = {
  args: { status: 'warning', size: 'large' },
};

export const SuccessLarge: Story = {
  args: { status: 'success', size: 'large' },
};

export const AlertLarge: Story = {
  args: { status: 'alert', size: 'large' },
};

export const DangerLarge: Story = {
  args: { status: 'danger', size: 'large' },
};

/* ── Gallery: all statuses ───────────────────────────── */

const allStatuses: StatusCardStatus[] = ['basic', 'subtle', 'default', 'warning', 'success', 'alert', 'danger'];

export const AllDefault: Story = {
  render: () => (
    <div className="flex flex-wrap gap-[var(--spacing-16)]">
      {allStatuses.map(s => (
        <StatusCard key={s} status={s} size="default" count="12" label={s} />
      ))}
    </div>
  ),
};

export const AllLarge: Story = {
  render: () => (
    <div className="flex flex-wrap gap-[var(--spacing-16)]">
      {allStatuses.map(s => (
        <StatusCard key={s} status={s} size="large" count="12" label={s} />
      ))}
    </div>
  ),
};
