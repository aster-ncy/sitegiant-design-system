import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Remark, type RemarkState } from './Remark';

const states: RemarkState[] = ['info', 'success', 'tips', 'danger', 'alert'];

const meta = {
  title: 'Feedback/Remark',
  component: Remark,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    state: { control: 'select', options: states },
    remark: { control: 'text' },
    showIcon: { control: 'boolean' },
    showButton: { control: 'boolean' },
    buttonLabel: { control: 'text' },
  },
  args: {
    state: 'info',
    remark: 'Remark content.',
    showIcon: true,
    showButton: true,
    buttonLabel: 'Button',
    onButtonClick: fn(),
  },
} satisfies Meta<typeof Remark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = { args: { state: 'info' } };
export const Success: Story = { args: { state: 'success' } };
export const Tips: Story = { args: { state: 'tips' } };
export const Danger: Story = { args: { state: 'danger' } };
export const Alert: Story = { args: { state: 'alert' } };

export const AllStates: Story = {
  render: (args) => (
    <div className="flex w-[670px] flex-col gap-[20px]">
      {states.map((state) => (
        <Remark key={state} {...args} state={state} />
      ))}
    </div>
  ),
};

export const WithoutIcon: Story = {
  args: {
    showIcon: false,
  },
};

export const WithoutButton: Story = {
  args: {
    showButton: false,
  },
};
