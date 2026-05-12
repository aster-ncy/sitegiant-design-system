import { useEffect, useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableExpandToggle } from './TableExpandToggle';
import { TableCell } from '../TableCell';

type ExpandToggleMode = 'collapse' | 'expand';
type TableExpandToggleStoryArgs = ComponentProps<typeof TableExpandToggle> & {
  mode: ExpandToggleMode;
};

const meta = {
  title: 'Tables/Table Atoms/Expand Toggle',
  component: TableExpandToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A compact blue chevron button for expanding or collapsing an inset table row.',
          '',
          'Use it inside `TableCell`, usually in the trailing cell. For the full row composition, use the Body Cell expandable-row recipe.',
          '',
          'Typical usage: `<TableExpandToggle expanded={expanded} onToggle={setExpanded} ariaControls="order-subrows" />`',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: { type: 'inline-radio' },
      options: ['collapse', 'expand'] satisfies ReadonlyArray<ExpandToggleMode>,
      description: 'Storybook control for the toggle state.',
      table: { category: 'State', defaultValue: { summary: 'collapse' } },
    },
    expanded: { table: { disable: true } },
    onToggle: { table: { disable: true } },
    ariaControls: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: { expanded: false, mode: 'collapse' },
  render: ({ mode, ...args }) => (
    <TableExpandToggle {...args} expanded={mode === 'expand'} />
  ),
} satisfies Meta<TableExpandToggleStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const [open, setOpen] = useState(args.mode === 'expand');

    useEffect(() => {
      setOpen(args.mode === 'expand');
    }, [args.mode]);

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
export const Matrix: Story = {
  parameters: {
    controls: { disable: true },
  },
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
