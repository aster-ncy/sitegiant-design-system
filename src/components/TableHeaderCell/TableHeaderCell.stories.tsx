import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { TableHeaderCell } from './TableHeaderCell';
import { sortDirectionToAria } from './sortDirectionToAria';
import { Checkbox } from '../Checkbox';

type HeaderMode = 'default' | 'inset' | 'subrow';
type HeaderCellStoryArgs = React.ComponentProps<typeof TableHeaderCell> & {
  mode?: HeaderMode;
  withCheckbox?: boolean;
  withHint?: boolean;
};

const meta = {
  title: 'Tables/Table Atoms/Header Cell',
  component: TableHeaderCell,
  decorators: [
    (Story: () => ReactNode) => (
      <div className="flex items-center w-full min-h-[80px]">
        <div className="w-full"><Story /></div>
      </div>
    ),
  ],
  parameters: {
    layout: 'padded',
    controls: {
      sort: 'none',
      exclude: ['inset', 'type', 'checkbox', 'className', 'onSort', 'icon', 'iconAriaLabel', 'disabled'],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: { type: 'inline-radio' },
      options: ['default', 'inset', 'subrow'] satisfies ReadonlyArray<HeaderMode>,
      description: 'Storybook control for header mode. `inset` sets the inset prop; `subrow` sets inset + subheader.',
      table: { defaultValue: { summary: 'default' } },
    },
    type: { table: { disable: true } },
    column: { control: 'inline-radio', options: ['first', 'center', 'last'] },
    align: { control: 'inline-radio', options: ['left', 'center', 'right'] },
    sortDirection: {
      control: 'inline-radio',
      if: { arg: 'type', eq: 'default' },
      options: [null, 'asc', 'desc'],
    },
    sortable: {
      control: 'boolean',
      if: { arg: 'type', eq: 'default' },
    },
    checkbox: {
      control: false,
    },
    withCheckbox: {
      control: 'boolean',
      description: 'Storybook-only control. Shows the select-all checkbox in the first-column slot.',
      table: { defaultValue: { summary: 'false' } },
    },
    withHint: {
      control: 'boolean',
      if: { arg: 'type', eq: 'default' },
      description: 'Storybook-only control. Shows the warning hint beside the label.',
      table: { defaultValue: { summary: 'false' } },
    },
    subheader: {
      control: 'boolean',
      if: { arg: 'mode', eq: 'inset' },
      description: 'Sub-row header band (inset mode only). For subrow mode this is always on.',
    },
    label: {
      if: { arg: 'type', eq: 'default' },
      description: 'Header label.',
    },
    subheaderMargin: {
      control: { type: 'inline-radio' },
      if: { arg: 'mode', neq: 'default' },
      options: ['top', 'topBottom'],
    },
    hint: { table: { disable: true } },
    icon: { table: { disable: true } },
    iconAriaLabel: { table: { disable: true } },
    disabled: { table: { disable: true } },
  },
  args: {
    mode: 'default',
    type: 'default',
    label: 'Table Header Title',
    sortable: true,
    sortDirection: null,
    subheader: false,
    column: 'center',
    align: 'left',
    withCheckbox: false,
    withHint: false,
  },
  render: ({ mode = 'default', inset, withCheckbox, withHint, column, type, subheader, ...args }) => {
    const isInsetMode = mode === 'inset' || mode === 'subrow' || inset;
    const isSubheader = mode === 'subrow' || Boolean(isInsetMode && subheader);
    const showCheckbox = Boolean(withCheckbox && type !== 'icon');
    const showHint = Boolean(withHint && type !== 'icon');

    return (
      <TableHeaderCell
        {...args}
        type={type}
        column={column}
        inset={isInsetMode}
        subheader={isSubheader}
        checkbox={showCheckbox ? <Checkbox size="sm" /> : undefined}
        hint={showHint ? { count: 3, label: 'warning' } : undefined}
      />
    );
  },
} satisfies Meta<HeaderCellStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const headerColumns = ['first', 'center', 'last'] as const;
const headerAlignments = ['left', 'center', 'right'] as const;
const subheaderMargins = ['top', 'topBottom'] as const;
const fullHeaderRowCellClass = '!min-h-[calc(var(--leading-21)+var(--spacing-40))]';
const insetHeaderRowCellClass = '!min-h-[calc(var(--leading-21)+var(--spacing-16))]';

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

