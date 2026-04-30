import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableSelectionBar } from './TableSelectionBar';
import { Checkbox } from '../Checkbox';

const meta = {
  title: 'Tables/TableSelectionBar',
  component: TableSelectionBar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    selectedCount: 1,
    checkbox: <Checkbox size="sm" checked indeterminate />,
  },
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TableSelectionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CountOnly: Story = {};

export const SingleAction: Story = {
  args: {
    actions: [{ key: 'a1', label: 'Action 1' }],
  },
};

export const MoreAction: Story = {
  args: {
    actions: [
      {
        key: 'more',
        label: 'More Action',
        menuItems: [
          { key: 'archive', label: 'Archive' },
          { key: 'duplicate', label: 'Duplicate' },
          { key: 'export', label: 'Export to CSV' },
        ],
      },
    ],
  },
};

export const DeleteOnly: Story = {
  args: {
    onDelete: () => {},
  },
};

const moreActionMenu = {
  key: 'more',
  label: 'More Action',
  menuItems: [
    { key: 'archive', label: 'Archive' },
    { key: 'duplicate', label: 'Duplicate' },
    { key: 'export', label: 'Export to CSV' },
  ],
};

export const ActionPlusMore: Story = {
  args: {
    actions: [{ key: 'a1', label: 'Action 1' }, moreActionMenu],
  },
};

export const ActionMoreDelete: Story = {
  args: {
    actions: [{ key: 'a1', label: 'Action 1' }, moreActionMenu],
    onDelete: () => {},
  },
};

export const FullToolbar: Story = {
  args: {
    actions: [
      { key: 'a1', label: 'Action 1' },
      { key: 'a2', label: 'Action 2' },
      moreActionMenu,
    ],
    onDelete: () => {},
  },
};

export const MultipleSelected: Story = {
  args: {
    selectedCount: 12,
    actions: [
      { key: 'a1', label: 'Edit' },
      { key: 'a2', label: 'Export' },
      moreActionMenu,
    ],
    onDelete: () => {},
  },
};
