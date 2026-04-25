import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { EllipsisButton } from './EllipsisButton';

const meta = {
  title: 'Actions/EllipsisButton',
  component: EllipsisButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'basic', 'danger', 'danger-subtle'],
    },
    size: {
      control: 'select',
      options: ['default', 'lg'],
    },
    disabled: { control: 'boolean' },
    onDark: { control: 'boolean' },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof EllipsisButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'default' },
};

export const Basic: Story = {
  args: { variant: 'basic' },
};

export const Danger: Story = {
  args: { variant: 'danger' },
};

export const DangerSubtle: Story = {
  args: { variant: 'danger-subtle' },
};

export const Disabled: Story = {
  args: { variant: 'default', disabled: true },
};

export const Large: Story = {
  args: { variant: 'default', size: 'lg' },
};

export const OnDark: Story = {
  args: { variant: 'default', onDark: true },
  decorators: [
    (Story) => (
      <div className="bg-[var(--color-set-DEFAULT)] p-8 rounded-[var(--radius-12)]">
        <Story />
      </div>
    ),
  ],
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {/* Light background — Default size */}
      <div className="flex flex-wrap gap-4 items-center">
        <span className="w-28 text-sm text-[var(--color-text-info)]">Default</span>
        <EllipsisButton variant="default" />
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <span className="w-28 text-sm text-[var(--color-text-info)]">Basic</span>
        <EllipsisButton variant="basic" />
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <span className="w-28 text-sm text-[var(--color-text-info)]">Danger</span>
        <EllipsisButton variant="danger" />
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <span className="w-28 text-sm text-[var(--color-text-info)]">Danger Subtle</span>
        <EllipsisButton variant="danger-subtle" />
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <span className="w-28 text-sm text-[var(--color-text-info)]">Disabled</span>
        <EllipsisButton variant="default" disabled />
      </div>

      {/* Large size */}
      <div className="flex flex-wrap gap-4 items-center">
        <span className="w-28 text-sm text-[var(--color-text-info)]">Large</span>
        <EllipsisButton variant="default" size="lg" />
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <span className="w-28 text-sm text-[var(--color-text-info)]">Large Disabled</span>
        <EllipsisButton variant="default" size="lg" disabled />
      </div>

      {/* Dark background */}
      <div className="flex flex-wrap gap-4 items-center bg-[var(--color-set-DEFAULT)] p-4 rounded-[var(--radius-12)]">
        <span className="w-28 text-sm text-[var(--color-text-ondark)]">On Dark</span>
        <EllipsisButton variant="default" onDark />
        <EllipsisButton variant="default" size="lg" onDark />
      </div>
    </div>
  ),
};
