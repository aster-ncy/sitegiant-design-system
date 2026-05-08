import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableSelectionBar } from './TableSelectionBar';
import { Checkbox } from '../Checkbox';

const meta = {
  title: 'Tables/Table Atoms/Selection Bar',
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

const matrixVariants = [
  {
    label: 'No action',
    props: {},
  },
  {
    label: 'Action 1',
    props: {
      actions: [{ key: 'a1', label: 'Action 1' }],
    },
  },
  {
    label: 'More action',
    props: {
      actions: [moreActionMenu],
    },
  },
  {
    label: 'Trash action',
    props: {
      onDelete: () => {},
    },
  },
  {
    label: 'Action + more',
    props: {
      actions: [{ key: 'a1', label: 'Action 1' }, moreActionMenu],
    },
  },
  {
    label: 'Action + more + trash',
    props: {
      actions: [{ key: 'a1', label: 'Action 1' }, moreActionMenu],
      onDelete: () => {},
    },
  },
  {
    label: '2 actions + more + trash',
    props: {
      actions: [
        { key: 'a1', label: 'Action 1' },
        { key: 'a2', label: 'Action 2' },
        moreActionMenu,
      ],
      onDelete: () => {},
    },
  },
];

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

/**
 * Figma parity matrix for Table Header - Selected (1920:5138 / 1920:5155).
 * This node was already represented by the smaller stories above; keep
 * those smaller stories for copyable product code.
 */
export const FigmaMatrix: Story = {
  render: () => (
    <div className="flex w-[560px] flex-col gap-[var(--spacing-16)]">
      <p className="text-[length:var(--text-12)] leading-[var(--leading-17)] text-[color:var(--color-text-info)]">
        Visual check only. Use CountOnly, SingleAction, MoreAction, DeleteOnly, or the action-combo stories for copyable product code.
      </p>
      {matrixVariants.map(({ label, props }) => (
        <div key={label} className="flex flex-col gap-[var(--spacing-4)]">
          <span className="text-[length:var(--text-12)] leading-[var(--leading-15)] text-[color:var(--color-text-info)]">
            {label}
          </span>
          <TableSelectionBar
            selectedCount={label.startsWith('2 actions') ? 2 : 1}
            checkbox={<Checkbox size="sm" checked indeterminate />}
            {...props}
          />
        </div>
      ))}
    </div>
  ),
};
