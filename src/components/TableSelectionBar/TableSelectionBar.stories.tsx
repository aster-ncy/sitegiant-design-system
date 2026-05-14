import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableSelectionBar } from './TableSelectionBar';
import { Checkbox } from '../Checkbox';

type SelectionBarStoryArgs = React.ComponentProps<typeof TableSelectionBar> & {
  actionCount?: 0 | 1 | 2;
  action1Label?: string;
  action2Label?: string;
  withMoreAction?: boolean;
  withDelete?: boolean;
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

const buildActions = (
  count: 0 | 1 | 2,
  withMore: boolean,
  label1: string,
  label2: string,
) => {
  const base = [
    { key: 'a1', label: label1 },
    { key: 'a2', label: label2 },
  ].slice(0, count);
  return withMore ? [...base, moreActionMenu] : base.length > 0 ? base : undefined;
};

const meta = {
  title: 'Tables/Table Atoms/Selection Bar',
  component: TableSelectionBar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    selectedCount: 1,
    checkbox: <Checkbox size="sm" checked indeterminate />,
    actionCount: 0,
    action1Label: 'Action 1',
    action2Label: 'Action 2',
    withMoreAction: false,
    withDelete: false,
    deleteDisabled: false,
  },
  argTypes: {
    // ── 1. Content ────────────────────────────────────────────────────────
    selectedCount: {
      control: { type: 'number', min: 1, step: 1 },
      description: 'Number of selected rows shown in the count chip.',
      table: { category: '1. Content', defaultValue: { summary: '1' } },
    },
    // ── 2. Actions ────────────────────────────────────────────────────────
    actionCount: {
      control: { type: 'inline-radio' },
      options: [0, 1, 2] satisfies ReadonlyArray<0 | 1 | 2>,
      description: 'Number of plain action buttons.',
      table: { category: '2. Actions', defaultValue: { summary: '0' } },
    },
    action1Label: {
      control: 'text',
      description: 'Label for action button 1.',
      table: { category: '2. Actions', defaultValue: { summary: 'Action 1' } },
      if: { arg: 'actionCount', neq: 0 },
    },
    action2Label: {
      control: 'text',
      description: 'Label for action button 2.',
      table: { category: '2. Actions', defaultValue: { summary: 'Action 2' } },
      if: { arg: 'actionCount', eq: 2 },
    },
    withMoreAction: {
      control: 'boolean',
      description: 'Add a "More Action" dropdown after the plain action buttons.',
      table: { category: '2. Actions', defaultValue: { summary: 'false' } },
    },
    withDelete: {
      control: 'boolean',
      description: 'Show the trash-icon delete button as the last segment.',
      table: { category: '2. Actions', defaultValue: { summary: 'false' } },
    },
    deleteDisabled: {
      control: 'boolean',
      description: 'Disable the delete button.',
      table: { category: '2. Actions', defaultValue: { summary: 'false' } },
      if: { arg: 'withDelete', truthy: true },
    },
    // ── Hidden / forwarded props ──────────────────────────────────────────
    selectedLabel: { table: { disable: true } },
    actions: { table: { disable: true } },
    onDelete: { table: { disable: true } },
    checkbox: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  render: ({
    actionCount = 0,
    action1Label = 'Action 1',
    action2Label = 'Action 2',
    withMoreAction = false,
    withDelete = false,
    deleteDisabled = false,
    selectedCount = 1,
  }: SelectionBarStoryArgs) => (
    <TableSelectionBar
      checkbox={<Checkbox size="sm" checked indeterminate />}
      selectedCount={selectedCount}
      actions={buildActions(actionCount, withMoreAction, action1Label, action2Label)}
      onDelete={withDelete ? () => {} : undefined}
      deleteDisabled={deleteDisabled}
    />
  ),
} satisfies Meta<SelectionBarStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ─────────────────────────────────────────────────────────────

export const Playground: Story = {};

// ── Recipe stories ──────────────────────────────────────────────────────────

export const CountOnly: Story = {
  args: { actionCount: 0, withMoreAction: false, withDelete: false },
};

export const SingleAction: Story = {
  args: { actionCount: 1, withMoreAction: false, withDelete: false },
};

export const MoreAction: Story = {
  args: { actionCount: 0, withMoreAction: true, withDelete: false },
};

export const DeleteOnly: Story = {
  args: { actionCount: 0, withMoreAction: false, withDelete: true },
};

export const TwoActions: Story = {
  args: { actionCount: 2, withMoreAction: false, withDelete: false },
};

export const ActionAndMore: Story = {
  args: { actionCount: 1, withMoreAction: true, withDelete: false },
};

export const TwoActionsAndDelete: Story = {
  args: { actionCount: 2, withMoreAction: false, withDelete: true },
};

export const ActionMoreAndDelete: Story = {
  args: { actionCount: 1, withMoreAction: true, withDelete: true },
};

export const FullToolbar: Story = {
  args: { actionCount: 2, withMoreAction: true, withDelete: true },
};

export const MultipleSelected: Story = {
  args: {
    selectedCount: 12,
    actionCount: 2,
    withMoreAction: true,
    withDelete: true,
  },
};

export const DeleteDisabled: Story = {
  args: {
    actionCount: 1,
    withMoreAction: false,
    withDelete: true,
    deleteDisabled: true,
  },
};
