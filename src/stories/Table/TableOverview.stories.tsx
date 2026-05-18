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
  TableCardCellListing,
  TableCell,
  TableExpandToggle,
  TableHeaderCell,
  TableSelectionBar,
  TextLink,
  Toggle,
} from '../../components';
import { RecordTableActionCell } from '../../components/RecordTable/RecordTableActionCell';
import { RecordTableHeaderCell } from '../../components/RecordTable/RecordTableHeaderCell';
import { RecordTableListingCell } from '../../components/RecordTable/RecordTableListingCell';
import productImage from '../../assets/product-images/product-1.png';
import shopeeIcon from '../../assets/channel-icons/shopee.png';
import webstoreIcon from '../../assets/channel-icons/sitegiant-webstore.png';

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
const tableShell = 'overflow-hidden rounded-[var(--radius-12)] border border-solid border-[color:var(--table-divider-border)] bg-[var(--table-body-fill)]';
const guidanceShell = 'rounded-[var(--radius-4)] border border-solid border-[color:var(--table-divider-border)] bg-[var(--table-body-fill)] px-[var(--spacing-16)]';
const bodyCellSurfaceClass = 'bg-[var(--table-body-fill)]';
const insetBodyCellSurfaceClass = 'bg-[var(--table-inset-body-fill)]';
const insetSubrowCellSurfaceClass = 'bg-[var(--table-inset-subrow-fill)]';
const selectedCellSurfaceClass = 'bg-[var(--color-sys-blue-lighter)]';
const rowDividerCellClass = 'border-b border-solid border-[color:var(--table-divider-border)]';
const insetRowDividerCellClass = 'border-b border-solid border-[color:var(--table-divider-lighter-border)]';
const recordHeaderBorderClass = '[border-width:1px_1px_1px_0]';
const recordBodyBorderClass = '[border-width:0_1px_1px_0]';
const recordFirstColumnBorderClass = '[border-left-width:1px]';
const cardCenterNoBorderClass = '!border-l-0';
const cardBottomHeightClass = '!h-[105px]';

const GuidanceRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="grid grid-cols-[160px_1fr] gap-[var(--spacing-16)] border-b border-solid border-[color:var(--table-divider-border)] py-[var(--spacing-8)] last:border-b-0">
    <span className="font-[var(--font-weight-bold)] text-[length:var(--text-14)] leading-[var(--leading-21)] text-[color:var(--color-text-primary)]">
      {label}
    </span>
    <span className={bodyClass}>{children}</span>
  </div>
);

const ChannelIcon = () => (
  <img
    src={shopeeIcon}
    alt="Shopee"
    className="size-[21px] shrink-0 rounded-[var(--radius-4)] object-cover"
  />
);

const DefaultTableBottomGap = ({ colSpan }: { colSpan: number }) => (
  <tr aria-hidden="true">
    <td colSpan={colSpan} className={`h-[var(--spacing-20)] p-0 ${bodyCellSurfaceClass}`} />
  </tr>
);

const ActionIconLinks = () => (
  <div className="flex items-center gap-[var(--spacing-6)]">
    <IconLink
      icon="edit"
      aria-label="Edit"
      showTooltip={false}
      className={[
        'inline-flex h-[33px] w-[33px] shrink-0 items-center justify-center rounded-[var(--radius-120)] p-[var(--spacing-8)]',
        'text-[color:var(--icon-link-basic-default)] hover:text-[color:var(--icon-link-basic-hover)] active:text-[color:var(--icon-link-basic-clicked)]',
        'cursor-pointer transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[color:var(--button-primary-default-fill)]',
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
        'cursor-pointer transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[color:var(--button-primary-default-fill)]',
      ].join(' ')}
    />
  </div>
);

