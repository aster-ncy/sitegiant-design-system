import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  TableCell,
  TableCellInfo,
  TableCellMainSub,
  TableCellListing,
} from '../../components/TableCell';
import { TableHeaderCell } from '../../components/TableHeaderCell';
import { TableExpandToggle } from '../../components/TableExpandToggle';
import { Checkbox } from '../../components/Checkbox';
import { Pip } from '../../components/Pip';
import { Icon } from '../../components/Icon';
import { ProductImage } from '../../components/ProductImageList/ProductImage';
import { ProgressBar } from '../../components/ProgressBar';
import { SortBlockDefault } from '../../components/SortBlock/SortBlockDefault';
import { SortBlockMainSub } from '../../components/SortBlock/SortBlockMainSub';
import { SortBlockLongContent } from '../../components/SortBlock/SortBlockLongContent';
import { SortBlockIcon } from '../../components/SortBlock/SortBlockIcon';
import { TextLink } from '../../components/TextLink';
import { Dropdown } from '../../components/Dropdown';
import { DatePicker } from '../../components/DatePicker';
import { IconButton } from '../../components/TopBar/IconButton';
import { Toggle } from '../../components/Toggle';
import shopeeMy from '../../assets/channel-icons/shopee-my.png';
import shopeeSg from '../../assets/channel-icons/shopee-sg.png';
import tiktokMy from '../../assets/channel-icons/tiktok-my.png';
import lazadaMy from '../../assets/channel-icons/lazada-my.png';
import { WarehouseInfoDemo } from './WarehouseInfoDemo';

// Channel/marketplace brand assets sourced from the SiteGiant Figma "App
// Icon" library. These are live third-party brand marks (Shopee, TikTok,
// Lazada, etc.) — used here as story fixtures to mirror the live ERP, not
// re-distributed as a public design-system component.
const channelIconSources = {
  'shopee-my': shopeeMy,
  'shopee-sg': shopeeSg,
  'tiktok-my': tiktokMy,
  'lazada-my': lazadaMy,
} as const;
type ChannelKey = keyof typeof channelIconSources;

/**
 * Reproductions of 9 live ERP inset-table screens (s1..s9). Each story
 * composes the existing Table primitives — the goal is to prove the
 * primitives can express every observed pattern without one-off product
 * code. Fixture data is fictional; references/inset_table_sN.png hold the
 * source screenshots.
 *
 * Stories live under src/stories/ rather than alongside their primitives
 * because they are integration documentation, not per-component variants.
 */
