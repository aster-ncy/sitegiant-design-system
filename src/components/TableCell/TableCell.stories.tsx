import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableCell } from './TableCell';
import { TableCellInfo } from './TableCellInfo';
import { TableCellMainSub } from './TableCellMainSub';
import { TableCellListing } from './TableCellListing';
import { useState } from 'react';
import { TableHeaderCell, sortDirectionToAria } from '../TableHeaderCell';
import { Checkbox } from '../Checkbox';
import { Icon } from '../Icon';
import { Tag } from '../Tag';
import { Pip } from '../Pip';
import { TableExpandToggle } from '../TableExpandToggle';
import { ProductImage } from '../ProductImageList/ProductImage';
import sitegiantWebstore from '../../assets/channel-icons/sitegiant-webstore.png';

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

/* ── TableCellInfo content variant (Figma Inset Table Row - Info, 1298:1893) ── */

/**
 * s1 single-line label + body. Figma: alignment=Horizontal, statusCount=1,
 * paragraphCount=1.
 */
export const InfoSingleLine: Story = {
  args: {
    inset: true,
    column: 'first',
    children: (
      <TableCellInfo
        statuses={[{ label: 'Order ID', body: 'INV-878973829' }]}
      />
    ),
  },
};

/**
 * s8 multi-status pattern (Order ID + COID style). Figma: alignment=Horizontal,
 * statusCount=2, paragraphCount=1. Labels stretch to match each body row.
 */
export const InfoMultiStatus: Story = {
  args: {
    inset: true,
    column: 'first',
    children: (
      <TableCellInfo
        statuses={[
          { label: 'Order ID', body: 'INV-878973829' },
          { label: 'COID', body: '36386598983784' },
        ]}
      />
    ),
  },
};

/**
 * s6 vertical alignment — label sits above its body. Figma: alignment=Vertical,
 * statusCount=1, paragraphCount=1.
 */
export const InfoVertical: Story = {
  args: {
    inset: true,
    column: 'first',
    children: (
      <TableCellInfo
        alignment="vertical"
        statuses={[{ label: 'Reference No.', body: 'CP13010263179835' }]}
      />
    ),
  },
};

/**
 * Worst-case multi-status × multi-paragraph: each row's label should
 * vertically align with its body row. Confirms the two-column geometry
 * holds when label height (1 line) is shorter than body height (N lines).
 */
export const InfoMultiStatusMultiParagraph: Story = {
  args: {
    inset: true,
    column: 'first',
    children: (
      <TableCellInfo
        statuses={[
          {
            label: 'Pickup',
            body: ['Block A, Level 12, Tower 3', 'Jalan Equine Park'],
          },
          {
            label: 'Dropoff',
            body: ['Lot 7, Bandar Sunway', '47500 Petaling Jaya'],
          },
        ]}
      />
    ),
  },
};

/**
 * Vertical alignment, multi-status. Figma: alignment=Vertical, statusCount=2,
 * paragraphCount=1. Each (label above body) block stacks with gap-4 between.
 */
export const InfoVerticalMultiStatus: Story = {
  args: {
    inset: true,
    column: 'first',
    children: (
      <TableCellInfo
        alignment="vertical"
        statuses={[
          { label: 'Pickup', body: 'Block A, Level 12, Tower 3' },
          { label: 'Dropoff', body: 'Lot 7, Bandar Sunway' },
        ]}
      />
    ),
  },
};

/**
 * Vertical alignment, multi-paragraph body. Figma: alignment=Vertical,
 * statusCount=1, paragraphCount=3.
 */
export const InfoVerticalMultiParagraph: Story = {
  args: {
    inset: true,
    column: 'first',
    children: (
      <TableCellInfo
        alignment="vertical"
        statuses={[
          {
            label: 'Address',
            body: [
              'Block A, Level 12, Tower 3',
              'Jalan Equine Park, Sri Kembangan',
              '43300 Selangor, Malaysia',
            ],
          },
        ]}
      />
    ),
  },
};

/**
 * Multi-paragraph body — Figma: paragraphCount=3. Each paragraph is a wrapped
 * line; the label stays vertically centred against the first row in horizontal
 * alignment.
 */
