import type { Meta, StoryObj } from '@storybook/react-vite';
import { SortBlock } from './SortBlock';
import { Icon } from '../Icon';
import { Pip } from '../Pip';
import { TextLink } from '../TextLink';
import { DashedButton } from '../DashedButton';
import { IconLink } from '../IconLink';
import { TableHeaderCell } from '../TableHeaderCell';

const meta = {
  title: 'Information/SortBlock',
  component: SortBlock,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    orientation: 'horizontal',
    rows: [{ label: 'Label', value: 'Value' }],
  },
  render: (args) => <SortBlock {...args} />,
} satisfies Meta<typeof SortBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-[var(--spacing-8)]">
    <span className="text-[length:var(--text-12)] text-[color:var(--color-text-info)]">
      {label}
    </span>
    {children}
  </div>
);

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-[var(--spacing-24)]">{children}</div>
);

const Group = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap items-start gap-[var(--spacing-16)]">{children}</div>
);

/* ──────────────────────────────────────────────────────────────────────── */

export const Default: Story = {};

export const OrientationsAndRowCounts: Story = {
  render: () => (
    <Stack>
      <Row label="Horizontal · 1 row · Readonly">
        <SortBlock rows={[{ label: 'Label', value: 'Value' }]} />
      </Row>
      <Row label="Horizontal · 1 row · Readonly Bold">
        <SortBlock rows={[{ label: 'Label', value: 'Value', bold: true }]} />
      </Row>
      <Row label="Horizontal · 2 rows · Readonly">
        <SortBlock
          rows={[
            { label: 'Label', value: 'Value' },
            { label: 'Label 2', value: 'Value 2' },
          ]}
        />
      </Row>
      <Row label="Horizontal · 2 rows · Readonly Bold (both rows bold)">
        <SortBlock
          rows={[
            { label: 'Label', value: 'Value', bold: true },
            { label: 'Label 2', value: 'Value 2', bold: true },
          ]}
        />
      </Row>
      <Row label="Vertical · 1 row · Readonly">
        <SortBlock orientation="vertical" rows={[{ label: 'Label', value: 'Value' }]} />
      </Row>
      <Row label="Vertical · 1 row · Readonly Bold">
        <SortBlock
          orientation="vertical"
          rows={[{ label: 'Label', value: 'Value', bold: true }]}
        />
      </Row>
      <Row label="Vertical · 2 rows · Readonly">
        <SortBlock
          orientation="vertical"
          rows={[
            { label: 'Label', value: 'Value' },
            { label: 'Label 2', value: 'Value 2' },
          ]}
        />
      </Row>
      <Row label="Vertical · 2 rows · Readonly Bold">
        <SortBlock
          orientation="vertical"
          rows={[
            { label: 'Label', value: 'Value', bold: true },
            { label: 'Label 2', value: 'Value 2', bold: true },
          ]}
        />
      </Row>
    </Stack>
  ),
};

export const MainSub: Story = {
  render: () => (
    <Stack>
      <Row label="Readonly — main and sub rows both regular weight">
        <SortBlock
          orientation="vertical"
          rows={[
            { label: 'Main Label', value: 'Main Value' },
            { label: 'Sub Label', value: 'Sub Value', caption: true },
          ]}
        />
      </Row>
      <Row label="Readonly Bold Main — only the main value is bold; sub stays regular">
        <SortBlock
          orientation="vertical"
          rows={[
            { label: 'Main Label', value: 'Main Value', bold: true },
            { label: 'Sub Label', value: 'Sub Value', caption: true },
          ]}
        />
      </Row>
    </Stack>
  ),
};

