import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableCell, TableCellInfo } from '../../components/TableCell';
import { TableHeaderCell } from '../../components/TableHeaderCell';
import { Checkbox } from '../../components/Checkbox';
import { Icon } from '../../components/Icon';
import { Pip } from '../../components/Pip';

/**
 * Reproductions of 3 live ERP **default (non-inset)** table screens.
 * Each story exercises the default-mode `TableCell` / `TableHeaderCell`
 * code path, so the non-inset rendering is provably faithful end-to-end.
 *
 * Pairs with InsetTableScreens.stories.tsx (s1..s9) — the same primitives
 * with `inset` flipped off. Source screenshots live at
 * `references/table_s4.png`, `table_s7.png`, `table_s8.png`.
 */
const meta = {
  title: 'Tables/Table Recipes/Default Table Reference Screens',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

// Story helpers — wrap each primitive in its semantic table cell so the
// browser builds a real <thead>/<tbody> grid.
// Default-table rule: <td> always gets align-top so the browser's default
// vertical-align:middle doesn't float single-line cells to the middle of a
// taller multi-row sibling. TableCell already uses items-start in default mode.
// TH puts the bottom border on the <th> itself — same approach as Cell —
// so the divider spans the full header height regardless of content.
const TH = (props: React.ComponentProps<typeof TableHeaderCell>) => (
  <th className="p-0 border-b border-[color:var(--table-divider-border)]">
    <TableHeaderCell className="shadow-none" {...props} />
  </th>
);
// Cell wraps TableCell in a <td>. The row divider is placed on the <td> itself
// (border-b) rather than relying on the TableCell div's inset box-shadow, because
// h-full on the div doesn't resolve in a table cell with align-top — the div only
// grows to content height, so the box-shadow paints partway up the row.
// TableCell background is made transparent so the <td> background (including hover)
// shows through the full cell height without any double-paint glitch.
type CellProps = React.ComponentProps<typeof TableCell>;
const Cell = ({ children, row = 'default', ...rest }: CellProps) => (
  <td className={`p-0 align-top ${row === 'last' ? '' : 'border-b border-[color:var(--table-divider-border)]'}`}>
    <TableCell row={row} className="shadow-none !bg-transparent" {...rest}>{children}</TableCell>
  </td>
);

// Default-table outer container — Figma symbols don't draw a top border;
// the parent surface owns the bottom edge (Last Row variant has no
// inner shadow per Figma 955:864), so a plain border around the table
// closes the box.
const tableShellClasses =
  'rounded-[var(--inset-card-radii)] border border-[color:var(--color-surface-card-border)] bg-[var(--table-body-fill)] overflow-hidden';

// Tailwind selector that lights every cell in a hovered row.
// Only targets <td> — TableCell div is transparent so the full cell height fills.
const rowHoverFill =
  'group/row hover:[&>td]:bg-[var(--table-body-hover-fill)]';

// Default table rule: add a 20px spacer row after the last data row.
// The spacer row is aria-hidden so it's invisible to screen readers.
const BottomGap = ({ colSpan }: { colSpan: number }) => (
  <tr aria-hidden="true">
    <td colSpan={colSpan} className={`h-[var(--spacing-20)] p-0 bg-[var(--table-body-fill)]`} />
  </tr>
);

/* ── s4 Vehicle ───────────────────────────────────────── */

/**
 * Vehicle list — single-line text in most cols, multi-line in the
 * "Vehicle Capacity" col, status pills in the trailing col, and a
 * red expiry date in the Road Tax column. The red date is per-value
 * emphasis (`tone="danger"`), NOT a row-level state — only that one
 * row's date glows red, the rest of the row stays default.
 */
export const S4Vehicle: Story = {
  render: () => {
    // Reference shows only the active (cursor-hovered) row's first column
    // in green — modeled here as `active: true` on the first row.
    // boldOnRowHover wires the rest: any row hovered → that row's first
    // cell bolds via group-hover/row.
    const rows = [
      { reg: 'PLS 9999', type: 'Triton/L200', expiry: '24 May 2026', expiryWarn: false, driver: '-', weight: '3,000kg', capacity: '3.02m³', status: 'Available', statusType: 'success' as const, active: true },
      { reg: 'PKT 8677', type: 'Mitsubishi Fuso', expiry: '24 May 2026', expiryWarn: false, driver: 'Mohd. Ahmad', weight: '3,000kg', capacity: '3.02m³', status: 'Assigned', statusType: 'info' as const, active: false },
      { reg: 'WWE 6767', type: 'Triton/L200', expiry: '24 May 2026', expiryWarn: false, driver: 'Lim Wen Chong', weight: '3,000kg', capacity: '3.02m³', status: 'Maintenance', statusType: 'alert' as const, active: false },
      { reg: 'PHK 8689', type: 'Mitsubishi Fuso', expiry: '24 May 2025', expiryWarn: true, driver: '-', weight: '3,000kg', capacity: '3.02m³', status: 'Maintenance', statusType: 'alert' as const, active: false },
    ];
    return (
      <div className={tableShellClasses}>
        <table className="border-collapse w-full table-fixed">
          <thead>
            <tr>
              <TH
                column="first"
                align="left"
                label="Vehicle Registration No."
                checkbox={<Checkbox size="sm" />}
              />
              <TH column="center" align="left" label="Vehicle Type" />
              <TH column="center" align="left" label="Road Tax Expired Date" />
              <TH column="center" align="left" label="Assigned Driver" />
              <TH column="center" align="left" label="Vehicle Capacity" />
              <TH column="last" align="left" label="Vehicle Status" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i, arr) => {
              const lastRow = i === arr.length - 1 ? 'last' : 'default';
              return (
                <tr key={r.reg} className={rowHoverFill}>
                  <Cell
                    column="first"
                    align="left"
                    row={lastRow}
                    weight="bold"
                    boldOnRowHover
                    tone={r.active ? 'success' : 'default'}
                    greenOnRowHover={!r.active}
                    checkbox={<Checkbox size="sm" />}
                  >
                    {r.reg}
                  </Cell>
                  <Cell column="center" align="left" row={lastRow}>
                    {r.type}
                  </Cell>
                  <Cell
                    column="center"
                    align="left"
                    row={lastRow}
                    tone={r.expiryWarn ? 'danger' : 'default'}
                  >
                    {r.expiry}
                  </Cell>
                  <Cell column="center" align="left" row={lastRow}>
                    {r.driver}
                  </Cell>
                  <Cell column="center" align="left" row={lastRow}>
                    <TableCellInfo
                      alignment="vertical"
                      statuses={[
                        { label: 'Weight', body: r.weight },
                        { label: 'Capacity', body: r.capacity },
                      ]}
                    />
                  </Cell>
                  <Cell column="last" align="left" row={lastRow}>
                    <Pip type={r.statusType} pipStyle="default" label={r.status} />
                  </Cell>
                </tr>
              );
            })}
            <BottomGap colSpan={6} />
          </tbody>
        </table>
      </div>
    );
  },
};