export const InfoMultiParagraph: Story = {
  args: {
    inset: true,
    column: 'first',
    children: (
      <TableCellInfo
        statuses={[
          {
            label: 'Address',
            body: [
              'Block A, Level 12, Tower 3',
              'Jalan Equine Park, Sri Kembangan',
              '43300 Selangor, Malaysia',
            ],
          },
        ]}
      />
    ),
  },
};

/* ── TableCellMainSub content variant (Figma Inset Table Row - MainSub, 2121:9632) ── */

/**
 * Default MainSub: caption label + 14/17 main value above caption label +
 * 12/17 secondary sub value. Figma: Type=Default.
 */
export const MainSub: Story = {
  args: {
    inset: true,
    column: 'first',
    children: (
      <TableCellMainSub
        mainLabel="Total"
        mainValue="RM 10,250.00"
        subLabel="Tax"
        subValue="RM 615.00"
      />
    ),
  },
};

/**
 * Main Bold variant — Figma Type=Main Bold. Bolds the main value to draw
 * attention; sub line stays regular. Mirrors the s8 Select Package row's
 * tracking-number-with-meta pattern.
 */
export const MainSubBold: Story = {
  args: {
    inset: true,
    column: 'first',
    children: (
      <TableCellMainSub
        mainBold
        mainLabel="Tracking"
        mainValue="MY984746382"
        subLabel="Order"
        subValue="878973829"
      />
    ),
  },
};

/**
 * No labels — just main value above sub value. Useful when the column
 * header already names the field.
 */
export const MainSubLabelless: Story = {
  args: {
    inset: true,
    column: 'first',
    children: (
      <TableCellMainSub
        mainBold
        mainValue="MY984746382"
        subValue="878973829"
      />
    ),
  },
};

/* ── TableCellListing content variant (Figma Inset Table Row - Listing, 1262:9692) ── */

/**
 * Single-line product listing — image, status pip, bold name, two info
 * rows (iSKU/SKU), and an extras row (channel + more-skus link). Uses
 * `column='first'` with the s9 padding override (`!pl-12`) per Figma
 * 1248:8395; center-column listings drop the override.
 */
export const Listing: Story = {
  args: {
    inset: true,
    column: 'first',
    className: '!pl-[var(--spacing-12)]',
    children: (
      <TableCellListing
        checkbox={<Checkbox size="sm" />}
        image={<ProductImage size="lg" />}
        tag={<Pip type="success" pipStyle="default" label="Published" />}
        productName="DYNAMO 4in1 Laundry Capsules Fresh 10ml 52pcs"
        infoRows={[
          { label: 'iSKU', value: 'ISKU-LDC-240321-MY-0001' },
          { label: 'SKU', value: 'DYN-4IN1-FRESH-10ML52' },
        ]}
        extras={
          <>
            <span className="inline-flex items-center gap-[var(--spacing-4)] text-[length:var(--general-caption-size)] leading-[var(--leading-15)] text-[color:var(--color-text-primary)]">
              <img
                src={sitegiantWebstore}
                alt=""
                aria-hidden="true"
                width={15}
                height={15}
                className="shrink-0 block rounded-[var(--radius-4)]"
              />
              Webstore
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-[var(--spacing-2)] text-[length:var(--general-caption-size)] leading-[var(--leading-15)] text-[color:var(--text-link-basic-default)] cursor-pointer"
            >
              <Icon name="plus-square" size={15} />
              5 more SKUs
            </button>
          </>
        }
      />
    ),
  },
};

/**
 * Center column variant of the same listing — drops the `!pl-12` override
 * since the cell already has center-column padding.
 */
export const ListingCenter: Story = {
  args: {
    inset: true,
    column: 'center',
    children: (
      <TableCellListing
        image={<ProductImage size="lg" />}
        tag={<Pip type="success" pipStyle="default" label="Published" />}
        productName="DYNAMO 4in1 Laundry Capsules Fresh 10ml 52pcs"
        infoRows={[
          { label: 'iSKU', value: 'ISKU-LDC-240321-MY-0001' },
          { label: 'SKU', value: 'DYN-4IN1-FRESH-10ML52' },
        ]}
      />
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
    <table className="border-collapse w-full table-fixed">
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
