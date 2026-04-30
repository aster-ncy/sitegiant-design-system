import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableExpandToggle } from './TableExpandToggle';

const meta = {
  title: 'Tables/TableExpandToggle',
  component: TableExpandToggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { expanded: false },
} satisfies Meta<typeof TableExpandToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {};

export const Expanded: Story = { args: { expanded: true } };

export const Interactive: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <TableExpandToggle {...args} expanded={open} onToggle={setOpen} />
    );
  },
};
