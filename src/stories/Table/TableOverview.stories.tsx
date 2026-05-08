import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  Checkbox,
  Icon,
  IconLink,
  NumberInput,
  Pip,
  PrefixInput,
  ProductImage,
  TableCardCell,
  TableCell,
  TableCellListing,
  TableExpandToggle,
  TableHeaderCell,
  TableSelectionBar,
  TextLink,
} from '../../components';
import { RecordTableActionCell } from '../../components/RecordTable/RecordTableActionCell';
import { RecordTableHeaderCell } from '../../components/RecordTable/RecordTableHeaderCell';
import { RecordTableListingCell } from '../../components/RecordTable/RecordTableListingCell';
import productImage from '../../assets/product-images/product-1.png';
import shopeeIcon from '../../assets/channel-icons/shopee.png';

const meta = {
  title: 'Tables/Table',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Developer-facing table entry point. Start here for common table recipes, then use the lower-level Table Atoms pages when you need to tune individual cells.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const pageShell = 'flex max-w-[1040px] flex-col gap-[var(--spacing-24)]';
const sectionShell = 'flex flex-col gap-[var(--spacing-12)]';
const headingClass = 'text-[length:var(--text-16)] leading-[var(--leading-24)] font-[var(--font-weight-bold)] text-[color:var(--color-text-primary)]';
const bodyClass = 'text-[length:var(--text-14)] leading-[var(--leading-21)] text-[color:var(--color-text-info)]';
const noteClass = 'text-[length:var(--text-12)] leading-[var(--leading-17)] text-[color:var(--color-text-info)]';
const tableShell = 'overflow-hidden rounded-[var(--radius-12)] border border-solid border-[var(--table-divider-border)]';
const rowDividerCellClass = 'border-b border-solid border-[var(--table-divider-border)]';
const insetRowDividerCellClass = 'border-b border-solid border-[var(--table-divider-lighter-border)]';
const recordHeaderBorderClass = '[border-width:1px_1px_1px_0]';
const recordBodyBorderClass = '[border-width:0_1px_1px_0]';
const recordFirstColumnBorderClass = '[border-left-width:1px]';

const GuidanceRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="grid grid-cols-[160px_1fr] gap-[var(--spacing-16)] border-b border-solid border-[var(--table-divider-border)] py-[var(--spacing-8)] last:border-b-0">
    <span className="font-[var(--font-weight-bold)] text-[length:var(--text-14)] leading-[var(--leading-21)] text-[color:var(--color-text-primary)]">
      {label}
    </span>
    <span className={bodyClass}>{children}</span>
  </div>
);

const ProductThumb = () => (
  <ProductImage src={productImage} alt="Product" size="md" />
);

const ChannelIcon = () => (
  <img
    src={shopeeIcon}
    alt="Shopee"
    className="size-[21px] shrink-0 rounded-[var(--radius-4)] object-cover"
  />
);

const BasicTableDemo = () => (
  <div className={tableShell}>
    <table className="w-full table-fixed border-separate border-spacing-0">
      <thead>
        <tr>
          <th className="w-[38%] p-0" aria-sort="none">
            <TableHeaderCell column="first" label="Product" sortable />
          </th>
          <th className="w-[22%] p-0" aria-sort="none">
            <TableHeaderCell label="Channel" sortable />
          </th>
          <th className="w-[18%] p-0" aria-sort="none">
            <TableHeaderCell align="center" label="Stock" sortable />
          </th>
          <th className="w-[22%] p-0">
            <TableHeaderCell column="last" align="left" label="Action" sortable={false} />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="group/row hover:[&_td]:bg-[var(--table-body-hover-fill)] hover:[&_td>div]:bg-[var(--table-body-hover-fill)]">
          <td className={`p-0 ${rowDividerCellClass}`}>
            <TableCell column="first" boldOnRowHover className="shadow-none">
              Dynamo Laundry Capsules
            </TableCell>
          </td>
          <td className={`p-0 ${rowDividerCellClass}`}>
            <TableCell leadingIcon={<ChannelIcon />} className="shadow-none">Shopee MY</TableCell>
          </td>
          <td className={`p-0 ${rowDividerCellClass}`}>
            <TableCell align="center" tone="success" className="shadow-none">
              240
            </TableCell>
          </td>
          <td className={`p-0 ${rowDividerCellClass}`}>
            <TableCell
              column="last"
              align="left"
              className="shadow-none"
            >
              <TextLink label="Edit" iconPosition="left" icon={<Icon name="edit-pen" size={17} />} />
            </TableCell>
          </td>
        </tr>
        <tr className="group/row hover:[&_td]:bg-[var(--table-body-hover-fill)] hover:[&_td>div]:bg-[var(--table-body-hover-fill)]">
          <td className="p-0">
            <TableCell column="first" row="last" boldOnRowHover>
              Flash Sale Bundle
            </TableCell>
          </td>
          <td className="p-0">
            <TableCell row="last" leadingIcon={<ChannelIcon />}>Shopee MY</TableCell>
          </td>
          <td className="p-0">
            <TableCell row="last" align="center" tone="danger">
              8
            </TableCell>
          </td>
          <td className="p-0">
            <TableCell
              row="last"
              column="last"
              align="left"
            >
              <TextLink label="Edit" iconPosition="left" icon={<Icon name="edit-pen" size={17} />} />
            </TableCell>
          </td>
        </tr>
        <tr aria-hidden="true">
          <td colSpan={4} className="h-[20px] p-0" />
        </tr>
      </tbody>
    </table>
  </div>
);

