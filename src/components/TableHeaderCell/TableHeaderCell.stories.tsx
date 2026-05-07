import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
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

const headerColumns = ['first', 'center', 'last'] as const;
const headerAlignments = ['left', 'center', 'right'] as const;
const subheaderMargins = ['top', 'topBottom'] as const;

const HeaderMatrixLabel = ({ children }: { children: ReactNode }) => (
  <span className="text-[length:var(--text-12)] leading-[var(--leading-15)] text-[color:var(--color-text-info)]">
    {children}
  </span>
);

const HeaderMatrixNote = ({ children }: { children: ReactNode }) => (
  <p className="max-w-[720px] text-[length:var(--text-12)] leading-[var(--leading-17)] text-[color:var(--color-text-info)]">
    {children}
  </p>
);

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

/**
 * Copyable recipe: use this to try one inset table header cell with
 * Storybook controls.
 */
export const InsetPlayground: Story = {
  args: {
    inset: true,
    column: 'first',
    align: 'left',
    label: 'Column',
    sortable: true,
    sortDirection: null,
  },
};

/**
 * Figma parity matrix: use this to check inset header visual variants
 * across column position and text alignment. Do not copy this full story
 * into product code.
 */
export const InsetMatrix: Story = {
  render: () => (
    <table className="border-collapse table-fixed w-[720px]">
      <thead>
        <tr>
          <th className="p-0 w-[96px]" />
          {headerColumns.map((column) => (
            <th key={column} className="p-0">
              <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left">
                <HeaderMatrixLabel>{column} column</HeaderMatrixLabel>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {headerAlignments.map((align) => (
          <tr key={align}>
            <td className="p-0 align-top">
              <div className="px-[var(--spacing-6)] py-[var(--spacing-8)]">
                <HeaderMatrixLabel>{align} aligned</HeaderMatrixLabel>
              </div>
            </td>
            {headerColumns.map((column) => (
              <th key={column} className="p-0">
                <TableHeaderCell
                  inset
                  column={column}
                  align={align}
                  label="Inset Header Title"
                  sortable={false}
                />
              </th>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/**
 * Copyable recipe: use this when the first inset table header column
 * needs a text label.
 */
export const InsetFirstColumn: Story = {
  args: { inset: true, column: 'first', label: 'Column' },
};

/**
 * Copyable recipe: use this when the first inset table header column
 * needs a select-all checkbox.
 */
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
 * (e.g. Sales Channel "Today Sales" pattern). Subrow grey fill, no
 * corner radii, sort affordance suppressed. Default `subheaderMargin`
 * is `'top'` (pt-8 only) — the sub-row beneath provides the bottom
 * gap via its own py-6.
 */
export const Subheader: Story = {
  args: {
    subheader: true,
    column: 'first',
    label: 'Store',
  },
};

/**
 * Standalone sub-header (Margin=Top&Bottom mode, Figma 2908:13399).
 * Use when the band stands on its own with no sub-rows immediately
 * beneath it, so the bottom padding has to come from the band itself.
 */
export const SubheaderStandalone: Story = {
  args: {
    subheader: true,
    subheaderMargin: 'topBottom',
    column: 'first',
    label: 'Store',
  },
};

/**
 * Figma parity matrix: use this to check sub-row header visual variants
 * across margin mode, column position, and text alignment. Do not copy
 * this full story into product code.
 */
export const SubheaderMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-24)]">
      {subheaderMargins.map((margin) => (
        <div key={margin} className="flex flex-col gap-[var(--spacing-8)]">
          <HeaderMatrixLabel>
            Margin: {margin === 'topBottom' ? 'Top & Bottom' : 'Top'}
          </HeaderMatrixLabel>
          <table className="border-collapse table-fixed w-[720px]">
            <thead>
              <tr>
                <th className="p-0 w-[96px]" />
                {headerColumns.map((column) => (
                  <th key={column} className="p-0">
                    <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left">
                      <HeaderMatrixLabel>{column} column</HeaderMatrixLabel>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {headerAlignments.map((align) => (
                <tr key={align}>
                  <td className="p-0 align-top">
                    <div className="px-[var(--spacing-6)] py-[var(--spacing-8)]">
                      <HeaderMatrixLabel>{align} aligned</HeaderMatrixLabel>
                    </div>
                  </td>
                  {headerColumns.map((column) => (
                    <th key={column} className="p-0">
                      <TableHeaderCell
                        subheader
                        subheaderMargin={margin}
                        column={column}
                        align={align}
                        label="Sub-row Header Title"
                      />
                    </th>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  ),
};

/**
 * Composite sub-header band reproducing the s2 Sales Channel pattern.
 * Confirms (a) all three column positions render with the grey subrow
 * fill, (b) no rounded corners on either edge (sub-headers sit between
 * rows, not at the table edge), (c) sort affordances are suppressed
 * even if `sortable` is passed — the chevron should NOT appear on the
 * "Store" column even though sortable=true, (d) Order is left-aligned
 * and Total (RM) is right-aligned, matching s2.
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
            <TableHeaderCell subheader column="center" align="left" label="Order" />
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
    icon: 'sliders',
    iconAriaLabel: 'Table options',
  },
};

/* ── Composite: a full header row ────────────────────── */
/**
 * Figma parity matrix for Table Header (969:1728 / 954:735).
 * This node was already represented by the individual column/alignment
 * stories above; keep those smaller stories for copyable product code.
 */
export const DefaultMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-16)]">
      <HeaderMatrixNote>
        Visual check only. Use the individual column/alignment stories or FullHeaderRow for copyable product code.
      </HeaderMatrixNote>
      <table className="border-collapse table-fixed w-[760px]">
        <thead>
          <tr>
            <th className="p-0 w-[112px]" />
            {headerColumns.map((column) => (
              <th key={column} className="p-0">
                <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left">
                  <HeaderMatrixLabel>{column} column</HeaderMatrixLabel>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {headerAlignments.map((align) => (
            <tr key={align}>
              <td className="p-0 align-top">
                <div className="px-[var(--spacing-6)] py-[var(--spacing-20)]">
                  <HeaderMatrixLabel>{align} aligned</HeaderMatrixLabel>
                </div>
              </td>
              {headerColumns.map((column) => (
                <th key={column} className="p-0">
                  <TableHeaderCell
                    column={column}
                    align={align}
                    label="Table Header Title"
                    sortable
                  />
                </th>
              ))}
            </tr>
          ))}
          <tr>
            <td className="p-0 align-top">
              <div className="px-[var(--spacing-6)] py-[var(--spacing-20)]">
                <HeaderMatrixLabel>icon</HeaderMatrixLabel>
              </div>
            </td>
            <th className="p-0" />
            <th className="p-0" />
            <th className="p-0">
              <TableHeaderCell
                type="icon"
                column="last"
                align="right"
                icon="sliders"
                iconAriaLabel="Table options"
              />
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

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
            <TableHeaderCell column="last" type="icon" icon="sliders" iconAriaLabel="Table options" />
          </th>
        </tr>
      </thead>
    </table>
  ),
};
