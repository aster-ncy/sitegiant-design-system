import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableCell } from './TableCell';
import { useState } from 'react';
import { TableHeaderCell, sortDirectionToAria } from '../TableHeaderCell';
import { Checkbox } from '../Checkbox';
import { Icon } from '../Icon';
import { Tag } from '../Tag';
import { Pip } from '../Pip';
import { TableExpandToggle } from '../TableExpandToggle';

const meta = {
  title: 'Tables/TableCell',
  component: TableCell,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    column: { control: 'inline-radio', options: ['first', 'center', 'last'] },
    align: { control: 'inline-radio', options: ['left', 'center', 'right'] },
    weight: { control: 'inline-radio', options: ['normal', 'bold'] },
    row: { control: 'inline-radio', options: ['first', 'middle', 'last'] },
    hovered: { control: 'boolean' },
  },
  args: {
    children: 'Table Body Data',
  },
} satisfies Meta<typeof TableCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Bold: Story = {
  args: { weight: 'bold' },
};

export const Hovered: Story = {
  args: { hovered: true },
};

export const NumberRightAligned: Story = {
  args: { children: '123,456', align: 'right', column: 'center' },
};

export const FirstColumnWithCheckbox: Story = {
  args: {
    column: 'first',
    children: 'Product name',
    checkbox: <Checkbox size="sm" />,
  },
};

export const WithLeadingIcon: Story = {
  args: {
    children: 'Categorized item',
    leadingIcon: <Icon name="check" size={17} className="text-[color:var(--color-icon-secondary)]" />,
  },
};

export const WithTrailingIcon: Story = {
  args: {
    children: '12.5 kg',
    align: 'right',
    column: 'last',
    trailing: <Icon name="alert-triangle" size={17} className="text-[color:var(--color-sys-yellow-DEFAULT)]" />,
  },
};

export const LastRow: Story = {
  args: { row: 'last' },
};

/* ── Composite: a small table ────────────────────────── */
const Cell = ({ children, ...rest }: React.ComponentProps<typeof TableCell>) => (
  <td className="p-0">
    <TableCell {...rest}>{children}</TableCell>
  </td>
);

/* ── Inset variant ──────────────────────────────────── */

export const Inset: Story = {
  args: { inset: true, children: 'Inset cell value' },
};

export const InsetBold: Story = {
  args: { inset: true, weight: 'bold', children: 'Inset bold' },
};

export const InsetHovered: Story = {
  args: { inset: true, hovered: true, children: 'Inset hover' },
};

export const Selected: Story = {
  args: { selected: true, children: 'Selected row cell' },
};

/* ── Sub-row variant (Sales Channel "Today Sales" pattern) ── */

export const Subrow: Story = {
  args: { subrow: true, column: 'first', children: 'Awesome Store 1899' },
};

export const SubrowHovered: Story = {
  args: { subrow: true, hovered: true, column: 'first', children: 'Awesome Store 1899' },
};

/**
 * Center column with content geometrically centered (align='center').
 * `column` sets the left/right padding asymmetry; `align` decides
 * where content sits inside that padded zone.
 */
export const SubrowCenter: Story = {
  args: { subrow: true, column: 'center', align: 'center', children: '25' },
};

export const SubrowLast: Story = {
  args: { subrow: true, column: 'last', align: 'right', children: '10,000.00' },
};

export const SubrowSelected: Story = {
  args: {
    subrow: true,
    selected: true,
    column: 'first',
    children: 'Selected sub-row (selection still wins over subrow fill)',
  },
};

/**
 * Composite sub-row showing the full sub-row band as it appears in the
 * Sales Channel "Today Sales" expanded parent (s2 reference). Confirms
 * left/center/right column padding lines up across the row.
 *
 * Note: in real product use the sub-rows are preceded by an Inset Table
 * Sub-row Header band — see TableHeaderCell's SubheaderRow story for
 * that piece, and SubheaderWithSubrows below for the full s2 stack.
 */
export const SubrowComposite: Story = {
  render: () => (
    <table className="border-collapse w-full">
      <tbody>
        <tr>
          <Cell subrow column="first">Awesome Store 1899</Cell>
          <Cell subrow column="center" align="left">25</Cell>
          <Cell subrow column="last" align="right">10,000.00</Cell>
        </tr>
        <tr>
          <Cell subrow column="first">Super Hype</Cell>
          <Cell subrow column="center" align="left">5</Cell>
          <Cell subrow column="last" align="right">10,000.00</Cell>
        </tr>
      </tbody>
    </table>
  ),
};

/**
 * Full s2 reproduction: Inset Table Sub-row Header (Margin=Top) on top
 * of two sub-rows. Verifies that the sub-header's pt-8/pb-0 + the
 * sub-row's py-6 produce the right vertical rhythm — sub-row content
 * should align to the same x-position as the header label, with no
 * extra gap between the header band and the first sub-row.
 */
