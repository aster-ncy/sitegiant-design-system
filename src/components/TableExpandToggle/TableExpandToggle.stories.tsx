import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableExpandToggle } from './TableExpandToggle';
import { TableCell } from '../TableCell';

const meta = {
  title: 'Tables/TableExpandToggle',
  component: TableExpandToggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { expanded: false },
} satisfies Meta<typeof TableExpandToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {};

export const Expanded: Story = { args: { expanded: true } };

export const Interactive: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <TableExpandToggle {...args} expanded={open} onToggle={setOpen} />
    );
  },
};

/**
 * Figma parity matrix: use this to check expand/collapse trigger cells
 * inside inset table rows. Do not copy this full story into product code;
 * copy the TableCell + TableExpandToggle composition from TableCell's
 * InsetExpandable story instead.
 */
export const InsetRowMatrix: Story = {
  render: () => (
    <table className="border-collapse table-fixed w-[360px]">
      <thead>
        <tr>
          <th className="p-0">
            <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left text-[length:var(--text-12)] leading-[var(--leading-15)] text-[color:var(--color-text-info)]">
              Default / collapse
            </div>
          </th>
          <th className="p-0">
            <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left text-[length:var(--text-12)] leading-[var(--leading-15)] text-[color:var(--color-text-info)]">
              Last row / collapse
            </div>
          </th>
          <th className="p-0">
            <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left text-[length:var(--text-12)] leading-[var(--leading-15)] text-[color:var(--color-text-info)]">
              Default / expand
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-0">
            <TableCell inset column="center" align="center">
              <TableExpandToggle expanded={false} />
            </TableCell>
          </td>
          <td className="p-0">
            <TableCell inset row="last" column="center" align="center">
              <TableExpandToggle expanded={false} />
            </TableCell>
          </td>
          <td className="p-0">
            <TableCell inset column="center" align="center">
              <TableExpandToggle expanded />
            </TableCell>
          </td>
        </tr>
      </tbody>
    </table>
  ),
};