const actionTextLinkRows = ['Inventory Update', 'Stock Adjustment', 'Listing Detail'] as const;
const actionIconRows = ['Dynamo Laundry Capsules', 'Flash Sale Bundle', 'Starter Kit'] as const;

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
          <td className={`p-0 ${bodyCellSurfaceClass} ${rowDividerCellClass}`}>
            <TableCell column="first" boldOnRowHover className="shadow-none">
              Dynamo Laundry Capsules
            </TableCell>
          </td>
          <td className={`p-0 ${bodyCellSurfaceClass} ${rowDividerCellClass}`}>
            <TableCell leadingIcon={<ChannelIcon />} className="shadow-none">SHOPEE MY</TableCell>
          </td>
          <td className={`p-0 ${bodyCellSurfaceClass} ${rowDividerCellClass}`}>
            <TableCell align="center" tone="success" className="shadow-none">
              240
            </TableCell>
          </td>
          <td className={`p-0 ${bodyCellSurfaceClass} ${rowDividerCellClass}`}>
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
          <td className={`p-0 ${bodyCellSurfaceClass}`}>
            <TableCell column="first" row="last" boldOnRowHover>
              Flash Sale Bundle
            </TableCell>
          </td>
          <td className={`p-0 ${bodyCellSurfaceClass}`}>
            <TableCell row="last" leadingIcon={<ChannelIcon />}>SHOPEE MY</TableCell>
          </td>
          <td className={`p-0 ${bodyCellSurfaceClass}`}>
            <TableCell row="last" align="center" tone="danger">
              8
            </TableCell>
          </td>
          <td className={`p-0 ${bodyCellSurfaceClass}`}>
            <TableCell
              row="last"
              column="last"
              align="left"
            >
              <TextLink label="Edit" iconPosition="left" icon={<Icon name="edit-pen" size={17} />} />
            </TableCell>
          </td>
        </tr>
        <DefaultTableBottomGap colSpan={4} />
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
            <td className={`w-[48%] p-0 ${selectedCellSurfaceClass}`}>
              <TableCell
                column="first"
                selected
                row={index === 1 ? 'last' : 'default'}
                checkbox={<Checkbox size="sm" checked />}
              >
                {name}
              </TableCell>
            </td>
            <td className={`w-[28%] p-0 ${selectedCellSurfaceClass}`}>
              <TableCell selected row={index === 1 ? 'last' : 'default'}>
                Selected row
              </TableCell>
            </td>
            <td className={`w-[24%] p-0 ${selectedCellSurfaceClass}`}>
              <TableCell selected column="last" row={index === 1 ? 'last' : 'default'} align="right">
                Ready
              </TableCell>
            </td>
          </tr>
        ))}
        <DefaultTableBottomGap colSpan={3} />
      </tbody>
    </table>
  </div>
);

const ActionLinksDemo = () => (
  <div className="flex flex-col gap-[var(--spacing-12)]">
    <div className={tableShell}>
      <table className="w-full table-fixed border-separate border-spacing-0">
        <tbody>
          {actionTextLinkRows.map((name, index) => {
            const isLastRow = index === actionTextLinkRows.length - 1;
            const rowPosition = isLastRow ? 'last' : 'default';
            const dividerClass = isLastRow ? '' : rowDividerCellClass;

            return (
              <tr key={name} className="h-[94px]">
                <td className={`w-[42%] p-0 align-top ${bodyCellSurfaceClass} ${dividerClass}`}>
                  <TableCell column="first" row={rowPosition} className="!h-[94px] !items-start shadow-none">{name}</TableCell>
                </td>
                <td className={`w-[58%] p-0 align-top ${bodyCellSurfaceClass} ${dividerClass}`}>
                  <TableCell row={rowPosition} column="last" className="!h-[94px] !items-start shadow-none">
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
              </tr>
            );
          })}
          <DefaultTableBottomGap colSpan={2} />
        </tbody>
      </table>
    </div>

    <div className={tableShell}>
      <table className="w-full table-fixed border-separate border-spacing-0">
        <tbody>
          {actionIconRows.map((name, index) => {
            const isLastRow = index === actionIconRows.length - 1;
            const rowPosition = isLastRow ? 'last' : 'default';
            const dividerClass = isLastRow ? '' : rowDividerCellClass;

            return (
              <tr key={name} className="h-[81px]">
                <td className={`w-[76%] p-0 align-middle ${bodyCellSurfaceClass} ${dividerClass}`}>
                  <TableCell column="first" row={rowPosition} className="!h-[81px] !items-center shadow-none">{name}</TableCell>
                </td>
                <td className={`w-[24%] p-0 align-middle ${bodyCellSurfaceClass} ${dividerClass}`}>
                  <TableCell row={rowPosition} column="last" align="right" className="!h-[81px] !items-center shadow-none" trailing={<ActionIconLinks />} />
                </td>
              </tr>
            );
          })}
          <DefaultTableBottomGap colSpan={2} />
        </tbody>
      </table>
    </div>
  </div>
);

