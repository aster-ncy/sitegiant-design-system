import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { TableCardCell } from './TableCardCell';
import { Checkbox } from '../Checkbox';
import { Pip } from '../Pip';
import { Toggle } from '../Toggle';
import { Button } from '../Button';
import { EllipsisButton } from '../Button';
import { NumberInput } from '../NumberInput';
import { Icon } from '../Icon';
import { TextLink } from '../TextLink';

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

const MatrixLabel = ({ children }: { children: ReactNode }) => (
  <span className="text-[length:var(--text-12)] leading-[var(--leading-15)] text-[color:var(--color-text-info)]">
    {children}
  </span>
);

const MatrixNote = ({ children }: { children: ReactNode }) => (
  <p className="max-w-[760px] text-[length:var(--text-12)] leading-[var(--leading-17)] text-[color:var(--color-text-info)]">
    {children}
  </p>
);

const AppIcon = () => (
  <span className="inline-flex size-[17px] items-center justify-center rounded-[var(--radius-2)] bg-[var(--color-sys-red-light)] text-[color:var(--color-sys-red-DEFAULT)]">
    <Icon name="box" size={13} />
  </span>
);

const UserIcon = () => (
  <span className="inline-flex size-[17px] items-center justify-center rounded-full bg-[var(--color-space-mid)] text-[color:var(--color-icon-secondary)]">
    <Icon name="user" size={13} />
  </span>
);

const ProductThumb = () => (
  <span className="inline-flex size-[32px] items-center justify-center rounded-[var(--radius-2)] bg-[var(--color-space-mid)] text-[color:var(--color-icon-secondary)]">
    <Icon name="box" size={17} />
  </span>
);

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
/**
 * Visual matrix for Figma 3453:7497. This node was already represented
 * by TopTierDefault, TopTierHovered, and TopTierWithLeadingIcon; keep
 * those smaller stories for copyable product code.
 */
export const TopTierFigmaMatrix: Story = {
  render: () => {
    const columns = ['first', 'center', 'last'] as const;
    const states = [
      { label: 'Default', hovered: false },
      { label: 'Hover', hovered: true },
    ];
    const contentRows = [
      {
        label: 'Default',
        render: () => 'Product Name Here',
      },
      {
        label: 'App Icon',
        render: () => 'TikTok Shop',
        leadingIcon: <AppIcon />,
      },
      {
        label: 'User Icon',
        render: () => 'Salesperson Name',
        leadingIcon: <UserIcon />,
      },
      {
        label: 'Product Image',
        render: () => 'Product Name Here',
        leadingIcon: <ProductThumb />,
      },
      {
        label: 'Status',
        render: () => <Pip type="success" pipStyle="default" label="Active" />,
      },
      {
        label: 'Ellipsis',
        render: () => '',
        trailing: <EllipsisButton />,
      },
    ];

    return (
      <div className="flex flex-col gap-[var(--spacing-16)]">
        <MatrixNote>
          Visual check only. Use TopTierDefault, TopTierHovered, or TopTierWithLeadingIcon for copyable product code.
        </MatrixNote>
        <div className="grid grid-cols-[120px_1fr] gap-x-[var(--spacing-16)] gap-y-[var(--spacing-12)]">
          <div />
          <div className="grid grid-cols-3 gap-[var(--spacing-16)]">
            {columns.map((column) => (
              <MatrixLabel key={column}>{column} column</MatrixLabel>
            ))}
          </div>
          {contentRows.flatMap((contentRow) =>
            states.map(({ label, hovered }) => (
              <div key={`${contentRow.label}-${label}`} className="contents">
                <MatrixLabel>
                  {contentRow.label} / {label}
                </MatrixLabel>
                <div className={cardShell}>
                  <table className="border-collapse table-fixed w-[720px]">
                    <tbody>
                      <tr className="group/row">
                        {columns.map((column) => (
                          <td key={column} className="p-0">
                            <TableCardCell
                              tier="top"
                              column={column}
                              hovered={hovered}
                              checkbox={column === 'first' && contentRow.label === 'Default' ? <Checkbox size="sm" /> : undefined}
                              leadingIcon={contentRow.leadingIcon}
                              trailing={column === 'last' ? contentRow.trailing : undefined}
                            >
                              {contentRow.render()}
                            </TableCardCell>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )),
          )}
        </div>
      </div>
    );
  },
};

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

/**
 * Visual matrix for Figma 3453:7727. BottomTierMatrix and
 * BottomTierFormControls stay as the smaller copyable recipes.
 */
export const BottomTierFigmaMatrix: Story = {
  render: () => {
    const columns = ['first', 'center', 'last'] as const;
    const rows = ['first', 'middle', 'last'] as const;
    const states = [
      { label: 'Default', hovered: false },
      { label: 'Hover', hovered: true },
    ];
    const variants = [
      {
        label: 'Default',
        formField: false,
        render: () => 'Information here',
      },
      {
        label: 'Action button',
        formField: true,
        render: () => <TextLink label="View detail" />,
      },
      {
        label: 'Status toggle',
        formField: true,
        render: () => <Toggle checked={true} onChange={() => undefined} />,
      },
      {
        label: 'Form field',
        formField: true,
        render: () => <NumberInput type="stepper" value="1" onChange={() => undefined} />,
      },
    ];

    return (
      <div className="flex flex-col gap-[var(--spacing-20)]">
        <MatrixNote>
          Visual check only. Use BottomTierMatrix or BottomTierFormControls for copyable product code.
        </MatrixNote>
        {variants.map((variant) => (
          <div key={variant.label} className="flex flex-col gap-[var(--spacing-8)]">
            <MatrixLabel>{variant.label}</MatrixLabel>
            <div className="grid grid-cols-[120px_1fr] gap-x-[var(--spacing-16)] gap-y-[var(--spacing-12)]">
              <div />
              <div className="grid grid-cols-3 gap-[var(--spacing-16)]">
                {columns.map((column) => (
                  <MatrixLabel key={column}>{column} column</MatrixLabel>
                ))}
              </div>
              {states.map(({ label, hovered }) => (
                <div key={label} className="contents">
                  <MatrixLabel>{label}</MatrixLabel>
                  <div className={cardShell}>
                    <table className="border-collapse table-fixed w-[720px]">
                      <tbody>
                        {rows.map((row) => (
                          <tr key={row} className="group/row">
                            {columns.map((column) => (
                              <td key={column} className="p-0">
                                <TableCardCell
                                  tier="bottom"
                                  row={row}
                                  column={column}
                                  hovered={hovered}
                                  formField={variant.formField}
                                  checkbox={column === 'first' && variant.label === 'Default' ? <Checkbox size="sm" /> : undefined}
                                  trailing={column === 'last' && variant.label === 'Default' ? <Icon name="box" size={17} /> : undefined}
                                >
                                  {variant.render()}
                                </TableCardCell>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};
