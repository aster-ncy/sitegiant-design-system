import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableHeaderCell, sortDirectionToAria } from './TableHeaderCell';
import { Checkbox } from '../Checkbox';

const meta = {
  title: 'Tables/TableHeaderCell',
  component: TableHeaderCell,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'inline-radio', options: ['default', 'icon'] },
    column: { control: 'inline-radio', options: ['first', 'center', 'last'] },
    align: { control: 'inline-radio', options: ['left', 'center', 'right'] },
    sortDirection: { control: 'inline-radio', options: [null, 'asc', 'desc'] },
  },
  args: {
    label: 'Table Header Title',
    sortable: true,
  },
} satisfies Meta<typeof TableHeaderCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FirstColumnLeft: Story = {
  args: { column: 'first', align: 'left' },
};

export const FirstColumnCenter: Story = {
  args: { column: 'first', align: 'center' },
};

export const FirstColumnRight: Story = {
  args: { column: 'first', align: 'right' },
};

export const CenterColumnLeft: Story = {
  args: { column: 'center', align: 'left' },
};

export const CenterColumnCenter: Story = {
  args: { column: 'center', align: 'center' },
};

export const CenterColumnRight: Story = {
  args: { column: 'center', align: 'right' },
};

export const LastColumnLeft: Story = {
  args: { column: 'last', align: 'left' },
};

export const LastColumnCenter: Story = {
  args: { column: 'last', align: 'center' },
};

export const LastColumnRight: Story = {
  args: { column: 'last', align: 'right' },
};

export const WithCheckbox: Story = {
  args: {
    column: 'first',
    checkbox: <Checkbox />,
  },
};

export const WithSortAscending: Story = {
  args: {
    sortDirection: 'asc',
  },
};

export const WithSortDescending: Story = {
  args: {
    sortDirection: 'desc',
  },
};

export const WithWarningHint: Story = {
  args: {
    hint: { count: 3, label: 'warning' },
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const NotSortable: Story = {
  args: { sortable: false },
};

export const IconType: Story = {
  args: {
    type: 'icon',
    column: 'last',
    icon: 'menu-swap',
    iconAriaLabel: 'Sort',
  },
};

/* ── Composite: a full header row ────────────────────── */
export const FullHeaderRow: Story = {
  render: () => (
    <table className="border-collapse w-full">
      <thead>
        <tr>
          <th aria-sort={sortDirectionToAria(null, true)}>
            <TableHeaderCell column="first" align="left" label="Product" sortable checkbox={<Checkbox />} />
          </th>
          <th aria-sort={sortDirectionToAria(null, true)}>
            <TableHeaderCell column="center" align="left" label="SKU" sortable />
          </th>
          <th aria-sort={sortDirectionToAria('desc', true)}>
            <TableHeaderCell column="center" align="right" label="Stock" sortable sortDirection="desc" />
          </th>
          <th aria-sort={sortDirectionToAria(null, true)}>
            <TableHeaderCell column="center" align="right" label="Price" sortable />
          </th>
          <th>
            <TableHeaderCell column="last" type="icon" icon="menu-swap" iconAriaLabel="Sort" />
          </th>
        </tr>
      </thead>
    </table>
  ),
};