/* ── s7 Webstore Order Return ─────────────────────────── */

/**
 * Order return list — every text column is a small label/value stack
 * (TableCellInfo with alignment="vertical"), one column hosts a
 * status pill, and a trailing column hosts a stack of action labels
 * with × indicators. Proves TableCellInfo slots cleanly inside
 * default-mode (non-inset) cells, not just inset ones.
 */
export const S7WebstoreOrderReturn: Story = {
  render: () => {
    const rows = [
      { id: '#R-00095', orderId: '#R-00095', requestOn: '18 Oct 2025, 6:45pm', orderOn: '15 Oct 2025, 3:33pm', total: 'RM230.00', status: 'Pending', statusType: 'info' as const },
      { id: '#R-00092', orderId: '#R-00092', requestOn: '18 Oct 2025, 6:45pm', orderOn: '16 Oct 2025, 4:15pm', total: 'RM250.00', status: 'Approved', statusType: 'info' as const },
      { id: '#R-00091', orderId: '#R-00091', requestOn: '18 Oct 2025, 6:45pm', orderOn: '17 Oct 2025, 5:00pm', total: 'RM270.00', status: 'Rejected', statusType: 'alert' as const },
      { id: '#R-00090', orderId: '#R-00090', requestOn: '18 Oct 2025, 6:45pm', orderOn: '17 Oct 2025, 5:00pm', total: 'RM290.00', status: 'Closed', statusType: 'muted' as const },
    ];
    return (
      <div className={tableShellClasses}>
        <table className="border-collapse w-full table-fixed">
          <thead>
            <tr>
              <TH
                column="first"
                align="left"
                label="Request ID"
                checkbox={<Checkbox size="sm" />}
              />
              <TH column="center" align="left" label="Date" />
              <TH column="center" align="left" label="Order Total" />
              <TH column="center" align="left" label="Status" />
              <TH column="last" align="left" label="Stock" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i, arr) => {
              const lastRow = i === arr.length - 1 ? 'last' : 'default';
              return (
                <tr key={r.id} className={rowHoverFill}>
                  <Cell
                    column="first"
                    align="left"
                    row={lastRow}
                    weight="bold"
                    boldOnRowHover
                    checkbox={<Checkbox size="sm" />}
                  >
                    <TableCellInfo
                      alignment="vertical"
                      primaryGreenOnRowHover
                      statuses={[
                        { label: '', body: r.id },
                        { label: 'Order ID', body: r.orderId },
                      ]}
                    />
                  </Cell>
                  <Cell column="center" align="left" row={lastRow}>
                    <TableCellInfo
                      alignment="vertical"
                      statuses={[
                        { label: 'Request on', body: r.requestOn },
                        { label: 'Order on', body: r.orderOn },
                      ]}
                    />
                  </Cell>
                  <Cell column="center" align="left" row={lastRow}>
                    {r.total}
                  </Cell>
                  <Cell column="center" align="left" row={lastRow}>
                    <Pip type={r.statusType} pipStyle="default" label={r.status} />
                  </Cell>
                  <Cell column="last" align="left" row={lastRow}>
                    <div className="flex flex-col gap-[var(--spacing-4)]">
                      {['Received', 'Draft', 'Restore'].map((label) => (
                        <span key={label} className="inline-flex items-center gap-[var(--spacing-8)]">
                          <span>{label}</span>
                          <Icon name="close" size={17} color="var(--color-sys-red-DEFAULT)" />
                        </span>
                      ))}
                    </div>
                  </Cell>
                </tr>
              );
            })}
            <BottomGap colSpan={5} />
          </tbody>
        </table>
      </div>
    );
  },
};