export const Playground: Story = {
  args: {
    mode: 'default',
    type: 'default',
    column: 'center',
    align: 'left',
    label: 'Table Header Title',
    sortable: true,
    sortDirection: null,
    subheader: false,
    withCheckbox: false,
    withHint: false,
  },
};

/**
 * Figma parity matrix for Table Header (969:1728 / 954:735).
 * Keep this as a reference surface for all column/alignment states.
 */
export const DefaultMatrix: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-16)]">
      <HeaderMatrixNote>
        Visual check only. Use Playground for single-cell recipes or DefaultHeaderRow for copyable product code.
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

/**
 * Figma parity matrix: use this to check inset header visual variants
 * across column position and text alignment. Do not copy this full story
 * into product code.
 */
export const InsetMatrix: Story = {
  parameters: {
    controls: { disable: true },
  },
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
 * Figma parity matrix: use this to check sub-row header visual variants
 * across margin mode, column position, and text alignment. Subheader is
 * only for inset tables: use `inset` together with `subheader` when
 * copying a sub-row header into product code.
 */
export const SubheaderMatrix: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-24)]">
      <HeaderMatrixNote>
        Subheader is only for inset tables. Use it as an inset table sub-row header by passing both `inset` and
        `subheader`.
      </HeaderMatrixNote>
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
                        inset
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
 * Copyable default table header row recipe.
 * Confirms regular header sizing, select-all checkbox, sorted text column,
 * unsorted text columns, and the last-column icon action.
 */
export const DefaultHeaderRow: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <table className="border-collapse w-full">
      <thead>
        <tr>
          <th aria-sort={sortDirectionToAria(null, true)}>
            <TableHeaderCell
              column="first"
              align="left"
              label="Product"
              sortable
              checkbox={<Checkbox size="sm" />}
              className={fullHeaderRowCellClass}
            />
          </th>
          <th aria-sort={sortDirectionToAria(null, true)}>
            <TableHeaderCell
              column="center"
              align="left"
              label="SKU"
              sortable
              className={fullHeaderRowCellClass}
            />
          </th>
          <th aria-sort={sortDirectionToAria('desc', true)}>
            <TableHeaderCell
              column="center"
              align="right"
              label="Stock"
              sortable
              sortDirection="desc"
              className={fullHeaderRowCellClass}
            />
          </th>
          <th aria-sort={sortDirectionToAria(null, true)}>
            <TableHeaderCell
              column="center"
              align="right"
              label="Price"
              sortable
              className={fullHeaderRowCellClass}
            />
          </th>
          <th>
            <TableHeaderCell
              column="last"
              type="icon"
              icon="sliders"
              iconAriaLabel="Table options"
              className={fullHeaderRowCellClass}
            />
          </th>
        </tr>
      </thead>
    </table>
  ),
};

export const InsetHeaderRow: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <table className="border-collapse w-full">
      <thead>
        <tr>
          <th aria-sort={sortDirectionToAria(null, true)}>
            <TableHeaderCell
              inset
              column="first"
              align="left"
              label="Item"
              sortable
              checkbox={<Checkbox size="sm" />}
              className={insetHeaderRowCellClass}
            />
          </th>
          <th aria-sort={sortDirectionToAria(null, true)}>
            <TableHeaderCell
              inset
              column="center"
              align="left"
              label="Variant"
              sortable
              className={insetHeaderRowCellClass}
            />
          </th>
          <th aria-sort={sortDirectionToAria('asc', true)}>
            <TableHeaderCell
              inset
              column="last"
              align="right"
              label="Quantity"
              sortable
              sortDirection="asc"
              className={insetHeaderRowCellClass}
            />
          </th>
        </tr>
      </thead>
    </table>
  ),
};

/**
 * Copyable inset-table sub-header row recipe.
 * Subheader rows are only for inset tables and suppress sort affordances.
 */
export const SubheaderRow: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <table className="border-collapse w-full">
      <thead>
        <tr>
          <th aria-sort={sortDirectionToAria(null, true)}>
            <TableHeaderCell inset subheader column="first" align="left" label="Store" sortable />
          </th>
          <th>
            <TableHeaderCell inset subheader column="center" align="left" label="Order" />
          </th>
          <th>
            <TableHeaderCell inset subheader column="last" align="right" label="Total (RM)" />
          </th>
        </tr>
      </thead>
    </table>
  ),
};