const SelectionTableDemo = () => (
  <div className={tableShell}>
    <TableSelectionBar
      checkbox={<Checkbox size="sm" indeterminate />}
      selectedCount={2}
      actions={[
        { key: 'print', label: 'Print' },
        {
          key: 'more',
          label: 'More Action',
          menuItems: [
            { key: 'export', label: 'Export' },
            { key: 'archive', label: 'Archive' },
          ],
        },
      ]}
      onDelete={() => undefined}
    />
    <table className="w-full table-fixed border-separate border-spacing-0">
      <tbody>
        {['Dynamo Laundry Capsules', 'Flash Sale Bundle'].map((name, index) => (
          <tr key={name}>
            <td className="w-[48%] p-0">
              <TableCell
                column="first"
                selected
                row={index === 1 ? 'last' : 'middle'}
                checkbox={<Checkbox size="sm" checked />}
              >
                {name}
              </TableCell>
            </td>
            <td className="w-[28%] p-0">
              <TableCell selected row={index === 1 ? 'last' : 'middle'}>
                Selected row
              </TableCell>
            </td>
            <td className="w-[24%] p-0">
              <TableCell selected column="last" row={index === 1 ? 'last' : 'middle'} align="right">
                Ready
              </TableCell>
            </td>
          </tr>
        ))}
        <tr aria-hidden="true">
          <td colSpan={3} className="h-[20px] p-0" />
        </tr>
      </tbody>
    </table>
  </div>
);

const ActionLinksDemo = () => (
  <div className={tableShell}>
    <table className="w-full table-fixed border-separate border-spacing-0">
      <tbody>
        <tr>
          <td className={`w-[42%] p-0 ${rowDividerCellClass}`}>
            <TableCell column="first" className="shadow-none">Inventory Update</TableCell>
          </td>
          <td className={`w-[34%] p-0 ${rowDividerCellClass}`}>
            <TableCell className="shadow-none">
              <div className="flex flex-col items-start gap-[var(--spacing-4)]">
                <div className="flex items-start py-[var(--spacing-2)]">
                  <TextLink label="Edit" iconPosition="left" icon={<Icon name="edit-pen" size={17} />} />
                </div>
                <div className="flex items-start py-[var(--spacing-2)]">
                  <TextLink label="View detail" iconPosition="left" icon={<Icon name="external-link" size={17} />} />
                </div>
              </div>
            </TableCell>
          </td>
          <td className={`w-[24%] p-0 ${rowDividerCellClass}`}>
            <TableCell
              column="last"
              className="shadow-none"
              trailing={
                <div className="flex items-center gap-[var(--spacing-6)]">
                  <IconLink
                    icon="edit"
                    aria-label="Edit"
                    showTooltip={false}
                    className={[
                      'inline-flex h-[33px] w-[33px] shrink-0 items-center justify-center rounded-[var(--radius-120)] p-[var(--spacing-8)]',
                      'text-[color:var(--icon-link-basic-default)] hover:text-[color:var(--icon-link-basic-hover)] active:text-[color:var(--icon-link-basic-clicked)]',
                      'cursor-pointer transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--button-primary-default-fill)]',
                    ].join(' ')}
                  />
                  <IconLink
                    icon="trash"
                    aria-label="Delete"
                    showTooltip={false}
                    variant="danger"
                    className={[
                      'inline-flex h-[33px] w-[33px] shrink-0 items-center justify-center rounded-[var(--radius-120)] p-[var(--spacing-8)]',
                      'text-[color:var(--icon-link-danger-default)] hover:text-[color:var(--icon-link-danger-hover)] active:text-[color:var(--icon-link-danger-clicked)]',
                      'cursor-pointer transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--button-primary-default-fill)]',
                    ].join(' ')}
                  />
                </div>
              }
            />
          </td>
        </tr>
        <tr aria-hidden="true">
          <td colSpan={3} className="h-[20px] p-0" />
        </tr>
      </tbody>
    </table>
  </div>
);