export const BodyVariants: Story = {
  render: () => (
    <Stack>
      <Row label="Icon-prefixed value (e.g. date with calendar/clock prefix)">
        <Group>
          <SortBlock>
            <Icon name="clock" size={17} color="var(--color-set-lightest)" />
            <span className="text-[length:var(--text-14)] leading-[var(--leading-17)] text-[color:var(--color-text-primary)]">
              Value
            </span>
          </SortBlock>
          <SortBlock>
            <Icon name="calendar" size={17} color="var(--color-set-lightest)" />
            <span className="text-[length:var(--text-14)] leading-[var(--leading-17)] text-[color:var(--color-text-primary)]">
              2020-08-18
            </span>
          </SortBlock>
        </Group>
      </Row>
      <Row label="Drag handle — body is just an icon">
        <SortBlock>
          <Icon name="drag" size={17} color="var(--color-set-lightest)" />
        </SortBlock>
      </Row>
      <Row label="Tag — Pip body">
        <Group>
          <SortBlock>
            <Pip type="success" label="Pip Text" />
          </SortBlock>
          <SortBlock>
            <Pip type="alert" label="Alert" />
          </SortBlock>
        </Group>
      </Row>
      <Row label="Button — TextLink or DashedButton body">
        <Group>
          <SortBlock>
            <TextLink label="Button" />
          </SortBlock>
          <SortBlock>
            <DashedButton>
              <Icon name="plus" size={17} />
              Button
            </DashedButton>
          </SortBlock>
        </Group>
      </Row>
      <Row label="Image — 41x41 thumbnail body">
        <Group>
          <SortBlock>
            <div className="size-[41px] bg-[color:var(--color-set-DEFAULT)] rounded-[var(--radius-4)]" />
          </SortBlock>
          <SortBlock>
            <div className="size-[41px] bg-[color:var(--color-space-light)] rounded-[var(--radius-4)] border border-[color:var(--color-space-dark)]" />
          </SortBlock>
        </Group>
      </Row>
    </Stack>
  ),
};

export const SortableRowComposition: Story = {
  render: () => {
    // Drop the SortBlock chrome (bg + padding) for cells inside the row —
    // the parent row already paints the grey strip; cells just contribute
    // their label/value typography.
    const cellOverride =
      'inline-flex items-start gap-[var(--spacing-8)] px-[var(--spacing-12)] py-[var(--spacing-12)]';
    return (
      <Stack>
        <Row label="The sb6 composition: one continuous grey row, cells flow inline (no dividers, no inter-cell gap)">
          <div className="inline-flex items-stretch bg-[color:var(--sorting-block-sorting-fill)]">
            <div className="flex items-center px-[var(--spacing-8)]">
              <Icon name="drag" size={17} color="var(--color-set-lightest)" />
            </div>
            <div className="flex items-center px-[var(--spacing-4)] text-[length:var(--text-14)] leading-[var(--leading-17)] text-[color:var(--color-text-primary)] font-[var(--font-weight-medium)]">
              1
            </div>
            <SortBlock
              className={cellOverride}
              rows={[{ label: '', value: '2023-03-09-1' }]}
            />
            <SortBlock className={cellOverride}>
              <Icon name="calendar" size={17} color="var(--color-set-lightest)" />
              <span className="text-[length:var(--text-14)] leading-[var(--leading-17)] text-[color:var(--color-text-primary)]">
                2020-08-18
              </span>
            </SortBlock>
            <SortBlock
              className={cellOverride}
              rows={[{ label: 'Notes', value: 'testinggggggggggggg' }]}
            />
            <div className="flex items-center px-[var(--spacing-12)]">
              <IconLink icon="close" variant="close" aria-label="Remove row" />
            </div>
          </div>
        </Row>
      </Stack>
    );
  },
};

