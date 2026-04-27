import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from './Chip';

const meta = {
  title: 'Foundations/Chip',
  component: Chip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
  args: { children: 'Today' },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

const presetLabels = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month'];

export const Group: Story = {
  render: () => (
    <div className="flex flex-wrap gap-[var(--spacing-8)]">
      {presetLabels.map((label) => (
        <Chip key={label}>{label}</Chip>
      ))}
    </div>
  ),
};