export const SubheaderWithSubrows: Story = {
  render: () => (
    <table className="border-collapse w-full">
      <thead>
        <tr>
          <th>
            <TableHeaderCell subheader column="first" align="left" label="Store" />
          </th>
          <th>
            <TableHeaderCell subheader column="center" align="left" label="Order" />
          </th>
          <th>
            <TableHeaderCell subheader column="last" align="right" label="Total (RM)" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <Cell subrow column="first">Awesome Store 1899</Cell>
          <Cell subrow column="center" align="left">25</Cell>
          <Cell subrow column="last" align="right">10,000.00</Cell>
        </tr>
        <tr>
          <Cell subrow column="first">Super Hype</Cell>
          <Cell subrow column="center" align="left">5</Cell>
          <Cell subrow column="last" align="right">10,000.00</Cell>
        </tr>
      </tbody>
    </table>
  ),
};

/* ── Multi-line content (Wallet Record / Imported List style) ── */

export const PrimarySecondary: Story = {
  args: {
    inset: true,
    column: 'first',
    children: (
      <span className="flex flex-col gap-[var(--spacing-2)]">
        <span className="font-[var(--font-weight-bold)]">Send SMS Usage</span>
        <span className="text-[length:var(--text-12)] leading-[var(--leading-15)] text-[color:var(--color-text-info)]">
          SMS Ref. CP13010263179835
        </span>
      </span>
    ),
  },
};

/* ── Content composition variants (Inset Table Row family) ── */

export const WithTagContent: Story = {
  args: {
    children: (
      <span className="inline-flex items-center gap-[var(--spacing-4)]">
        <Tag label="Tag Label" />
        <Pip type="warning" pipStyle="solid" label="Pip Text" />
      </span>
    ),
  },
};

export const WithInfoContent: Story = {
  args: {
    children: (
      <span className="inline-flex flex-col">
        <span className="text-[length:var(--text-14)] leading-[var(--leading-21)] text-[color:var(--table-body-text)]">
          Primary value
        </span>
        <span className="text-[length:var(--text-12)] leading-[var(--leading-15)] text-[color:var(--color-text-info)]">
          Secondary info
        </span>
      </span>
    ),
  },
};

export const WithExpandToggle: Story = {
  args: { column: 'last', align: 'right' },
  render: (args) => {
    const [expanded, setExpanded] = useState(false);
    return (
      <TableCell
        {...args}
        trailing={
          <TableExpandToggle expanded={expanded} onToggle={setExpanded} />
        }
      >
        Expandable row
      </TableCell>
    );
  },
};

/* ── Full table example ─────────────────────────────── */

export const FullTable: Story = {
  render: () => (
    <table className="border-collapse w-full">
      <thead>
        <tr>
          <th className="p-0" aria-sort={sortDirectionToAria(null, true)}>
            <TableHeaderCell column="first" align="left" label="Product" sortable checkbox={<Checkbox size="sm" />} />
          </th>
          <th className="p-0" aria-sort={sortDirectionToAria(null, true)}>
            <TableHeaderCell column="center" align="left" label="SKU" sortable />
          </th>
          <th className="p-0" aria-sort={sortDirectionToAria(null, true)}>
            <TableHeaderCell column="center" align="right" label="Stock" sortable />
          </th>
          <th className="p-0" aria-sort={sortDirectionToAria(null, true)}>
            <TableHeaderCell column="center" align="right" label="Price" sortable />
          </th>
          <th className="p-0">
            <TableHeaderCell column="last" align="left" label="Action" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <Cell column="first" align="left" weight="bold" checkbox={<Checkbox size="sm" />}>
            Wireless mouse
          </Cell>
          <Cell column="center" align="left">SKU-1042</Cell>
          <Cell column="center" align="right">128</Cell>
          <Cell column="center" align="right">RM 89.00</Cell>
          <Cell column="last" align="left">⋯</Cell>
        </tr>
        <tr>
          <Cell column="first" align="left" weight="bold" checkbox={<Checkbox size="sm" />}>
            USB-C Hub
          </Cell>
          <Cell column="center" align="left">SKU-2103</Cell>
          <Cell column="center" align="right">42</Cell>
          <Cell column="center" align="right">RM 159.00</Cell>
          <Cell column="last" align="left">⋯</Cell>
        </tr>
        <tr>
          <Cell column="first" align="left" weight="bold" row="last" checkbox={<Checkbox size="sm" />}>
            Mechanical keyboard
          </Cell>
          <Cell column="center" align="left" row="last">SKU-3088</Cell>
          <Cell column="center" align="right" row="last">7</Cell>
          <Cell column="center" align="right" row="last">RM 459.00</Cell>
          <Cell column="last" align="left" row="last">⋯</Cell>
        </tr>
      </tbody>
    </table>
  ),
};