const ExpandableRowsDemo = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="overflow-hidden bg-[var(--table-inset-body-fill)]">
      <table className="w-full table-fixed border-separate border-spacing-0">
        <tbody>
          <tr>
            <td className={`w-[48%] p-0 ${insetBodyCellSurfaceClass} ${expanded ? '' : rowDividerCellClass}`}>
              <TableCell inset column="first" weight="bold" className="shadow-none">
                SHOPEE MY
              </TableCell>
            </td>
            <td className={`w-[34%] p-0 ${insetBodyCellSurfaceClass} ${expanded ? '' : rowDividerCellClass}`}>
              <TableCell inset align="right" className="shadow-none">
                RM 2,450.00
              </TableCell>
            </td>
            <td className={`w-[18%] p-0 ${insetBodyCellSurfaceClass} ${expanded ? '' : rowDividerCellClass}`}>
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
                <td className={`p-0 ${insetSubrowCellSurfaceClass}`}>
                  <TableHeaderCell inset subheader column="first" label="Store" />
                </td>
                <td className={`p-0 ${insetSubrowCellSurfaceClass}`}>
                  <TableHeaderCell inset subheader align="right" label="Sales" />
                </td>
                <td className={`p-0 ${insetSubrowCellSurfaceClass}`}>
                  <TableHeaderCell inset subheader column="last" align="right" label="Orders" />
                </td>
              </tr>
              <tr>
                <td className={`p-0 ${insetSubrowCellSurfaceClass}`}>
                  <TableCell subrow column="first" leadingIcon={<ChannelIcon />}>
                    Main Store
                  </TableCell>
                </td>
                <td className={`p-0 ${insetSubrowCellSurfaceClass}`}>
                  <TableCell subrow align="right" tone="success">
                    RM 1,240.00
                  </TableCell>
                </td>
                <td className={`p-0 ${insetSubrowCellSurfaceClass}`}>
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
          const dividerClass = isLastRow ? 'border-b border-solid border-[color:var(--table-divider-last-border)]' : insetRowDividerCellClass;

          return (
            <tr key={row.trackingNo} className="group/row hover:[&_td]:bg-[var(--table-inset-body-hover-fill)] hover:[&_td>div]:bg-[var(--table-inset-body-hover-fill)]">
              <td className={`p-0 ${insetBodyCellSurfaceClass} ${dividerClass}`}>
                <TableCell inset column="first" checkbox={<Checkbox size="sm" />} boldOnRowHover className="shadow-none">
                  {row.trackingNo}
                </TableCell>
              </td>
              <td className={`p-0 ${insetBodyCellSurfaceClass} ${dividerClass}`}>
                <TableCell inset className="shadow-none">
                  <Pip type="success" label={row.status} />
                </TableCell>
              </td>
              <td className={`p-0 ${insetBodyCellSurfaceClass} ${dividerClass}`}>
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
  const [price, setPrice] = useState('29.90');
  const [stock, setStock] = useState('240');
  const [editingStock, setEditingStock] = useState(false);

  return (
    <div className="inline-block">
      <div className="grid w-[900px] grid-cols-[409px_190px_190px_111px]">
        <RecordTableHeaderCell column="first" label="Listing" className={`${recordHeaderBorderClass} ${recordFirstColumnBorderClass}`} />
        <RecordTableHeaderCell label="Price" className={recordHeaderBorderClass} />
        <RecordTableHeaderCell label="Stock" className={recordHeaderBorderClass} />
        <RecordTableHeaderCell column="last" align="left" label="Action" sortable={false} className={recordHeaderBorderClass} />
        <RecordTableListingCell column="first" className={`${recordBodyBorderClass} ${recordFirstColumnBorderClass}`} />
        <TableCell inset className={`h-full !items-start border border-solid border-[color:var(--table-divider-border)] ${recordBodyBorderClass}`}>
          <PrefixInput prefix="RM" value={price} onChange={setPrice} className="!w-[124px]" />
        </TableCell>
        <TableCell
          inset
          className={`h-full !items-start border border-solid border-[color:var(--table-divider-border)] ${recordBodyBorderClass} ${editingStock ? '' : 'cursor-pointer'}`}
          onClick={() => setEditingStock(true)}
        >
          {editingStock ? (
            <div onBlur={() => setEditingStock(false)}>
              <NumberInput value={stock} onChange={setStock} hideStepper className="!w-[124px]" inputRef={(el) => el?.focus()} />
            </div>
          ) : (
            <span className="inline-flex h-[35px] w-[124px] items-center justify-start rounded-[var(--radius-4)] px-[var(--spacing-12)] py-[var(--spacing-6)] text-left font-[family-name:var(--general-font-family)] text-[length:var(--general-form-value-size)] font-[weight:var(--general-body-weight)] leading-[var(--general-form-value-lineheight)] text-[color:var(--table-inset-body-text)]">
              {stock}
            </span>
          )}
        </TableCell>
        <RecordTableActionCell type="text" actionCount={2} className={recordBodyBorderClass} />
      </div>
    </div>
  );
};

