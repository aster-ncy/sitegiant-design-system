import type { Meta, StoryObj } from '@storybook/react-vite';
import { StepCircle } from './StepCircle';

const meta = {
  title: 'Components/StepCircle',
  component: StepCircle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'select', options: ['pending', 'active', 'completed'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    step: { control: 'number' },
  },
  args: { step: 1, status: 'pending', size: 'md' },
} satisfies Meta<typeof StepCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = { args: { status: 'pending', step: 1 } };
export const Active: Story = { args: { status: 'active', step: 2 } };
export const Completed: Story = { args: { status: 'completed' } };

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <StepCircle size="sm" status="active" step={1} />
      <StepCircle size="md" status="active" step={2} />
      <StepCircle size="lg" status="active" step={3} />
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <StepCircle status="pending" step={1} />
      <StepCircle status="active" step={2} />
      <StepCircle status="completed" step={3} />
    </div>
  ),
};

export const ProgressSequence: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <StepCircle status="completed" step={1} />
      <div className="w-8 h-[2px] bg-[var(--color-brand-green-DEFAULT)]" />
      <StepCircle status="active" step={2} />
      <div className="w-8 h-[2px] bg-[var(--color-space-DEFAULT)]" />
      <StepCircle status="pending" step={3} />
    </div>
  ),
};