const ExpandableRowsDemo = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="overflow-hidden">
      <table className="w-full table-fixed border-separate border-spacing-0">
        <tbody>
          <tr>
            <td className={`w-[48%] p-0 ${expanded ? '' : rowDividerCellClass}`}>
              <TableCell inset column="first" weight="bold" className="shadow-none">
                Shopee MY
              </TableCell>
            </td>
            <td className={`w-[34%] p-0 ${expanded ? '' : rowDividerCellClass}`}>
              <TableCell inset align="right" className="shadow-none">
                RM 2,450.00
              </TableCell>
            </td>
            <td className={`w-[18%] p-0 ${expanded ? '' : rowDividerCellClass}`}>
              <TableCell
                inset
                column="last"
                align="right"
                className="shadow-none"
                trailing={<TableExpandToggle expanded={expanded} onToggle={setExpanded} />}
              />
            </td>
          </tr>
          {expanded && (
            <>
              <tr>
                <td className="p-0">
                  <TableHeaderCell subheader column="first" label="Store" />
                </td>
                <td className="p-0">
                  <TableHeaderCell subheader align="right" label="Sales" />
                </td>
                <td className="p-0">
                  <TableHeaderCell subheader column="last" align="right" label="Orders" />
                </td>
              </tr>
              <tr>
                <td className="p-0">
                  <TableCell subrow column="first" leadingIcon={<ChannelIcon />}>
                    Main Store
                  </TableCell>
                </td>
                <td className="p-0">
                  <TableCell subrow align="right" tone="success">
                    RM 1,240.00
                  </TableCell>
                </td>
                <td className="p-0">
                  <TableCell subrow column="last" align="right">
                    18
                  </TableCell>
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

const insetTableRows = [
  { trackingNo: '220126-001', status: 'Ready' },
  { trackingNo: '220126-002', status: 'Ready' },
] as const;

const InsetTableDemo = () => (
  <div className="inline-block">
    <table className="w-[720px] table-fixed border-separate border-spacing-0">
      <thead>
        <tr>
          <th className="w-[42%] p-0">
            <TableHeaderCell inset column="first" label="Tracking No." sortable />
          </th>
          <th className="w-[34%] p-0">
            <TableHeaderCell inset label="Status" sortable />
          </th>
          <th className="w-[24%] p-0">
            <TableHeaderCell inset column="last" align="left" label="Action" sortable={false} />
          </th>
        </tr>
      </thead>
      <tbody>
        {insetTableRows.map((row, index) => {
          const isLastRow = index === insetTableRows.length - 1;
          const dividerClass = isLastRow ? 'border-b border-solid border-[var(--table-divider-last-border)]' : insetRowDividerCellClass;

          return (
            <tr key={row.trackingNo} className="group/row hover:[&_td]:bg-[var(--table-inset-body-hover-fill)] hover:[&_td>div]:bg-[var(--table-inset-body-hover-fill)]">
              <td className={`p-0 ${dividerClass}`}>
                <TableCell inset column="first" checkbox={<Checkbox size="sm" />} boldOnRowHover className="shadow-none">
                  {row.trackingNo}
                </TableCell>
              </td>
              <td className={`p-0 ${dividerClass}`}>
                <TableCell inset className="shadow-none">
                  <Pip type="success" label={row.status} />
                </TableCell>
              </td>
              <td className={`p-0 ${dividerClass}`}>
                <TableCell inset column="last" align="left" className="shadow-none">
                  <TextLink label="Edit" iconPosition="left" icon={<Icon name="edit-pen" size={17} />} />
                </TableCell>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const RecordTableDemo = () => {
  const [editingStock, setEditingStock] = useState(false);

  return (
    <div className="inline-block overflow-hidden rounded-[var(--radius-4)]">
      <div className="grid w-[900px] grid-cols-[409px_190px_190px_111px]">
        <RecordTableHeaderCell column="first" label="Listing" className={`${recordHeaderBorderClass} ${recordFirstColumnBorderClass}`} />
        <RecordTableHeaderCell label="Price" checkbox={null} className={recordHeaderBorderClass} />
        <RecordTableHeaderCell label="Stock" checkbox={null} className={recordHeaderBorderClass} />
        <RecordTableHeaderCell column="last" align="left" label="Action" checkbox={null} sortable={false} className={recordHeaderBorderClass} />
        <RecordTableListingCell column="first" className={`${recordBodyBorderClass} ${recordFirstColumnBorderClass}`} />
        <TableCell inset className={`h-full !items-start border border-solid border-[var(--table-divider-border)] ${recordBodyBorderClass}`}>
          <PrefixInput prefix="RM" value="29.90" className="!w-[124px]" />
        </TableCell>
        <TableCell inset className={`h-full !items-start border border-solid border-[var(--table-divider-border)] ${recordBodyBorderClass}`}>
          {editingStock ? (
            <div onBlur={() => setEditingStock(false)}>
              <NumberInput value="240" hideStepper className="!w-[124px]" inputRef={(el) => el?.focus()} />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setEditingStock(true)}
              className="inline-flex h-[35px] w-[124px] items-center justify-start rounded-[var(--radius-4)] border-0 bg-transparent px-[var(--spacing-12)] py-[var(--spacing-6)] text-left font-[family-name:var(--general-font-family)] text-[length:var(--general-form-value-size)] font-[weight:var(--general-body-weight)] leading-[var(--general-form-value-lineheight)] text-[color:var(--table-inset-body-text)] hover:bg-[var(--table-inset-body-hover-fill)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--button-primary-default-fill)]"
            >
              240
            </button>
          )}
        </TableCell>
        <RecordTableActionCell type="text" actionCount={2} className={recordBodyBorderClass} />
      </div>
    </div>
  );
};

const CardTableDemo = () => (
  <div className="inline-block overflow-hidden rounded-[var(--radius-4)]">
    <table className="w-[760px] table-fixed border-collapse">
      <tbody>
        <tr className="group/row">
          <td className="w-[42%] p-0">
            <TableCardCell tier="top" column="first" checkbox={<Checkbox size="sm" />}>
              Product Group
            </TableCardCell>
          </td>
          <td className="w-[34%] p-0">
            <TableCardCell tier="top" column="center" leadingIcon={<ChannelIcon />}>
              Shopee MY
            </TableCardCell>
          </td>
          <td className="w-[24%] p-0">
            <TableCardCell
              tier="top"
              column="last"
              trailing={<IconLink icon="plus" aria-label="Add" showTooltip={false} />}
            />
          </td>
        </tr>
        <tr className="group/row">
          <td className="p-0">
            <TableCardCell tier="bottom" row="first" column="first" leadingIcon={<ProductThumb />}>
              Dynamo 4in1 Laundry Capsules
            </TableCardCell>
          </td>
          <td className="p-0">
            <TableCardCell tier="bottom" row="first" column="center">
              <Pip type="success" label="Published" />
            </TableCardCell>
          </td>
          <td className="p-0">
            <TableCardCell tier="bottom" row="first" column="last">
              RM 29.90
            </TableCardCell>
          </td>
        </tr>
        <tr className="group/row">
          <td className="p-0">
            <TableCardCell tier="bottom" row="last" column="first">
              <TableCellListing
                productName="Variant A"
                infoRows={[
                  { label: 'SKU', value: 'DYN-001' },
                  { label: 'Stock', value: '240' },
                ]}
              />
            </TableCardCell>
          </td>
          <td className="p-0">
            <TableCardCell tier="bottom" row="last" column="center">
              Ready
            </TableCardCell>
          </td>
          <td className="p-0">
            <TableCardCell tier="bottom" row="last" column="last" formField>
              <TextLink label="Edit" iconPosition="left" icon={<Icon name="edit-pen" size={17} />} />
            </TableCardCell>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export const Overview: Story = {
  render: () => (
    <div className={pageShell}>
      <section className={sectionShell}>
        <h2 className={headingClass}>Choose the table pattern by use case</h2>
        <p className={bodyClass}>
          Use this page like a decision tree. The atom pages are still available for details, but most product work should start from one of these recipes.
        </p>
      </section>
      <section className="rounded-[var(--radius-4)] border border-solid border-[var(--table-divider-border)] px-[var(--spacing-16)]">
        <GuidanceRow label="Standard table">
          Use <code>TableHeaderCell</code> and <code>TableCell</code> for normal data tables.
        </GuidanceRow>
        <GuidanceRow label="Inset table">
          Add <code>inset</code> when a table sits inside a card, modal, or nested panel.
        </GuidanceRow>
        <GuidanceRow label="Cell content">
          Put <code>TableCellInfo</code>, <code>TableCellMainSub</code>, or <code>TableCellListing</code> inside <code>TableCell</code>. Do not use them as table rows.
        </GuidanceRow>
        <GuidanceRow label="Selection">
          Use <code>Checkbox</code> in the cell slot and <code>TableSelectionBar</code> when selected rows replace the header.
        </GuidanceRow>
        <GuidanceRow label="Expandable rows">
          Use <code>TableExpandToggle</code> in a trailing cell, then render subheader and subrow cells underneath.
        </GuidanceRow>
        <GuidanceRow label="Record table">
          Use <code>RecordTable*</code> cells for listing-management tables with product detail, form-field, action, and more-info rows.
        </GuidanceRow>
        <GuidanceRow label="Card table">
          Use <code>TableCardCell</code> for product-card style table rows with top and bottom tiers.
        </GuidanceRow>
      </section>
    </div>
  ),
};

export const BasicTable: Story = {
  render: () => (
    <div className={sectionShell}>
      <h2 className={headingClass}>Basic table</h2>
      <p className={noteClass}>Default data table recipe: header cells in a table header row, body cells in table body rows.</p>
      <BasicTableDemo />
    </div>
  ),
};

export const CheckboxSelection: Story = {
  render: () => (
    <div className={sectionShell}>
      <h2 className={headingClass}>Checkbox selection</h2>
      <p className={noteClass}>Use the existing Checkbox atom in the checkbox slot; replace the header with TableSelectionBar when rows are selected.</p>
      <SelectionTableDemo />
    </div>
  ),
};

export const ActionLinks: Story = {
  render: () => (
    <div className={sectionShell}>
      <h2 className={headingClass}>Action links</h2>
      <p className={noteClass}>Use TextLink for text actions and IconLink for icon-only actions inside TableCell content or trailing slots.</p>
      <ActionLinksDemo />
    </div>
  ),
};

export const ExpandableRows: Story = {
  render: () => (
    <div className={sectionShell}>
      <h2 className={headingClass}>Expandable rows</h2>
      <p className={noteClass}>Use TableExpandToggle in the parent row, then render subheader and subrow cells below it.</p>
      <ExpandableRowsDemo />
    </div>
  ),
};

export const InsetTable: Story = {
  render: () => (
    <div className={sectionShell}>
      <h2 className={headingClass}>Inset table</h2>
      <p className={noteClass}>Use inset header and body cells when the table sits inside a card, modal, drawer, or expanded row.</p>
      <InsetTableDemo />
    </div>
  ),
};

export const RecordTable: Story = {
  render: () => (
    <div className={sectionShell}>
      <h2 className={headingClass}>Record table</h2>
      <p className={noteClass}>Use RecordTable cells for listing-management layouts that need product detail, editable fields, and compact row actions.</p>
      <RecordTableDemo />
    </div>
  ),
};

export const CardTable: Story = {
  render: () => (
    <div className={sectionShell}>
      <h2 className={headingClass}>Card table</h2>
      <p className={noteClass}>Use TableCardCell when a table row is visually grouped as a card with a top tier and bottom tier rows.</p>
      <CardTableDemo />
    </div>
  ),
};
