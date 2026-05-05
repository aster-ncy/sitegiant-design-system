import type { Meta, StoryObj } from '@storybook/react-vite';
import { SortBlockDefault } from './SortBlockDefault';
import { SortBlockMainSub } from './SortBlockMainSub';
import { SortBlockLongContent } from './SortBlockLongContent';
import { SortBlockIcon } from './SortBlockIcon';
import { Icon } from '../Icon';
import { IconLink } from '../IconLink';
import { TableHeaderCell } from '../TableHeaderCell';

const meta = {
  title: 'Information/SortBlock/Composition Examples',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * sb6 — single continuous grey row with cells flowing inline. Each cell is
 * a SortBlock-family member with `bg-transparent` to drop its own fill (the
 * parent paints one continuous strip).
 */
export const SortableRowComposition: Story = {
  render: () => (
    <div className="inline-flex items-stretch bg-[color:var(--sorting-block-sorting-fill)]">
      <div className="flex items-center px-[var(--spacing-8)]">
        <Icon name="drag" size={17} color="var(--color-set-lightest)" />
      </div>
      <div className="flex items-center px-[var(--spacing-4)] text-[length:var(--text-14)] leading-[var(--leading-17)] text-[color:var(--color-text-primary)] font-[var(--font-weight-medium)]">
        1
      </div>
      <SortBlockDefault
        className="bg-transparent px-[var(--spacing-12)]"
        rows={[{ value: '2023-03-09-1' }]}
      />
      {/* Calendar + date pair — no single family member matches this
          shape. SortBlockIcon enforces pl-12 pr-16 icon-only padding;
          SortBlockDefault's rows API has no icon slot. Rendered as a
          raw inline cell that matches the surrounding `cellOverride`
          padding. items-start matches the family cells' default
          alignment so the pair pins to top if the row stretches. A
          future "IconText" family member would absorb this pattern. */}
      <div className="inline-flex items-start gap-[var(--spacing-8)] px-[var(--spacing-12)] py-[var(--spacing-12)]">
        <Icon name="calendar" size={17} color="var(--color-set-lightest)" />
        <span className="text-[length:var(--text-14)] leading-[var(--leading-17)] text-[color:var(--color-text-primary)]">
          2020-08-18
        </span>
      </div>
      <SortBlockDefault
        className="bg-transparent px-[var(--spacing-12)]"
        rows={[{ label: 'Notes', value: 'testinggggggggggggg' }]}
      />
      <div className="flex items-center px-[var(--spacing-12)]">
        <IconLink icon="close" variant="close" aria-label="Remove row" />
      </div>
    </div>
  ),
};

/**
 * Inset Header + SortBlock Cells — pairing inset TableHeaderCells above
 * rows where every cell is its own SortBlock family member abutting
 * horizontally so the row reads as one strip.
 *
 * Canonical composition for "draggable list inside a card" patterns
 * (e.g. live ERP "Add Trip → Package List", Figma 3479:35614).
 */
export const InsetHeaderWithSortBlockRows: Story = {
  render: () => {
    const rows = [
      {
        id: 'pkg-1',
        tracking: 'MY123554G85899',
        deliveryDate: '08 May 2025 4:00PM',
        customerName: 'Wei Kheng',
        customerPhone: '60 12-456 6556',
        addressLines: ['123, Jalan Mayang Pasir,', '11200 Bayan Baru,', 'Pulau Pinang, Malaysia.'],
      },
      {
        id: 'pkg-2',
        tracking: 'MY123554G85899',
        deliveryDate: '08 May 2025 4:00PM',
        customerName: 'Wei Kheng',
        customerPhone: '60 12-456 6556',
        addressLines: ['123, Jalan Mayang Pasir,', '11200 Bayan Baru,', 'Pulau Pinang, Malaysia.'],
      },
    ];

    return (
      <div className="flex flex-col gap-[var(--spacing-8)]">
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

        <div className="flex flex-col gap-[var(--spacing-4)]">
          {rows.map((row) => (
            <div key={row.id} className="flex w-full">
              <SortBlockIcon className="self-stretch w-[45px]">
                <Icon name="drag" size={17} color="var(--color-icon-secondary)" className="cursor-grab" />
              </SortBlockIcon>
              <SortBlockDefault
                state="Readonly Bold"
                className="self-stretch flex-1 min-w-0"
                rows={[{ value: row.tracking }]}
              />
              <SortBlockDefault
                className="self-stretch w-[166px]"
                rows={[{ value: row.deliveryDate }]}
              />
              <SortBlockMainSub
                className="self-stretch w-[130px]"
                rows={[{ value: row.customerName }, { value: row.customerPhone }]}
              />
              <SortBlockLongContent
                className="self-stretch w-[203px]"
                rows={[{ value: row.addressLines.join('\n') }]}
              />
              <SortBlockIcon className="self-stretch w-[45px]">
                <button
                  type="button"
                  aria-label="Remove package"
                  className="inline-flex items-center justify-center bg-transparent border-none p-0 cursor-pointer"
                >
                  <Icon name="close" size={17} color="var(--color-icon-secondary)" />
                </button>
              </SortBlockIcon>
            </div>
          ))}
        </div>
      </div>
    );
  },
};
