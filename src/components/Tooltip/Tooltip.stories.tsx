import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    arrow: { control: 'select', options: ['none', 'up', 'down', 'left', 'right'] },
    width: { control: 'number' },
    message: { control: 'text' },
  },
  args: {
    message: 'Tooltip message',
    width: 96,
    arrow: 'down',
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ArrowDown: Story = { args: { arrow: 'down' } };
export const ArrowUp: Story = { args: { arrow: 'up' } };
export const ArrowLeft: Story = { args: { arrow: 'left' } };
export const ArrowRight: Story = { args: { arrow: 'right' } };
export const NoArrow: Story = { args: { arrow: 'none' } };

export const LongMessage: Story = {
  args: {
    arrow: 'down',
    width: 200,
    message: 'This tooltip has a longer message that wraps across multiple lines.',
  },
};

export const AllArrows: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-24)] items-start">
      <Tooltip arrow="down" message="Tooltip message" width={96} />
      <Tooltip arrow="up" message="Tooltip message" width={96} />
      <Tooltip arrow="left" message="Tooltip message" width={96} />
      <Tooltip arrow="right" message="Tooltip message" width={96} />
      <Tooltip arrow="none" message="Tooltip message" width={96} />
    </div>
  ),
};
