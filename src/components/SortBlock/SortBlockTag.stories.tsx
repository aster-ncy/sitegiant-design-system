import type { Meta, StoryObj } from '@storybook/react-vite';
import { SortBlockTag } from './SortBlockTag';
import { Pip } from '../Pip';

const meta = {
  title: 'Information/SortBlock/Tag',
  component: SortBlockTag,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    children: <Pip type="success" label="Pip Text" />,
  },
} satisfies Meta<typeof SortBlockTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithSuccessPip: Story = {
  render: () => (
    <SortBlockTag>
      <Pip type="success" label="Pip Text" />
    </SortBlockTag>
  ),
};

export const WithAlertPip: Story = {
  render: () => (
    <SortBlockTag>
      <Pip type="alert" label="Pip Text" />
    </SortBlockTag>
  ),
};
