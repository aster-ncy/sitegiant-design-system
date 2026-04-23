import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    completed: { control: { type: 'number', min: 0, max: 10 } },
    total: { control: { type: 'number', min: 1, max: 10 } },
    showLabel: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md'] },
  },
  args: { completed: 2, total: 6, showLabel: true, size: 'md' },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = { args: { completed: 0, total: 6 } };
export const Partial: Story = { args: { completed: 2, total: 6 } };
export const Full: Story = { args: { completed: 6, total: 6 } };

export const SmallSize: Story = {
  args: { completed: 3, total: 6, size: 'sm' },
};

export const NoLabel: Story = {
  args: { completed: 4, total: 6, showLabel: false },
};

export const CustomLabel: Story = {
  args: { completed: 1, total: 3, label: '1 mandatory task remaining' },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-[480px]">
      <ProgressBar completed={0} total={6} label="0 of 6 completed" />
      <ProgressBar completed={2} total={6} label="2 of 6 completed" />
      <ProgressBar completed={4} total={6} label="4 of 6 completed" />
      <ProgressBar completed={6} total={6} label="6 of 6 completed" />
      <ProgressBar completed={3} total={6} size="sm" label="Small size" />
    </div>
  ),
};
