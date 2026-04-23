import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['attention', 'primary', 'success', 'alert', 'default', 'subtle', 'primary-subtle'],
    },
    size: { control: 'select', options: ['default', 'smaller'] },
    dotOnly: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: { label: '1', variant: 'attention', size: 'default', dotOnly: false },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Attention: Story = { args: { variant: 'attention' } };
export const Primary: Story = { args: { variant: 'primary' } };
export const Success: Story = { args: { variant: 'success' } };
export const Alert: Story = { args: { variant: 'alert' } };
export const Default: Story = { args: { variant: 'default' } };
export const Subtle: Story = { args: { variant: 'subtle' } };
export const PrimarySubtle: Story = { args: { variant: 'primary-subtle' } };

export const SmallAttentionDot: Story = {
  args: { dotOnly: true },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2 items-center">
        <Badge variant="attention" label="1" />
        <Badge variant="primary" label="1" />
        <Badge variant="success" label="1" />
        <Badge variant="alert" label="1" />
        <Badge variant="default" label="1" />
        <Badge variant="subtle" label="1" />
        <Badge variant="primary-subtle" label="1" />
        <Badge dotOnly />
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <Badge size="smaller" variant="attention" label="1" />
        <Badge size="smaller" variant="primary" label="1" />
        <Badge size="smaller" variant="success" label="1" />
        <Badge size="smaller" variant="alert" label="1" />
        <Badge size="smaller" variant="default" label="1" />
        <Badge size="smaller" variant="subtle" label="1" />
        <Badge size="smaller" variant="primary-subtle" label="1" />
      </div>
    </div>
  ),
};
