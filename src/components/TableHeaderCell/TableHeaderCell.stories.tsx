import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableHeaderCell } from './TableHeaderCell';
import { sortDirectionToAria } from './sortDirectionToAria';
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
    checkbox: <Checkbox size="sm" />,
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

/* ── Inset variant ──────────────────────────────────── */

export const Inset: Story = {
  args: { inset: true },
};

export const InsetFirstColumn: Story = {
  args: { inset: true, column: 'first', label: 'Column' },
};

export const InsetWithCheckbox: Story = {
  args: {
    inset: true,
    column: 'first',
    checkbox: <Checkbox size="sm" />,
  },
};

/* ── Sub-header variant ─────────────────────────────── */

/**
 * Sub-header band — used above sub-rows inside an expanded parent row
 * (e.g. Sales Channel "Today Sales" pattern). Same typography and
 * padding as a regular inset header but with the subrow grey fill, no
 * leading/trailing corner radii, and no sort indicator by default.
 */
export const Subheader: Story = {
  args: {
    subheader: true,
    column: 'first',
    label: 'Store',
    sortable: false,
  },
};

/**
 * Composite sub-header band reproducing the s2 Sales Channel pattern.
 * Confirms (a) all three column positions render with the grey subrow
 * fill, (b) no rounded corners on either edge (sub-headers sit between
 * rows, not at the table edge), and (c) sort affordances are suppressed
 * even if `sortable` is passed — the chevron should NOT appear on the
 * "Store" column even though sortable=true.
 */
export const SubheaderRow: Story = {
  render: () => (
    <table className="border-collapse w-full">
      <thead>
        <tr>
          <th>
            <TableHeaderCell subheader column="first" align="left" label="Store" sortable />
          </th>
          <th>
            <TableHeaderCell subheader column="center" align="right" label="Order" />
          </th>
          <th>
            <TableHeaderCell subheader column="last" align="right" label="Total (RM)" />
          </th>
        </tr>
      </thead>
    </table>
  ),
};

export const InsetTableExample: Story = {
  render: () => (
    <table className="border-collapse w-full">
      <thead>
        <tr>
          <th aria-sort={sortDirectionToAria(null, true)}>
            <TableHeaderCell inset column="first" align="left" label="Item" sortable checkbox={<Checkbox size="sm" />} />
          </th>
          <th aria-sort={sortDirectionToAria(null, true)}>
            <TableHeaderCell inset column="center" align="left" label="Variant" sortable />
          </th>
          <th aria-sort={sortDirectionToAria('asc', true)}>
            <TableHeaderCell inset column="last" align="right" label="Quantity" sortable sortDirection="asc" />
          </th>
        </tr>
      </thead>
    </table>
  ),
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
            <TableHeaderCell column="first" align="left" label="Product" sortable checkbox={<Checkbox size="sm" />} />
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
