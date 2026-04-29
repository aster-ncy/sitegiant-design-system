import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableCell } from './TableCell';
import { TableHeaderCell, sortDirectionToAria } from '../TableHeaderCell';
import { Checkbox } from '../Checkbox';
import { Icon } from '../Icon';

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
    checkbox: <Checkbox />,
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

export const FullTable: Story = {
  render: () => (
    <table className="border-collapse w-full">
      <thead>
        <tr>
          <th className="p-0" aria-sort={sortDirectionToAria(null, true)}>
            <TableHeaderCell column="first" align="left" label="Product" sortable checkbox={<Checkbox />} />
          </th>
          <th className="p-0" aria-sort={sortDirectionToAria(null, true)}>
            <TableHeaderCell column="center" align="left" label="SKU" sortable />
          </th>
          <th className="p-0" aria-sort={sortDirectionToAria('desc', true)}>
            <TableHeaderCell column="center" align="right" label="Stock" sortable sortDirection="desc" />
          </th>
          <th className="p-0" aria-sort={sortDirectionToAria(null, true)}>
            <TableHeaderCell column="center" align="right" label="Price" sortable />
          </th>
          <th className="p-0">
            <TableHeaderCell column="last" type="icon" icon="menu-swap" iconAriaLabel="Sort" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <Cell column="first" align="left" weight="bold" checkbox={<Checkbox />}>
            Wireless mouse
          </Cell>
          <Cell column="center" align="left">SKU-1042</Cell>
          <Cell column="center" align="right">128</Cell>
          <Cell column="center" align="right">RM 89.00</Cell>
          <Cell column="last" align="right">⋯</Cell>
        </tr>
        <tr>
          <Cell column="first" align="left" weight="bold" checkbox={<Checkbox />}>
            USB-C Hub
          </Cell>
          <Cell column="center" align="left">SKU-2103</Cell>
          <Cell column="center" align="right">42</Cell>
          <Cell column="center" align="right">RM 159.00</Cell>
          <Cell column="last" align="right">⋯</Cell>
        </tr>
        <tr>
          <Cell column="first" align="left" weight="bold" row="last" checkbox={<Checkbox />}>
            Mechanical keyboard
          </Cell>
          <Cell column="center" align="left" row="last">SKU-3088</Cell>
          <Cell column="center" align="right" row="last">7</Cell>
          <Cell column="center" align="right" row="last">RM 459.00</Cell>
          <Cell column="last" align="right" row="last">⋯</Cell>
        </tr>
      </tbody>
    </table>
  ),
};
