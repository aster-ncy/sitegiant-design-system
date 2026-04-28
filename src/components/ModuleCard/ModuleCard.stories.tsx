import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ModuleCard } from './ModuleCard';

const meta = {
  title: 'Surfaces/ModuleCard',
  component: ModuleCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    icon: 'settings',
    title: 'General',
    description: 'Update your store and default language',
    onClick: fn(),
  },
} satisfies Meta<typeof ModuleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default (General)',
  args: {
    icon: 'settings',
    title: 'General',
    description: 'Update your store and default language',
  },
};

export const TwoLineDescription: Story = {
  name: 'Two-line description',
  args: {
    icon: 'credit-card',
    title: 'Payment',
    description: 'Configure accepted payment methods and connect your merchant gateways',
  },
};

export const LongDescriptionTruncates: Story = {
  name: 'Long description (clamps at 2 lines)',
  args: {
    icon: 'truck',
    title: 'Shipping & Delivery',
    description:
      'Set up shipping zones, courier integrations, delivery fees, and packaging preferences. Anything beyond two lines should be clipped with an ellipsis — the card height stays consistent across the settings grid.',
  },
};

export const Disabled: Story = {
  args: {
    icon: 'lock',
    title: 'Advanced',
    description: 'Available to Premium plans only',
    disabled: true,
  },
};

export const Grid: Story = {
  name: 'Settings index grid',
  args: {},
  render: () => (
    <div className="grid grid-cols-2 gap-[var(--spacing-16)]">
      <ModuleCard icon="settings" title="General" description="Update your store and default language" onClick={fn()} />
      <ModuleCard icon="credit-card" title="Payment" description="Configure payment methods and merchant gateways" onClick={fn()} />
      <ModuleCard icon="truck" title="Shipping" description="Set up shipping zones, couriers, and delivery fees" onClick={fn()} />
      <ModuleCard icon="customers" title="Team" description="Manage staff accounts, roles, and permissions" onClick={fn()} />
      <ModuleCard icon="mail" title="Notifications" description="Customize email and push notification templates" onClick={fn()} />
      <ModuleCard icon="lock" title="Security" description="Two-factor authentication and session controls" onClick={fn()} />
    </div>
  ),
};
