import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableCardCell } from './TableCardCell';
import { Checkbox } from '../Checkbox';
import { Pip } from '../Pip';
import { Toggle } from '../Toggle';
import { Button } from '../Button';
import { EllipsisButton } from '../Button';
import { NumberInput } from '../NumberInput';

const meta = {
  title: 'Tables/TableCardCell',
  component: TableCardCell,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof TableCardCell>;

export default meta;
type Story = StoryObj<typeof TableCardCell>;

// Outer card recipe — every story wraps cells in this shell so the
// rounded corners visually close the box.
const cardShell = 'rounded-[var(--radius-4)] overflow-hidden inline-block';

/* ── Top Tier ────────────────────────────────────────── */

/** Top Tier 3-column row — Default state. Hover the row to see bold
 *  + green text on every cell (parent-driven via `group/row`). */
export const TopTierDefault: Story = {
  render: () => (
    <div className={cardShell}>
      <table className="border-collapse table-fixed w-[600px]">
        <tbody>
          <tr className="group/row">
            <td className="p-0">
              <TableCardCell tier="top" column="first" checkbox={<Checkbox size="sm" />}>
                Product Name Here
              </TableCardCell>
            </td>
            <td className="p-0">
              <TableCardCell tier="top" column="center">Center cell</TableCardCell>
            </td>
            <td className="p-0">
              <TableCardCell tier="top" column="last" trailing={<EllipsisButton />}>
                Last cell
              </TableCardCell>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

/** Top Tier with `hovered` prop forced — proves the bold-green text
 *  state outside of mouse-hover (useful for visual regression). */
export const TopTierHovered: Story = {
  render: () => (
    <div className={cardShell}>
      <table className="border-collapse table-fixed w-[600px]">
        <tbody>
          <tr>
            <td className="p-0">
              <TableCardCell tier="top" column="first" hovered>
                Hovered first
              </TableCardCell>
            </td>
            <td className="p-0">
              <TableCardCell tier="top" column="center" hovered>Hovered center</TableCardCell>
            </td>
            <td className="p-0">
              <TableCardCell tier="top" column="last" hovered>
                Hovered last
              </TableCardCell>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

/** Top Tier with leadingIcon (App Icon / Product Image equivalents). */
export const TopTierWithLeadingIcon: Story = {
  render: () => (
    <div className={cardShell}>
      <table className="border-collapse table-fixed w-[600px]">
        <tbody>
          <tr className="group/row">
            <td className="p-0">
              <TableCardCell
                tier="top"
                column="first"
                leadingIcon={<span className="size-[21px] rounded-[var(--radius-4)] bg-[var(--color-set-light)] inline-block" />}
              >
                Product with icon
              </TableCardCell>
            </td>
            <td className="p-0">
              <TableCardCell tier="top" column="center">
                <Pip type="success" pipStyle="default" label="Active" />
              </TableCardCell>
            </td>
            <td className="p-0">
              <TableCardCell tier="top" column="last" trailing={<EllipsisButton />} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

/* ── Bottom Tier ─────────────────────────────────────── */

/** Bottom Tier 3-row × 3-column matrix — proves continuous-strip
 *  borders + last-row rounded corners. Hover any row to see fill flip. */
export const BottomTierMatrix: Story = {
  render: () => {
    const rows: Array<'first' | 'middle' | 'last'> = ['first', 'middle', 'last'];
    return (
      <div className={cardShell}>
        <table className="border-collapse table-fixed w-[600px]">
          <tbody>
            {rows.map((row) => (
              <tr key={row} className="group/row">
                <td className="p-0">
                  <TableCardCell tier="bottom" row={row} column="first">
                    {row} first
                  </TableCardCell>
                </td>
                <td className="p-0">
                  <TableCardCell tier="bottom" row={row} column="center">
                    {row} center
                  </TableCardCell>
                </td>
                <td className="p-0">
                  <TableCardCell tier="bottom" row={row} column="last">
                    {row} last
                  </TableCardCell>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
};

/** Bottom Tier hosting form controls — `formField` flips inner
 *  alignment to items-center so NumberInput / Toggle / Button sit
 *  vertically centred in the cell. */
export const BottomTierFormControls: Story = {
  render: () => (
    <div className={cardShell}>
      <table className="border-collapse table-fixed w-[600px]">
        <tbody>
          <tr className="group/row">
            <td className="p-0">
              <TableCardCell tier="bottom" row="first" column="first" formField>
                <NumberInput value="1" onChange={() => undefined} />
              </TableCardCell>
            </td>
            <td className="p-0">
              <TableCardCell
                tier="bottom"
                row="first"
                column="center"
                formField
                trailing={<Toggle checked={true} onChange={() => undefined} />}
              />
            </td>
            <td className="p-0">
              <TableCardCell
                tier="bottom"
                row="last"
                column="last"
                formField
                trailing={<Button variant="primary" size="sm" label="Save" />}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};