/* Reference: references/table_s13.png — Shopee Ratings.
 * Top tier: checkbox + reviewer + review# + channel.
 * Bottom tier: product image+meta | rating + review text | timestamp | toggle. */
const RatingsCardTableDemo = () => (
  <div className="inline-flex items-start gap-[var(--spacing-12)]">
    <span className="inline-flex pt-[var(--spacing-14)]">
      <Checkbox size="sm" />
    </span>
    <div className="w-[980px] overflow-hidden rounded-[var(--radius-4)] border border-solid border-[color:var(--table-divider-border)]">
      <div className="group/row grid grid-cols-[32%_40%_18%_10%] border-b border-solid border-[color:var(--table-divider-border)]">
        <TableCardCell tier="top" column="first" mode="default" className="!items-center !rounded-none !border-0">
          <span className="inline-flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full bg-[var(--color-space-DEFAULT)] text-[length:var(--text-12)] leading-none text-[color:var(--color-text-info)]">A</span>
          <span>Tiffany</span>
        </TableCardCell>
        <TableCardCell tier="top" column="center" mode="default" className={`${cardCenterNoBorderClass} !items-center !rounded-none !border-0`}>#233</TableCardCell>
        <TableCardCell tier="top" column="last" mode="default" className={`${cardCenterNoBorderClass} !items-center !rounded-none !border-0 col-span-2`}>
          <span className="inline-flex items-center gap-[var(--spacing-8)]">
            <ChannelIcon />
            <span>SHOPEE MY</span>
          </span>
        </TableCardCell>
      </div>
      <div className="group/row grid grid-cols-[32%_40%_18%_10%]">
        <TableCardCell tier="bottom" row="last" column="first" mode="default" bottomVariant="listing" className={`${cardBottomHeightClass} !rounded-none !border-0`}>
          <TableCardCellListing
            image={<ProductImage src={productImage} alt="Dynamo" size="lg" />}
            productName="DYNAMO 4in1 Laundry Capsules Fresh 10ml 52pcs"
            variant={{ label: 'Variant', value: 'Red' }}
            sku={{ label: 'SKU', value: '1902839204' }}
          />
        </TableCardCell>
        <TableCardCell tier="bottom" row="last" column="center" mode="default" className={`${cardBottomHeightClass} !rounded-none !border-0`}>
          <span className="flex flex-col items-start gap-[var(--spacing-4)]">
            <span className="inline-flex items-center gap-[var(--spacing-2)] text-[color:var(--color-sys-orange-light)]">
              <Icon name="star-full" size={16} />
              <Icon name="star-full" size={16} />
              <Icon name="star-full" size={16} />
              <Icon name="star-full" size={16} />
              <Icon name="star-full" size={16} color="var(--color-space-DEFAULT)" />
            </span>
            <span>Baju dalam keadaan baik. Pembungkusan pun teliti.</span>
          </span>
        </TableCardCell>
        <TableCardCell tier="bottom" row="last" column="center" mode="default" className={`${cardBottomHeightClass} !rounded-none !border-0`}>
          <span className="whitespace-nowrap">22 May 2025 11:58am</span>
        </TableCardCell>
        <TableCardCell tier="bottom" row="last" column="last" mode="default" bottomVariant="status-toggle" className={`${cardBottomHeightClass} !rounded-none !border-0`}>
          <Toggle checked />
        </TableCardCell>
      </div>
    </div>
  </div>
);

/* Reference: references/table_s14.png — Order Processing.
 * Top tier: package id / packing note / tracking number / courier.
 * Bottom tier: order id meta | product card | order date | status pips | amounts | cancel | webstore tag.
 * Uses a 7-column colgroup; top-tier cells use colSpan. */