/**
 * Inset Header + SortBlock Cells — pairing inset TableHeaderCells above
 * rows where every cell is its own SortBlock with a grey fill, abutting
 * horizontally so the row reads as one strip.
 *
 * This is the canonical composition for "draggable list inside a card"
 * patterns (e.g. the live ERP "Add Trip → Package List" screen, Figma
 * 3479:35614). The Figma design exposes per-column SortBlock variants:
 *   - SortBlockIcon (drag, close): pl-12 pr-16 py-12 with a 17px icon
 *   - SortBlockDefault (tracking, delivery): px-6 py-12 with rows API
 *   - SortBlockMainSub (customer): vertical 14/17 + 12/17 stack, gap-4
 *   - SortBlockLongContent (address): flex-col of value paragraphs
 *
 * Our shipped SortBlock supports horizontal/vertical rows + a children
 * escape hatch. For cells that can't use rows (no label, must wrap, or
 * gap-mismatch), use the children API and write the value spans
 * directly with the right --general-* typography tokens.
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

    // Per-cell SortBlock chrome:
    //   - icon cells: pl-12 pr-16 py-12 (Figma SortBlockIcon)
    //   - text cells: px-6 py-12 with gap-8 between label/value cols
    //     (Figma SortBlockDefault)
    const sbIconCell =
      'flex items-start self-stretch ' +
      'bg-[color:var(--sorting-block-sorting-fill)] ' +
      'pl-[var(--spacing-12)] pr-[var(--spacing-16)] py-[var(--spacing-12)]';
    const sbTextCell =
      'flex items-start self-stretch ' +
      'bg-[color:var(--sorting-block-sorting-fill)] ' +
      'px-[var(--spacing-6)] py-[var(--spacing-12)] ' +
      'gap-[var(--spacing-8)]';

    return (
      <div className="flex flex-col gap-[var(--spacing-8)]">
        {/* Header — flex of 6 inset TableHeaderCells */}
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

        {/* Body rows — flex of 6 SortBlocks per row, gap-4 between rows */}
        <div className="flex flex-col gap-[var(--spacing-4)]">
          {rows.map((row) => (
            <div key={row.id} className="flex w-full">
              {/* Drag */}
              <SortBlock className={`${sbIconCell} w-[45px]`}>
                <Icon
                  name="drag"
                  size={17}
                  className="text-[color:var(--color-icon-secondary)] cursor-grab"
                />
              </SortBlock>

              {/* Tracking — bold value via children */}
              <SortBlock className={`${sbTextCell} flex-1 min-w-0`}>
                <span
                  className="font-[family-name:var(--general-font-family)] font-[var(--font-weight-bold)]
                             text-[length:var(--general-body-size)] leading-[var(--general-body-slim-lineheight)]
                             text-[color:var(--color-text-primary)] whitespace-nowrap"
                >
                  {row.tracking}
                </span>
              </SortBlock>

              {/* Delivery — regular value via children */}
              <SortBlock className={`${sbTextCell} w-[166px]`}>
                <span
                  className="font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)]
                             text-[length:var(--general-body-size)] leading-[var(--general-body-slim-lineheight)]
                             text-[color:var(--color-text-primary)] whitespace-nowrap"
                >
                  {row.deliveryDate}
                </span>
              </SortBlock>

              {/* Customer — MainSub stack via children, gap-4 */}
              <SortBlock
                className="flex flex-col items-start gap-[var(--spacing-4)]
                           bg-[color:var(--sorting-block-sorting-fill)]
                           self-stretch w-[130px]
                           px-[var(--spacing-6)] py-[var(--spacing-12)]"
              >
                <span
                  className="font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)]
                             text-[length:var(--general-body-size)] leading-[var(--general-body-slim-lineheight)]
                             text-[color:var(--color-text-primary)] whitespace-nowrap"
                >
                  {row.customerName}
                </span>
                <span
                  className="font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)]
                             text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)]
                             text-[color:var(--color-text-primary)] whitespace-nowrap"
                >
                  {row.customerPhone}
                </span>
              </SortBlock>

              {/* Address — LongContent multi-line stack via children */}
              <SortBlock
                className="flex flex-col items-start
                           bg-[color:var(--sorting-block-sorting-fill)]
                           self-stretch w-[203px]
                           px-[var(--spacing-6)] py-[var(--spacing-12)]"
              >
                {row.addressLines.map((line, i) => (
                  <span
                    key={i}
                    className="font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)]
                               text-[length:var(--general-body-size)] leading-[var(--general-body-slim-lineheight)]
                               text-[color:var(--color-text-primary)]"
                  >
                    {line}
                  </span>
                ))}
              </SortBlock>

              {/* Close — Icon button via children */}
              <SortBlock className={`${sbIconCell} w-[45px]`}>
                <button
                  type="button"
                  aria-label="Remove package"
                  className="inline-flex items-center justify-center bg-transparent border-none p-0 cursor-pointer"
                >
                  <Icon
                    name="close"
                    size={17}
                    className="text-[color:var(--color-icon-secondary)]"
                  />
                </button>
              </SortBlock>
            </div>
          ))}
        </div>
      </div>
    );
  },
};
