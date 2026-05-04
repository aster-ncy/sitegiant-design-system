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
import { SortBlock } from '../../components/SortBlock';
import { TextLink } from '../../components/TextLink';
import { Dropdown } from '../../components/Dropdown';
import { DatePicker } from '../../components/DatePicker';
import { IconButton } from '../../components/TopBar/IconButton';
import { TableCardCell } from '../../components/TableCardCell';
import { NumberInput } from '../../components/NumberInput';
import { Toggle } from '../../components/Toggle';
import shopeeMy from '../../assets/channel-icons/shopee-my.png';
import shopeeSg from '../../assets/channel-icons/shopee-sg.png';
import tiktokMy from '../../assets/channel-icons/tiktok-my.png';
import lazadaMy from '../../assets/channel-icons/lazada-my.png';

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
 * (private) source screenshots.
 *
 * Stories live under src/stories/ rather than alongside their primitives
 * because they are integration documentation, not per-component variants.
 */
const meta = {
  title: 'Tables/Reference Screens',
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

const cardClasses = [
  'bg-[var(--color-surface-card)]',
  'border border-solid border-[color:var(--color-surface-card-border)]',
  'rounded-[var(--radius-8)]',
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
            const rowProp = index === all.length - 1 ? 'last' : 'middle';
            return (
            <tr key={index}>
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
            <tr>
              <Cell inset column="first">
                <ChannelLabel name="Shopee MY" channel="shopee-my" />
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
                    <TableHeaderCell subheader subheaderMargin="top" column="first" align="left" label="Store" />
                  </th>
                  <th className="p-0">
                    <TableHeaderCell subheader subheaderMargin="top" column="center" align="right" label="Order" />
                  </th>
                  <th className="p-0">
                    <TableHeaderCell subheader subheaderMargin="top" column="center" align="right" label="Total (RM)" />
                  </th>
                  <th className="p-0">
                    <TableHeaderCell subheader subheaderMargin="top" column="last" align="right" label="" />
                  </th>
                </tr>
                <tr>
                  <Cell subrow column="first">Awesome Store 1899</Cell>
                  <Cell subrow column="center" align="right">25</Cell>
                  <Cell subrow column="center" align="right">
                    <TrendValue value="10,000.36" trend="up" />
                  </Cell>
                  <Cell subrow column="last" align="right" />
                </tr>
                <tr>
                  <Cell subrow column="first">Super Hype</Cell>
                  <Cell subrow column="center" align="right">5</Cell>
                  <Cell subrow column="center" align="right">
                    <TrendValue value="10,000.00" trend="down" />
                  </Cell>
                  <Cell subrow column="last" align="right" />
                </tr>
              </>
            )}
            <tr>
              <Cell inset column="first">
                <ChannelLabel name="Shopee SG" channel="shopee-sg" />
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
            <tr>
              <Cell inset column="first">
                <ChannelLabel name="TikTok MY" channel="tiktok-my" />
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
            <tr>
              <Cell inset column="first" row="last">
                <ChannelLabel name="Lazada MY" channel="lazada-my" />
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
            <tr key={index}>
              <Cell inset column="first" row={index === all.length - 1 ? 'last' : 'middle'}>
                mega-packaging-095939
              </Cell>
              <Cell inset column="center" align="right" row={index === all.length - 1 ? 'last' : 'middle'}>
                2
              </Cell>
              <Cell inset column="center" align="right" row={index === all.length - 1 ? 'last' : 'middle'}>
                2
              </Cell>
              <Cell inset column="last" align="right" row={index === all.length - 1 ? 'last' : 'middle'}>
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
            <tr key={index}>
              <Cell inset column="first" row={index === all.length - 1 ? 'last' : 'middle'}>
                2025-11-06 13:56:56
              </Cell>
              <Cell inset column="center" row={index === all.length - 1 ? 'last' : 'middle'}>
                order
              </Cell>
              <Cell inset column="center" row={index === all.length - 1 ? 'last' : 'middle'}>
                1762321574_zh.xlsx
              </Cell>
              <Cell inset column="center" align="right" row={index === all.length - 1 ? 'last' : 'middle'}>
                1
              </Cell>
              <Cell inset column="center" align="right" row={index === all.length - 1 ? 'last' : 'middle'}>
                1
              </Cell>
              <Cell inset column="center" align="right" row={index === all.length - 1 ? 'last' : 'middle'}>
                1
              </Cell>
              <Cell inset column="center" row={index === all.length - 1 ? 'last' : 'middle'}>
                Super Admin
              </Cell>
              <Cell inset column="center" row={index === all.length - 1 ? 'last' : 'middle'}>
                <span className="inline-flex items-center gap-[var(--spacing-8)] w-full">
                  <span className="flex-1 min-w-0">
                    <ProgressBar completed={row.completed} total={row.total} showLabel={false} size="sm" />
                  </span>
                  {row.state === 'loading' && <Icon name="spinner" size={17} className="text-[color:var(--color-icon-secondary)]" />}
                  {row.state === 'failed' && <Icon name="close-circle" size={17} className="text-[color:var(--color-sys-red-DEFAULT)]" />}
                  {row.state === 'done' && <Icon name="check-circle" size={17} className="text-[color:var(--color-sys-green-DEFAULT)]" />}
                </span>
              </Cell>
              <Cell inset column="last" row={index === all.length - 1 ? 'last' : 'middle'}>
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
          <tr>
            <Cell inset column="first" weight="bold">Shopee Express (West Malaysia)</Cell>
            <Cell inset column="last">
              <IconButton name="edit" variant="basic" label="Edit courier service" />
            </Cell>
          </tr>
          <tr>
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
            const rowProp = index === all.length - 1 ? 'last' : 'middle';
            return (
            <tr key={row.id}>
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

/* ── s7-only constants for the SortBlock-per-row composition ───────────
 *
 * PATTERN: One <SortBlock> per body row; cells inside are plain divs.
 * SortBlock's default root is inline-flex, so we pass ROW_OVERRIDE which
 * REPLACES the built-in classes (per SortBlock.tsx:24) — we keep the bg,
 * px, py chrome and swap inline-flex for flex w-full.
 *
 * Body cells use plain typography constants (NOT SortBlock's rows API)
 * because: (a) values must wrap (rows API forces whitespace-nowrap),
 * (b) cells have no inline labels (rows API always renders the label
 * span, even for empty strings).
 * ──────────────────────────────────────────────────────────────────── */

const S7_ROW_OVERRIDE =
  'flex items-start w-full ' +
  'bg-[color:var(--sorting-block-sorting-fill)] ' +
  'px-[var(--spacing-6)] py-[var(--spacing-12)] ' +
  'gap-[var(--spacing-8)]';

const S7_HEADER_LABEL =
  'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)] ' +
  'text-[length:var(--text-12)] leading-[var(--leading-17)] ' +
  'text-[color:var(--color-text-info)]';

const S7_VALUE_REG =
  'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)] ' +
  'text-[length:var(--text-14)] leading-[var(--leading-17)] ' +
  'text-[color:var(--color-text-primary)] whitespace-nowrap';

const S7_VALUE_BOLD =
  'font-[family-name:var(--general-font-family)] font-[var(--font-weight-bold)] ' +
  'text-[length:var(--text-14)] leading-[var(--leading-17)] ' +
  'text-[color:var(--color-text-primary)] whitespace-nowrap';

const S7_VALUE_CAPTION =
  'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)] ' +
  'text-[length:var(--text-12)] leading-[var(--leading-17)] ' +
  'text-[color:var(--color-text-primary)] whitespace-nowrap';

// Intentionally NO whitespace-nowrap — the address cell must wrap.
const S7_VALUE_WRAP =
  'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)] ' +
  'text-[length:var(--text-14)] leading-[var(--leading-17)] ' +
  'text-[color:var(--color-text-primary)]';

/* ── s7 Add Trip — Package List ────────────────────────── */

/**
 * Each row is one <SortBlock className={S7_ROW_OVERRIDE}> with plain div
 * cells inside. The header above the rows is a plain <div> strip — not
 * a SortBlock — that mirrors the same grey chrome and column widths so
 * the header labels align horizontally with the body values.
 *
 * Figma: "Sort Block — MainSub" (component_set
 * `b59d4f9522e1d0ef16c22b7eee9ed78c831fe36b`).
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
        address:
          '123, Jalan Mayang Pasir, 11200 Bayan Baru, Pulau Pinang, Malaysia.',
      },
      {
        id: 'pkg-2',
        tracking: 'MY123554G85899',
        deliveryDate: '08 May 2025 4:00PM',
        customerName: 'Wei Kheng',
        customerPhone: '60 12-456 6556',
        address:
          '123, Jalan Mayang Pasir, 11200 Bayan Baru, Pulau Pinang, Malaysia.',
      },
    ];

    return (
      <div className={cardClasses}>
        <div className="flex flex-col gap-[var(--spacing-8)]">
          {/* Header strip — labels only, NOT a SortBlock */}
          <div
            className="flex items-center w-full bg-[color:var(--sorting-block-sorting-fill)]
                       px-[var(--spacing-6)] py-[var(--spacing-12)] gap-[var(--spacing-8)]"
          >
            <div className="w-[24px] flex-none" aria-hidden />
            <span className={S7_HEADER_LABEL} style={{ width: 180 }}>
              Tracking No.
            </span>
            <span className={S7_HEADER_LABEL} style={{ width: 180 }}>
              Delivery Date
            </span>
            <span className={S7_HEADER_LABEL} style={{ width: 180 }}>
              Customer
            </span>
            <span className={`${S7_HEADER_LABEL} flex-1`}>Shipping Address</span>
            <div className="w-[24px] flex-none" aria-hidden />
          </div>

          {/* Body rows — each is one SortBlock */}
          {rows.map((row) => (
            <SortBlock key={row.id} className={S7_ROW_OVERRIDE}>
              <div className="flex items-center justify-center w-[24px] flex-none self-stretch">
                <Icon
                  name="drag"
                  size={17}
                  className="text-[color:var(--color-icon-secondary)] cursor-grab"
                />
              </div>
              <span style={{ width: 180 }} className={S7_VALUE_BOLD}>
                {row.tracking}
              </span>
              <span style={{ width: 180 }} className={S7_VALUE_REG}>
                {row.deliveryDate}
              </span>
              <div
                style={{ width: 180 }}
                className="flex flex-col gap-[var(--spacing-2)]"
              >
                <span className={S7_VALUE_REG}>{row.customerName}</span>
                <span className={S7_VALUE_CAPTION}>{row.customerPhone}</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className={S7_VALUE_WRAP}>{row.address}</span>
              </div>
              <div className="flex items-start justify-center w-[24px] flex-none self-stretch">
                <IconButton name="close" label="Remove package" />
              </div>
            </SortBlock>
          ))}
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
              const rowProp = isLast ? 'last' : 'middle';
              return (
                // alignTop: rows mix the 3-line tracking stack
                // (bold tracking + Order ID + COID) with single-line
                // Order Date / Shipment Due Date / Store cells.
                <tr key={row.id}>
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
            const rowProp = index === all.length - 1 ? 'last' : 'middle';
            return (
            <tr key={index}>
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

/* ── s10 Shocking Sale ─────────────────────────────────── */

/**
 * Create Shocking Sale — products listed as cards with editable variant
 * rows. Each card = 1 Top Tier row (image + product name + trash) +
 * N Bottom Tier rows (variant label + RM input + %off input + qty +
 * stock + purchase limit + status toggle). Composes
 * `<TableCardCell>` for the new card-style table primitive.
 */
export const S10ShockingSale: Story = {
  render: () => {
    type Variant = {
      key: string;
      label: string;
      price: string;
      offPercent: string;
      campaignStock: string;
      stock: number;
      purchaseLimit: string;
      enabled: boolean;
    };
    const variants: Variant[] = [
      { key: 'blue-s', label: 'Blue, S', price: '16.00', offPercent: '20', campaignStock: '10', stock: 44, purchaseLimit: '2', enabled: true },
      { key: 'blue-m', label: 'Blue, M', price: '16.00', offPercent: '20', campaignStock: '10', stock: 44, purchaseLimit: '2', enabled: true },
      { key: 'red-s', label: 'Red, S', price: '16.00', offPercent: '20', campaignStock: '10', stock: 44, purchaseLimit: '4', enabled: true },
      { key: 'red-m', label: 'Red, M', price: '0.00', offPercent: '20', campaignStock: '10', stock: 44, purchaseLimit: '', enabled: true },
    ];
    return (
      <div className={cardClasses}>
        <h2 className="font-[var(--font-weight-bold)] text-[length:var(--text-16)] mb-[var(--spacing-16)]">
          Shocking Sale Products
        </h2>
        <div className="rounded-[var(--radius-4)] overflow-hidden">
          <table className="border-collapse w-full table-fixed">
            <tbody>
              {/* Top Tier — product header */}
              <tr className="group/row">
                <td className="p-0" colSpan={7}>
                  <TableCardCell
                    tier="top"
                    column="first"
                    checkbox={<Checkbox size="sm" />}
                    className="!border-r rounded-tr-[var(--radius-4)]"
                  >
                    <span className="inline-flex items-center gap-[var(--spacing-8)]">
                      <span
                        aria-hidden="true"
                        className="shrink-0 size-[var(--spacing-40)] rounded-[var(--radius-4)] bg-[var(--color-set-light)]"
                      />
                      <span className="font-[var(--font-weight-bold)]">
                        Women's Fashion Cat Print Plus Velvet Hooded Sweate Velvet Hooded Sweater
                      </span>
                    </span>
                  </TableCardCell>
                </td>
              </tr>
              {/* Bottom Tier — variant rows */}
              {variants.map((v, i) => {
                const row = i === variants.length - 1 ? 'last' : i === 0 ? 'first' : 'middle';
                return (
                  <tr key={v.key} className="group/row">
                    <td className="p-0">
                      <TableCardCell tier="bottom" row={row} column="first">
                        {v.label}
                      </TableCardCell>
                    </td>
                    <td className="p-0">
                      <TableCardCell tier="bottom" row={row} column="center">
                        RM{v.price}
                      </TableCardCell>
                    </td>
                    <td className="p-0">
                      <TableCardCell tier="bottom" row={row} column="center" formField>
                        <NumberInput value={v.price} onChange={() => undefined} />
                      </TableCardCell>
                    </td>
                    <td className="p-0">
                      <TableCardCell tier="bottom" row={row} column="center" formField>
                        <NumberInput value={v.offPercent} onChange={() => undefined} />
                      </TableCardCell>
                    </td>
                    <td className="p-0">
                      <TableCardCell tier="bottom" row={row} column="center" formField>
                        <NumberInput value={v.campaignStock} onChange={() => undefined} />
                      </TableCardCell>
                    </td>
                    <td className="p-0">
                      <TableCardCell tier="bottom" row={row} column="center">
                        {v.stock}
                      </TableCardCell>
                    </td>
                    <td className="p-0">
                      <TableCardCell
                        tier="bottom"
                        row={row}
                        column="last"
                        formField
                        trailing={<Toggle checked={v.enabled} onChange={() => undefined} />}
                      >
                        {v.purchaseLimit || 'No limit'}
                      </TableCardCell>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
};