const meta = {
  title: 'Tables/Table Recipes/Inset Reference Screens',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/* ── shared helpers ────────────────────────────────────── */

// `h-[1px]` on the <td> is the canonical CSS trick to make a percentage-
// height child stretch to the row's natural height — without it the <td>
// sizes to its own intrinsic content and `h-full` on TableCell collapses.
//
// `alignTop` swaps the cell's inner flex from items-center to items-start
// (with !-prefix so it wins against TableCell's default). Used on rows
// that mix multi-line content (TableCellInfo, MainSub, Listing) with
// single-line cells — without it, the single-line cells vertical-center
// against the tall cell, which reads as a stagger rather than alignment.
type CellProps = React.ComponentProps<typeof TableCell> & { alignTop?: boolean };
const Cell = ({ children, className = '', alignTop = false, ...rest }: CellProps) => (
  <td className="p-0 h-[1px]">
    <TableCell
      {...rest}
      className={['h-full', alignTop ? '!items-start' : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </TableCell>
  </td>
);

const TH = (props: React.ComponentProps<typeof TableHeaderCell>) => (
  <th className="p-0">
    <TableHeaderCell {...props} />
  </th>
);

// Row hover fill for inset table rows — lights every cell in the row on hover.
const insetRowHover = 'group/row hover:[&>td>div]:bg-[var(--table-inset-body-hover-fill)]';
// Subrow hover fill
const subrowHover = 'group/row hover:[&>td>div]:bg-[var(--table-inset-subrow-hover-fill)]';

const cardClasses = [
  'bg-[var(--color-surface-card)]',
  'border border-solid border-[color:var(--color-surface-card-border)]',
  'rounded-[var(--inset-card-radii)]',
  'p-[var(--spacing-24)]',
].join(' ');

/* ── s1 Wallet Record ──────────────────────────────────── */

/**
 * SiteGiant Wallet Record — token usage history. Description column shows
 * a bold action name above a dim "SMS Ref. CP..." secondary line. Status
 * column uses a success Pip.
 *
 * Composes: TableCell with `<TableCellInfo alignment="vertical">` for the
 * 2-line description, plain TableCells for the rest, Pip for status.
 */
export const S1WalletRecord: Story = {
  render: () => (
    <div className={cardClasses}>
      <table className="border-collapse w-full table-fixed">
        <thead>
          <tr>
            <TH inset column="first" align="left" label="Date" />
            <TH inset column="center" align="left" label="Description" />
            <TH inset column="center" align="left" label="Set by" />
            <TH inset column="center" align="left" label="Token" />
            <TH inset column="center" align="left" label="Previous Balance" />
            <TH inset column="last" align="left" label="Status" />
          </tr>
        </thead>
        <tbody>
          {[
            { tone: 'red', desc: 'Send SMS Usage', token: '-50', prev: '500' },
            { tone: 'red', desc: 'Send SMS Usage', token: '-50', prev: '530' },
            { tone: 'green', desc: 'Token Top Up', token: '+100', prev: '430' },
            { tone: 'green', desc: 'Token Top Up', token: '+100', prev: '330' },
          ].map((row, index, all) => {
            // alignTop: this row mixes a 2-line MainSub (Description) with
            // single-line cells; the single-line cells should anchor to the
            // top of the row, not vertical-center against the MainSub stack.
            const rowProp = index === all.length - 1 ? 'last' : 'default';
            return (
            <tr key={index} className={insetRowHover}>
              <Cell alignTop inset column="first" row={rowProp}>
                22-10-2020 9:54
              </Cell>
              <Cell alignTop inset column="center" row={rowProp}>
                <TableCellMainSub
                  mainBold
                  mainValue={row.desc}
                  subLabel="SMS Ref."
                  subValue="CP13010263179835"
                />
              </Cell>
              <Cell alignTop inset column="center" row={rowProp}>
                {row.tone === 'green' ? 'Admin A' : '-'}
              </Cell>
              <Cell alignTop inset column="center" row={rowProp}>
                <span className={row.tone === 'red'
                  ? 'text-[color:var(--color-sys-red-DEFAULT)]'
                  : 'text-[color:var(--color-sys-green-DEFAULT)]'
                }>
                  {row.token}
                </span>
              </Cell>
              <Cell alignTop inset column="center" row={rowProp}>
                {row.prev}
              </Cell>
              <Cell alignTop inset column="last" row={rowProp}>
                <Pip type="success" pipStyle="default" label="Success" />
              </Cell>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ),
};

/* ── s2 Sales Channel ──────────────────────────────────── */

// 17×17 channel-brand icon next to the channel name. PNG asset comes from
// the SiteGiant Figma "App Icon" library. leading-17 on the name span so
// its glyph hugs the top of its line-box and aligns with the 17px icon
// (without it the inherited 21px leading drops the text ~2px below).
// `alt=""` + aria-hidden because the channel name immediately follows the
// icon — screen readers shouldn't announce both.
const ChannelLabel = ({ name, channel }: { name: string; channel: ChannelKey }) => (
  <span className="inline-flex items-center gap-[var(--spacing-8)]">
    <img
      src={channelIconSources[channel]}
      alt=""
      aria-hidden="true"
      className="shrink-0 size-[17px] rounded-[var(--radius-4)]"
    />
    <span className="leading-[var(--leading-17)]">{name}</span>
  </span>
);

// Trend indicator — arrow + value coloured red (down) / green (up).
// Used in the Total (RM) column on s2 to mirror the live ERP visual.
const TrendValue = ({
  value,
  trend,
}: {
  value: string;
  trend: 'up' | 'down';
}) => (
  <span className="inline-flex items-center gap-[var(--spacing-4)]">
    <span
      className={
        trend === 'up'
          ? 'text-[color:var(--color-sys-green-DEFAULT)]'
          : 'text-[color:var(--color-sys-red-DEFAULT)]'
      }
    >
      {value}
    </span>
    <Icon
      name={trend === 'up' ? 'arrow-up' : 'arrow-down'}
      size={15}
      className={
        trend === 'up'
          ? 'text-[color:var(--color-sys-green-DEFAULT)]'
          : 'text-[color:var(--color-sys-red-DEFAULT)]'
      }
    />
  </span>
);

/**
 * Today Sales / Sales Channel — parent rows show channel + total, expand
 * to reveal a sub-row band ("Store / Order / Total") plus per-store
 * sub-rows. Demonstrates `subrow` + `subheader` props.
 */
export const S2SalesChannel: Story = {
  render: () => {
    const [expanded, setExpanded] = useState<string | null>('shopee-my');
    return (
      <div className={cardClasses}>
        <table className="border-collapse w-full table-fixed">
          <thead>
            <tr>
              <TH inset column="first" align="left" label="Sales Channel" />
              <TH inset column="center" align="right" label="Order" />
              <TH inset column="center" align="right" label="Total (RM)" />
              <TH inset column="last" align="right" label="" />
            </tr>
          </thead>
          <tbody>
            <tr className={insetRowHover}>
              <Cell inset column="first">
                <ChannelLabel name="SHOPEE MY" channel="shopee-my" />
              </Cell>
              <Cell inset column="center" align="right">30</Cell>
              <Cell inset column="center" align="right">
                <TrendValue value="20,000.36" trend="up" />
              </Cell>
              <Cell inset column="last" align="right">
                <TableExpandToggle
                  expanded={expanded === 'shopee-my'}
                  onToggle={() => setExpanded(expanded === 'shopee-my' ? null : 'shopee-my')}
                />
              </Cell>
            </tr>
            {expanded === 'shopee-my' && (
              <>
                <tr>
                  <th className="p-0">
                    <TableHeaderCell inset subheader subheaderMargin="top" column="first" align="left" label="Store" />
                  </th>
                  <th className="p-0">
                    <TableHeaderCell inset subheader subheaderMargin="top" column="center" align="right" label="Order" />
                  </th>
                  <th className="p-0">
                    <TableHeaderCell inset subheader subheaderMargin="top" column="center" align="right" label="Total (RM)" />
                  </th>
                  <th className="p-0">
                    <TableHeaderCell inset subheader subheaderMargin="top" column="last" align="right" label="" />
                  </th>
                </tr>
                <tr className={subrowHover}>
                  <Cell subrow column="first">Awesome Store 1899</Cell>
                  <Cell subrow column="center" align="right">25</Cell>
                  <Cell subrow column="center" align="right">
                    <TrendValue value="10,000.36" trend="up" />
                  </Cell>
                  <Cell subrow column="last" align="right" />
                </tr>
                <tr className={subrowHover}>
                  <Cell subrow column="first">Super Hype</Cell>
                  <Cell subrow column="center" align="right">5</Cell>
                  <Cell subrow column="center" align="right">
                    <TrendValue value="10,000.00" trend="down" />
                  </Cell>
                  <Cell subrow column="last" align="right" />
                </tr>
              </>
            )}
            <tr className={insetRowHover}>
              <Cell inset column="first">
                <ChannelLabel name="SHOPEE SG" channel="shopee-sg" />
              </Cell>
              <Cell inset column="center" align="right">2</Cell>
              <Cell inset column="center" align="right">
                <TrendValue value="5,991.00" trend="up" />
              </Cell>
              <Cell inset column="last" align="right">
                <TableExpandToggle
                  expanded={expanded === 'shopee-sg'}
                  onToggle={() => setExpanded(expanded === 'shopee-sg' ? null : 'shopee-sg')}
                />
              </Cell>
            </tr>
            <tr className={insetRowHover}>
              <Cell inset column="first">
                <ChannelLabel name="TIKTOK MY" channel="tiktok-my" />
              </Cell>
              <Cell inset column="center" align="right">1233</Cell>
              <Cell inset column="center" align="right">
                <TrendValue value="20,000.36" trend="up" />
              </Cell>
              <Cell inset column="last" align="right">
                <TableExpandToggle
                  expanded={false}
                  onToggle={() => undefined}
                />
              </Cell>
            </tr>
            <tr className={insetRowHover}>
              <Cell inset column="first" row="last">
                <ChannelLabel name="LAZADA MY" channel="lazada-my" />
              </Cell>
              <Cell inset column="center" align="right" row="last">234</Cell>
              <Cell inset column="center" align="right" row="last">
                <TrendValue value="13,232.50" trend="down" />
              </Cell>
              <Cell inset column="last" align="right" row="last">
                <TableExpandToggle
                  expanded={false}
                  onToggle={() => undefined}
                />
              </Cell>
            </tr>
          </tbody>
        </table>
      </div>
    );
  },
};

/* ── s3 Inventory Hold modal ───────────────────────────── */

/**
 * Simple 4-column inset table as it appears inside a modal dialog. Just
 * iSKU, total quantity, total orders, and an external-link icon. No
 * special content variants — primitives only.
 */
export const S3InventoryHold: Story = {
  render: () => (
    <div className={cardClasses}>
      <table className="border-collapse w-full table-fixed">
        <thead>
          <tr>
            <TH inset column="first" align="left" label="iSKU" />
            <TH inset column="center" align="right" label="Total Quantity" />
            <TH inset column="center" align="right" label="Total Orders" />
            <TH inset column="last" align="right" label="" />
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, index, all) => (
            <tr key={index} className={insetRowHover}>
              <Cell inset column="first" row={index === all.length - 1 ? 'last' : 'default'}>
                mega-packaging-095939
              </Cell>
              <Cell inset column="center" align="right" row={index === all.length - 1 ? 'last' : 'default'}>
                2
              </Cell>
              <Cell inset column="center" align="right" row={index === all.length - 1 ? 'last' : 'default'}>
                2
              </Cell>
              <Cell inset column="last" align="right" row={index === all.length - 1 ? 'last' : 'default'}>
                <IconButton name="external-link" variant="basic" label="Open detail" />
              </Cell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

/* ── s4 Imported List ──────────────────────────────────── */

/**
 * Batch Create Tool — Imported List. Progress column shows a ProgressBar
 * with a status icon (loading / failed / completed) and a Download text
 * link in the trailing slot.
 */
export const S4ImportedList: Story = {
  render: () => (
    <div className={cardClasses}>
      <table className="border-collapse w-full table-fixed">
        <thead>
          <tr>
            <TH inset column="first" align="left" label="Time Requested" />
            <TH inset column="center" align="left" label="Info Type" />
            <TH inset column="center" align="left" label="File Name" />
            <TH inset column="center" align="right" label="Success" />
            <TH inset column="center" align="right" label="Failed" />
            <TH inset column="center" align="right" label="Total Orders" />
            <TH inset column="center" align="left" label="Staff" />
            <TH inset column="center" align="left" label="Progress" />
            <TH inset column="last" align="left" label="" />
          </tr>
        </thead>
        <tbody>
          {[
            { state: 'loading', completed: 4, total: 10 },
            { state: 'failed', completed: 2, total: 10 },
            { state: 'done', completed: 10, total: 10 },
          ].map((row, index, all) => (
            <tr key={index} className={insetRowHover}>
              <Cell inset column="first" row={index === all.length - 1 ? 'last' : 'default'}>
                2025-11-06 13:56:56
              </Cell>
              <Cell inset column="center" row={index === all.length - 1 ? 'last' : 'default'}>
                order
              </Cell>
              <Cell inset column="center" row={index === all.length - 1 ? 'last' : 'default'}>
                1762321574_zh.xlsx
              </Cell>
              <Cell inset column="center" align="right" row={index === all.length - 1 ? 'last' : 'default'}>
                1
              </Cell>
              <Cell inset column="center" align="right" row={index === all.length - 1 ? 'last' : 'default'}>
                1
              </Cell>
              <Cell inset column="center" align="right" row={index === all.length - 1 ? 'last' : 'default'}>
                1
              </Cell>
              <Cell inset column="center" row={index === all.length - 1 ? 'last' : 'default'}>
                Super Admin
              </Cell>
              <Cell inset column="center" row={index === all.length - 1 ? 'last' : 'default'}>
                <span className="inline-flex items-center gap-[var(--spacing-8)] w-full">
                  <span className="flex-1 min-w-0">
                    <ProgressBar completed={row.completed} total={row.total} showLabel={false} size="sm" />
                  </span>
                  {row.state === 'loading' && <Icon name="spinner" size={17} className="text-[color:var(--color-icon-secondary)]" />}
                  {row.state === 'failed' && <Icon name="close-circle" size={17} className="text-[color:var(--color-sys-red-DEFAULT)]" />}
                  {row.state === 'done' && <Icon name="check-circle" size={17} className="text-[color:var(--color-sys-green-DEFAULT)]" />}
                </span>
              </Cell>
              <Cell inset column="last" row={index === all.length - 1 ? 'last' : 'default'}>
                <TextLink
                  label="Download"
                  iconPosition="left"
                  icon={<Icon name="download" size={17} />}
                />
              </Cell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

/* ── s5 Courier Service Settings ───────────────────────── */

/**
 * Tiny 2-column inset table — bold service name + edit pencil action.
 * Shows that very small tables still use the same primitives.
 */
export const S5CourierService: Story = {
  render: () => (
    <div className={cardClasses}>
      <table className="border-collapse w-full table-fixed">
        <thead>
          <tr>
            <TH inset column="first" align="left" label="Courier Service" />
            <TH inset column="last" align="left" label="Action" />
          </tr>
        </thead>
        <tbody>
          <tr className={insetRowHover}>
            <Cell inset column="first" weight="bold">Shopee Express (West Malaysia)</Cell>
            <Cell inset column="last">
              <IconButton name="edit" variant="basic" label="Edit courier service" />
            </Cell>
          </tr>
          <tr className={insetRowHover}>
            <Cell inset column="first" weight="bold" row="last">Black Cat</Cell>
            <Cell inset column="last" row="last">
              <IconButton name="edit" variant="basic" label="Edit courier service" />
            </Cell>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

/* ── s6 Send to Lalamove ───────────────────────────────── */

/**
 * Inset table with real Dropdown + DatePicker atoms slotted into cells.
 * Demonstrates that the existing form components compose inside
 * TableCell `children` at the slim form-size without bespoke wrappers.
 */
const deliveryOptions = [
  { value: 'now', label: 'Schedule For Now' },
  { value: 'later', label: 'Schedule For Later' },
];
const vehicleOptions = [
  { value: 'truck550', label: 'Truck550' },
  { value: 'van', label: 'Van' },
  { value: 'motorbike', label: 'Motorbike' },
];

export const S6SendToLalamove: Story = {
  render: () => (
    <div className={cardClasses}>
      <table className="border-collapse w-full table-fixed">
        <thead>
          <tr>
            <TH inset column="first" align="left" label="Trip" checkbox={<Checkbox size="sm" />} />
            <TH inset column="center" align="left" label="Package Qty" />
            <TH inset column="center" align="left" label="Delivery Time" />
            <TH inset column="center" align="left" label="Select Date" />
            <TH inset column="last" align="left" label="Select a Vehicle" />
          </tr>
        </thead>
        <tbody>
          {[
            { id: '#TRIP-0001', code: '220126-001', qty: '0/7', delivery: 'later', date: '' },
            { id: '#TRIP-0002', code: '220126-002', qty: '0/7', delivery: 'now', date: '' },
            { id: '#TRIP-0003', code: '220126-003', qty: '0/7', delivery: 'later', date: '2026-01-20T16:50:00' },
          ].map((row, index, all) => {
            // alignTop: Trip column is a 2-line MainSub (#TRIP-0001
            // bold + 220126-001 sub) with a leading checkbox; checkbox
            // should anchor to the bold ID line, not vertical-center
            // against the whole 2-line stack. Other cells (Package Qty,
            // Dropdown, DatePicker) are single-line atoms — top-anchoring
            // them in a 62px-tall row reads as deliberate alignment with
            // the Trip ID.
            const rowProp = index === all.length - 1 ? 'last' : 'default';
            return (
            <tr key={row.id} className={insetRowHover}>
              <Cell alignTop inset column="first" checkbox={<Checkbox size="sm" />} row={rowProp}>
                <TableCellMainSub mainBold mainValue={row.id} subValue={row.code} />
              </Cell>
              <Cell alignTop inset column="center" row={rowProp}>
                {row.qty}
              </Cell>
              <Cell alignTop inset column="center" row={rowProp}>
                <Dropdown
                  size="slim"
                  options={deliveryOptions}
                  value={row.delivery}
                />
              </Cell>
              <Cell alignTop inset column="center" row={rowProp}>
                <DatePicker
                  size="slim"
                  showTime
                  value={row.date}
                  placeholder="Select Date"
                />
              </Cell>
              <Cell alignTop inset column="last" row={rowProp}>
                <Dropdown
                  size="slim"
                  options={vehicleOptions}
                  placeholder="Select a Vehicle"
                />
              </Cell>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ),
};

/* ── s7 Add Trip — Package List ────────────────────────── */

/**
 * Each row is a flex container of 6 SortBlock family cells, one per
 * Figma column variant: SortBlockIcon (drag), SortBlockDefault with
 * state="Readonly Bold" (tracking), SortBlockDefault (delivery date),
 * SortBlockMainSub (customer name + phone — body 14/17 over caption
 * 12/17), SortBlockLongContent (shipping address with \n-aware wrap),
 * and SortBlockIcon (close button). The row's grey appearance is the
 * cells' fills abutting each other — no per-row background needed.
 *
 * Figma: 3479:35614 (Add Trip page) → 3490:21149 Package List Table.
 * Column widths come from the Figma design; padding is baked into
 * each family member.
 */
export const S7AddTrip: Story = {
  render: () => {
    const rows = [
      {
        id: 'pkg-1',
        tracking: 'MY123554G85899',
        deliveryDate: '08 May 2025 4:00PM',
        customerName: 'Wei Kheng',
        customerPhone: '60 12-456 6556',
        addressLines: [
          '123, Jalan Mayang Pasir,',
          '11200 Bayan Baru,',
          'Pulau Pinang, Malaysia.',
        ],
      },
      {
        id: 'pkg-2',
        tracking: 'MY123554G85899',
        deliveryDate: '08 May 2025 4:00PM',
        customerName: 'Wei Kheng',
        customerPhone: '60 12-456 6556',
        addressLines: [
          '123, Jalan Mayang Pasir,',
          '11200 Bayan Baru,',
          'Pulau Pinang, Malaysia.',
        ],
      },
    ];

    return (
      <div className={cardClasses}>
        <div className="flex flex-col gap-[var(--spacing-8)]">
          {/* Header — flex of 6 inset TableHeaderCells. column='first'/'last'
              give the rounded leading/trailing corners + correct asymmetric
              padding (pl-12/pr-6, pl-6/pr-12). Widths match body cells. */}
          <div className="flex w-full">
            <div className="w-[45px] flex">
              <TableHeaderCell inset column="first" align="left" label="" />
            </div>
            <div className="flex-1 min-w-0 flex">
              <TableHeaderCell inset column="center" align="left" label="Tracking No." />
            </div>
            <div className="w-[166px] flex">
              <TableHeaderCell inset column="center" align="left" label="Delivery Date" />
            </div>
            <div className="w-[130px] flex">
              <TableHeaderCell inset column="center" align="left" label="Customer" />
            </div>
            <div className="w-[203px] flex">
              <TableHeaderCell inset column="center" align="left" label="Shipping Address" />
            </div>
            <div className="w-[45px] flex">
              <TableHeaderCell inset column="last" align="left" label="" />
            </div>
          </div>

          {/* Body rows — flex of 6 SortBlock family cells per row, gap-4 between rows. */}
          <div className="flex flex-col gap-[var(--spacing-4)]">
            {rows.map((row) => (
              <div key={row.id} className="flex w-full">
                {/* Drag */}
                <SortBlockIcon className="self-stretch w-[45px]">
                  <Icon
                    name="drag"
                    size={17}
                    color="var(--color-icon-secondary)"
                    className="cursor-grab"
                  />
                </SortBlockIcon>

                {/* Tracking — bold via component-level state */}
                <SortBlockDefault
                  state="Readonly Bold"
                  className="self-stretch flex-1 min-w-0"
                  rows={[{ value: row.tracking }]}
                />

                {/* Delivery */}
                <SortBlockDefault
                  className="self-stretch w-[166px]"
                  rows={[{ value: row.deliveryDate }]}
                />

                {/* Customer — Figma MainSub: row[0] body 14/17, row[1] caption 12/17 */}
                <SortBlockMainSub
                  className="self-stretch w-[130px]"
                  rows={[{ value: row.customerName }, { value: row.customerPhone }]}
                />

                {/* Address — LongContent honours \n breaks AND wraps via CSS */}
                <SortBlockLongContent
                  className="self-stretch w-[203px]"
                  rows={[{ value: row.addressLines.join('\n') }]}
                />

                {/* Close */}
                <SortBlockIcon className="self-stretch w-[45px]">
                  <button
                    type="button"
                    aria-label="Remove package"
                    className="inline-flex items-center justify-center bg-transparent border-none p-0 cursor-pointer"
                  >
                    <Icon
                      name="close"
                      size={17}
                      color="var(--color-icon-secondary)"
                    />
                  </button>
                </SortBlockIcon>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
};


/* ── s8 Select Package modal ───────────────────────────── */

/**
 * Modal with checkbox-selectable rows. Tracking column uses MainSub bold
 * for the tracking number above an "Order ID 878973829" + "COID
 * 36386598983784" stack — that stack is two TableCellInfo rows. Selected
 * row uses the `selected` prop's pale-blue fill.
 */
export const S8SelectPackage: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>('row-2');
    const rows = [
      { id: 'row-1', tracking: 'MY984746382' },
      { id: 'row-2', tracking: 'MY984746382' },
      { id: 'row-3', tracking: 'MY984746382' },
    ];
    return (
      <div className={cardClasses}>
        <table className="border-collapse w-full table-fixed">
          <thead>
            <tr>
              <TH inset column="first" align="left" label="Tracking No." checkbox={<Checkbox size="sm" />} />
              <TH inset column="center" align="left" label="Customer" />
              <TH inset column="center" align="left" label="Shipping Address" />
              <TH inset column="center" align="left" label="Order Date" />
              <TH inset column="center" align="left" label="Shipment Due Date" />
              <TH inset column="last" align="left" label="Store" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const isSelected = selected === row.id;
              const isLast = index === rows.length - 1;
              const rowProp = isLast ? 'last' : 'default';
              return (
                // alignTop: rows mix the 3-line tracking stack
                // (bold tracking + Order ID + COID) with single-line
                // Order Date / Shipment Due Date / Store cells.
                <tr key={row.id} className={insetRowHover}>
                  <Cell
                    alignTop
                    inset
                    column="first"
                    selected={isSelected}
                    row={rowProp}
                    checkbox={
                      <Checkbox
                        size="sm"
                        checked={isSelected}
                        onChange={() => setSelected(isSelected ? null : row.id)}
                      />
                    }
                  >
                    <div className="flex flex-col gap-[var(--spacing-4)] items-start">
                      {/* Body-slim 14/17 (not the inherited 14/21) so the
                          glyph hugs the top of its line-box and visually
                          aligns with the 17px checkbox to the left. */}
                      <span className="font-[var(--font-weight-bold)] leading-[var(--leading-17)]">{row.tracking}</span>
                      <TableCellInfo
                        statuses={[
                          { label: 'Order ID', body: '878973829' },
                          { label: 'COID', body: '36386598983784' },
                        ]}
                      />
                    </div>
                  </Cell>
                  <Cell alignTop inset column="center" selected={isSelected} row={rowProp}>
                    <TableCellInfo
                      alignment="vertical"
                      statuses={[{ label: 'Wei Kheng', body: '60 12-456 6556' }]}
                    />
                  </Cell>
                  <Cell alignTop inset column="center" selected={isSelected} row={rowProp}>
                    <TableCellInfo
                      statuses={[{
                        label: '',
                        body: [
                          '123, Jalan Mayang Pasir,',
                          '11200 Bayan Baru,',
                          'Pulau Pinang, Malaysia.',
                        ],
                      }]}
                    />
                  </Cell>
                  <Cell alignTop inset column="center" selected={isSelected} row={rowProp}>
                    02 May 2025 11:00AM
                  </Cell>
                  <Cell alignTop inset column="center" selected={isSelected} row={rowProp}>
                    02 May 2025 11:00AM
                  </Cell>
                  <Cell alignTop inset column="last" selected={isSelected} row={rowProp}>
                    <span className="inline-flex items-start gap-[var(--spacing-4)]">
                      {/* 17×17 Shopee MY brand icon (PNG asset from Figma
                          App Icon library). leading-17 on the text span so
                          the first text line aligns with the 17px icon;
                          without it the inherited 21px leading drops the
                          glyph ~3px below. */}
                      <img
                        src={shopeeMy}
                        alt=""
                        aria-hidden="true"
                        className="shrink-0 size-[17px] rounded-[var(--radius-4)]"
                      />
                      <span className="break-words leading-[var(--leading-17)]">ShopeeMY - Awesome Store</span>
                    </span>
                  </Cell>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  },
};

/* ── s9 Order Return Details ───────────────────────────── */

/**
 * Webstore Order Return Details — Item List with image+name+meta in the
 * leading cell, then unit price, quantity, total. Composes
 * TableCellListing for the leading cell.
 */
export const S9OrderReturn: Story = {
  render: () => (
    <div className={cardClasses}>
      <table className="border-collapse w-full table-fixed">
        <thead>
          <tr>
            <TH inset column="first" align="left" label="Item List" />
            <TH inset column="center" align="right" label="Unit Price" />
            <TH inset column="center" align="right" label="Quantity" />
            <TH inset column="last" align="right" label="Total" />
          </tr>
        </thead>
        <tbody>
          {[
            {
              name: 'Minime Slimming Weight Loss Green Tea',
              sku: 'OS-005-FRESH-10ML52',
              variation: 'Kurus Badan Dengan Cepat Bakar Lemak P0019',
            } as { name: string; sku: string; variation: string; reason?: string; note?: string; tag?: string },
            {
              name: 'DYNAMO 4in1 Laundry Capsules Fresh 10ml 52pcs',
              sku: 'DYN-4IN1-FRESH-10ML52',
              variation: 'Black, 5 pcs',
              reason: 'Wrong Size/Fit',
              note: 'Ordered the wrong size by mistake',
              tag: 'Bundle',
            },
            {
              name: 'DYNAMO 4in1 Laundry Capsules Fresh 10ml 52pcs',
              sku: 'DYN-4IN1-FRESH-10ML52',
              variation: 'Black, 5 pcs',
              reason: 'Wrong Size/Fit',
              note: 'Ordered the wrong size by mistake',
            },
          ].map((row, index, all) => {
            // alignTop: each row's first cell renders a multi-line
            // TableCellListing (image + name + meta rows); the right-
            // aligned numeric cells should anchor at the top.
            const rowProp = index === all.length - 1 ? 'last' : 'default';
            return (
            <tr key={index} className={insetRowHover}>
              <Cell
                alignTop
                inset
                column="first"
                row={rowProp}
                className="!pl-[var(--spacing-12)]"
              >
                <TableCellListing
                  image={<ProductImage size="lg" />}
                  tag={row.tag ? <Pip type="muted" pipStyle="default" label={row.tag} /> : undefined}
                  productName={row.name}
                  infoRows={[
                    { label: 'SKU', value: row.sku },
                    { label: 'Variation', value: row.variation },
                    ...(row.reason ? [{ label: 'Reason', value: row.reason }] : []),
                    ...(row.note ? [{ label: 'Note', value: row.note }] : []),
                  ]}
                />
              </Cell>
              <Cell alignTop inset column="center" align="right" row={rowProp}>
                RM 20.00
              </Cell>
              <Cell alignTop inset column="center" align="right" row={rowProp}>
                1
              </Cell>
              <Cell alignTop inset column="last" align="right" row={rowProp}>
                RM 20.00
              </Cell>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ),
};

/* ── WarehouseInfo screen ──────────────────────────────── */

/**
 * Warehouse Info — interactive inset-table screen matching Figma node
 * 7927:76394. Composes Toggle, Dropdown, Input, Quantity, DashedButton,
 * SortBlock family, and IconButton into a fully interactive card.
 */
export const WarehouseInfoScreen: Story = {
  render: () => <WarehouseInfoDemo />,
};