/* ── s8 Stock Check ───────────────────────────────────── */

/**
 * Simplest default-mode table: 7 columns of mostly single-line text plus
 * two trailing pill columns (Status + User). Multi-line "Task Name" cell
 * is a vertical TableCellInfo (task title above warehouse). Proves the
 * baseline default-mode rendering — header height, body padding,
 * divider tokens, hover fill, last-row no-divider.
 */
export const S8StockCheck: Story = {
  render: () => {
    const rows = [
      { id: '#SC-0583', taskName: 'Test Check', warehouse: 'KL Warehouse', type: 'Checking', created: '2025-12-08 02:55 PM', items: 5, remark: '', status: 'Assigned', user: 'Incomplete', statusType: 'success' as const, userType: 'info' as const },
      { id: '#SC-0582', taskName: 'Test Check', warehouse: 'Penang Warehouse', type: 'Checking', created: '2025-12-08 02:55 PM', items: 3, remark: '', status: 'Assigned', user: 'Incomplete', statusType: 'success' as const, userType: 'info' as const },
      { id: '#SC-0581', taskName: 'Test 2', warehouse: 'Penang Warehouse', type: 'Counting', created: '2025-12-08 02:55 PM', items: 1, remark: '', status: 'Assigned', user: 'Incomplete', statusType: 'success' as const, userType: 'info' as const },
      { id: '#SC-0580', taskName: 'Test 1', warehouse: 'KL Warehouse', type: 'Checking', created: '2025-12-08 02:55 PM', items: 1, remark: '', status: 'Assigned', user: 'Incomplete', statusType: 'success' as const, userType: 'info' as const },
    ];
    return (
      <div className={tableShellClasses}>
        <table className="border-collapse w-full table-fixed">
          <thead>
            <tr>
              <TH
                column="first"
                align="left"
                label="Stock Check ID"
                checkbox={<Checkbox size="sm" />}
                sortable
              />
              <TH column="center" align="left" label="Task Name" sortable />
              <TH column="center" align="left" label="Type" />
              <TH column="center" align="left" label="Created Time" sortable />
              <TH column="center" align="left" label="Item" />
              <TH column="center" align="left" label="Remark" />
              <TH column="center" align="left" label="Status" />
              <TH column="last" align="left" label="User" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i, arr) => {
              const lastRow = i === arr.length - 1 ? 'last' : 'default';
              return (
                <tr key={r.id} className={rowHoverFill}>
                  <Cell
                    column="first"
                    align="left"
                    row={lastRow}
                    weight="bold"
                    boldOnRowHover
                    greenOnRowHover
                    checkbox={<Checkbox size="sm" />}
                  >
                    {r.id}
                  </Cell>
                  <Cell column="center" align="left" row={lastRow}>
                    <TableCellInfo
                      alignment="vertical"
                      statuses={[
                        { label: '', body: r.taskName },
                        { label: '', body: r.warehouse },
                      ]}
                    />
                  </Cell>
                  <Cell column="center" align="left" row={lastRow}>
                    {r.type}
                  </Cell>
                  <Cell column="center" align="left" row={lastRow}>
                    {r.created}
                  </Cell>
                  <Cell column="center" align="left" row={lastRow}>
                    {r.items}
                  </Cell>
                  <Cell column="center" align="left" row={lastRow}>
                    {r.remark || '-'}
                  </Cell>
                  <Cell column="center" align="left" row={lastRow}>
                    <Pip type={r.statusType} pipStyle="default" label={r.status} />
                  </Cell>
                  <Cell column="last" align="left" row={lastRow}>
                    <Pip type={r.userType} pipStyle="default" label={r.user} />
                  </Cell>
                </tr>
              );
            })}
            <BottomGap colSpan={8} />
          </tbody>
        </table>
      </div>
    );
  },
};