const OrderProcessingCardTableDemo = () => (
  <div className="inline-flex w-[1000px] flex-col">
    {/* Outer top tier — Package ID / Packing Note / Tracking No / Courier Service */}
    <table className="w-full table-fixed border-collapse">
      <colgroup>
        <col className="w-[14%]" />
        <col className="w-[28%]" />
        <col className="w-[26%]" />
        <col className="w-[32%]" />
      </colgroup>
      <tbody>
        <tr>
          <td className="p-0">
            <TableCardCell tier="top" column="first" mode="default">
              <span className="flex flex-col gap-[var(--spacing-2)]">
                <span className="text-[length:var(--text-12)] leading-[var(--leading-17)] text-[color:var(--color-text-info)]">Package ID</span>
                <span className="font-[var(--font-weight-bold)]">7</span>
              </span>
            </TableCardCell>
          </td>
          <td className="p-0">
            <TableCardCell tier="top" column="center" mode="default" className={cardCenterNoBorderClass}>
              <span className="flex flex-col gap-[var(--spacing-2)]">
                <span className="flex items-center gap-[var(--spacing-4)] text-[length:var(--text-12)] leading-[var(--leading-17)] text-[color:var(--color-text-info)]">
                  Packing Note
                  <Icon name="edit-pen" size={17} color="var(--color-sys-blue-DEFAULT)" />
                </span>
                <span>—</span>
              </span>
            </TableCardCell>
          </td>
          <td className="p-0">
            <TableCardCell tier="top" column="center" mode="default" className={cardCenterNoBorderClass}>
              <span className="flex flex-col gap-[var(--spacing-2)]">
                <span className="text-[length:var(--text-12)] leading-[var(--leading-17)] text-[color:var(--color-text-info)]">Tracking No</span>
                <span>4678326478</span>
              </span>
            </TableCardCell>
          </td>
          <td className="p-0">
            <TableCardCell tier="top" column="last" mode="default" className={cardCenterNoBorderClass}>
              <span className="flex flex-col gap-[var(--spacing-2)]">
                <span className="text-[length:var(--text-12)] leading-[var(--leading-17)] text-[color:var(--color-text-info)]">Courier Service</span>
                <span>Others (Self-Delivery)</span>
              </span>
            </TableCardCell>
          </td>
        </tr>
      </tbody>
    </table>
    {/* Outer bottom tier — wraps the nested inner card. White panel between
        outer top strip and inner card; horizontal/bottom padding gives the
        inner card a visible inset on white background. */}
    <div className="bg-[color:var(--color-surface-card)] px-[var(--spacing-24)] pt-[var(--spacing-12)] pb-[var(--spacing-24)] border-x border-b border-solid border-[color:var(--table-divider-border)] rounded-b-[var(--radius-4)]">
      {/* Inner card uses flex rows (not <table>) so cells in the same row
          auto-stretch to the tallest sibling's height. That lets the atom's
          column-coordinated borders and corner radii close the inner card
          even when content heights vary widely (×-icon vs product listing). */}
      <div className="overflow-hidden rounded-[var(--radius-4)]">
        {/* Inner top tier — #7 + COID/INV / Edward / Webstore */}
        <div className="flex">
          <div className="w-[34%]">
            <TableCardCell tier="top" column="first" mode="default">
              <span className="flex items-center gap-[var(--spacing-20)] whitespace-nowrap">
                <span className="font-[var(--font-weight-bold)]">#7</span>
                <span>COID: -</span>
                <span>INV: -</span>
              </span>
            </TableCardCell>
          </div>
          <div className="w-[32%]">
            <TableCardCell tier="top" column="center" mode="default" className="!pl-[var(--spacing-12)] !pr-[var(--spacing-12)]">
              <span className="flex min-w-0 items-center gap-[var(--spacing-8)] whitespace-nowrap">
                <span>Edward</span>
                <span className="shrink-0">|</span>
                <span>Pulau Pinang, Malaysia</span>
                <Icon name="edit-pen" size={17} color="var(--color-sys-blue-DEFAULT)" />
              </span>
            </TableCardCell>
          </div>
          <div className="w-[34%]">
            <TableCardCell tier="top" column="last" mode="default" className="!pl-[var(--spacing-12)] !pr-[var(--spacing-24)]">
              <span className="ml-auto inline-flex w-fit items-center gap-[var(--spacing-8)]">
                <img src={webstoreIcon} alt="WEBSTORE" className="size-[21px] shrink-0 rounded-[var(--radius-4)] object-cover" />
                <span>WEBSTORE</span>
              </span>
            </TableCardCell>
          </div>
        </div>
        {/* Inner bottom tier — product / Order Date / Status / Amounts / ×.
            Flex children stretch by default → every cell matches the
            tallest cell's height, so the atom's borders + corner radii
            close the card box without any wrapper-border workaround. */}
        <div className="group/row flex">
          <div className="flex w-[34%]">
            <TableCardCell tier="bottom" row="last" column="first" mode="default" bottomVariant="listing">
              <TableCardCellListing
                image={<ProductImage src={productImage} alt="Product" size="lg" />}
                productName="[TESTING PRODUCT, DO NOT BUY] FishBone Keychain"
                variant={{ label: 'iSKU', value: 'cute-keycap-fidget-clicker-keychain-fishbone-black' }}
                sku={{ label: 'SKU', value: 'cute-keycap-fidget-clicker-keychain-fishbone-black' }}
                properties={[{ label: 'Color/Size', value: 'Black/5cm' }]}
                extras={<span>RM299.00 <span className="text-[color:var(--color-sys-blue-DEFAULT)]">x <span className="font-[var(--font-weight-bold)]">1</span></span></span>}
              />
            </TableCardCell>
          </div>
          <div className="flex w-[18%]">
            <TableCardCell tier="bottom" row="last" column="center" mode="default" className="!pl-[var(--spacing-12)] !pr-[var(--spacing-6)] !border-l-0">
              <span className="flex flex-col gap-[var(--spacing-4)]">
                <span className="text-[length:var(--text-12)] leading-[var(--leading-17)] text-[color:var(--color-text-info)]">Order Date</span>
                <span>13-02-2026</span>
                <span>10:45:20</span>
                <span className="mt-[var(--spacing-8)] text-[length:var(--text-12)] leading-[var(--leading-17)] text-[color:var(--color-text-info)]">Shipping Method</span>
                <span>Pickup</span>
              </span>
            </TableCardCell>
          </div>
          <div className="flex w-[14%]">
            <TableCardCell tier="bottom" row="last" column="center" mode="default" className="!pl-[var(--spacing-12)] !pr-[var(--spacing-6)] !border-l-0">
              <span className="flex flex-col items-start gap-[var(--spacing-4)]">
                <Pip type="warning" label="Processed" />
                <Pip type="success" label="Paid" />
              </span>
            </TableCardCell>
          </div>
          <div className="flex w-[24%]">
            <TableCardCell tier="bottom" row="last" column="center" mode="default" className="!pl-[var(--spacing-12)] !pr-[var(--spacing-6)] !border-l-0">
              <span className="flex flex-col gap-[var(--spacing-4)]">
                <span className="text-[length:var(--text-16)] leading-[var(--leading-24)] font-[var(--font-weight-bold)]">RM299.00</span>
                <span className="text-[length:var(--text-12)] leading-[var(--leading-17)] text-[color:var(--color-text-info)]">Cash on delivery</span>
                <span className="flex items-center gap-[var(--spacing-4)]">
                  <Icon name="database" size={17} color="var(--color-text-info)" />
                  <span className="text-[color:var(--color-sys-green-DEFAULT)]">RM299.00</span>
                </span>
                <span className="pl-[calc(17px+var(--spacing-4))] text-[color:var(--color-sys-green-DEFAULT)]">100%</span>
              </span>
            </TableCardCell>
          </div>
          <div className="flex w-[10%]">
            <TableCardCell tier="bottom" row="last" column="last" mode="default" bottomVariant="action-button" className="!border-l-0">
              <Icon name="close" size={17} color="var(--color-sys-red-DEFAULT)" />
            </TableCardCell>
          </div>
        </div>
      </div>
    </div>
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
      <section className={guidanceShell}>
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
      <p className={noteClass}>Use TableCardCell when a table row is visually grouped as a card with a top-tier strip + bottom-tier content row. Two reference recipes:</p>
      <h3 className="mt-[var(--spacing-12)] text-[length:var(--text-14)] leading-[var(--leading-21)] font-[var(--font-weight-bold)] text-[color:var(--color-text-primary)]">Ratings card</h3>
      <p className={noteClass}>Top tier: reviewer + review# + channel. Bottom tier: product listing + rating + timestamp + status toggle.</p>
      <RatingsCardTableDemo />
      <h3 className="mt-[var(--spacing-24)] text-[length:var(--text-14)] leading-[var(--leading-21)] font-[var(--font-weight-bold)] text-[color:var(--color-text-primary)]">Order processing card</h3>
      <p className={noteClass}>Top tier: package id / packing note / tracking / courier label-value pairs. Bottom tier: order id + product + dates + status pips + amounts + actions.</p>
      <OrderProcessingCardTableDemo />
    </div>
  ),
};
