import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TaskCard } from './TaskCard';

const meta = {
  title: 'Surfaces/TaskCard',
  component: TaskCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'select', options: ['pending', 'in-progress', 'completed'] },
    priority: { control: 'select', options: ['required', 'optional'] },
  },
  args: {
    title: 'Store Setup',
    description: 'Configure your store profile, business address, and operating hours.',
    icon: 'settings',
    step: 1,
    status: 'pending',
    priority: 'required',
    ctaLabel: 'Get started',
  },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TaskCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = {
  args: { status: 'pending', step: 1 },
};

export const InProgress: Story = {
  args: {
    status: 'in-progress',
    step: 2,
    title: 'Connect Sales Channel',
    description: 'Link your Shopee, Lazada, TikTok Shop, or other marketplace accounts.',
    icon: 'external-link',
    ctaLabel: 'Continue setup',
  },
};

export const Completed: Story = {
  args: {
    status: 'completed',
    step: 1,
    title: 'Store Setup',
    description: 'Configure your store profile, business address, and operating hours.',
    icon: 'settings',
  },
};

export const OptionalTask: Story = {
  args: {
    priority: 'optional',
    step: 4,
    title: 'Set Up Fulfillment',
    description: 'Configure shipping methods, courier integrations, and warehouse settings.',
    icon: 'truck',
  },
};

export const CardRow: Story = {
  decorators: [
    (Story) => (
      <div className="w-full max-w-[1080px]">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div className="flex gap-[var(--spacing-16)] flex-wrap">
      <div className="flex-1 min-w-[280px]">
        <TaskCard
          title="Store Setup"
          description="Configure your store profile, business address, and operating hours."
          icon="settings"
          step={1}
          status="completed"
          priority="required"
        />
      </div>
      <div className="flex-1 min-w-[280px]">
        <TaskCard
          title="Connect Sales Channel"
          description="Link your Shopee, Lazada, TikTok Shop, or other marketplace accounts."
          icon="external-link"
          step={2}
          status="in-progress"
          priority="required"
          ctaLabel="Continue setup"
        />
      </div>
      <div className="flex-1 min-w-[280px]">
        <TaskCard
          title="Add First Product"
          description="Create your first product listing with images, pricing, and inventory."
          icon="products"
          step={3}
          status="pending"
          priority="required"
          ctaLabel="Add product"
        />
      </div>
    </div>
  ),
};
