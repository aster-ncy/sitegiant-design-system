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
      <Row label="Readonly — main and sub rows both regular weight (default gap-8)">
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
      <Row label="MainSub flag — gap-4 between pairs (Figma SortBlockMainSub variant)">
        <SortBlock
          orientation="vertical"
          mainSub
          rows={[
            { label: 'Main Label', value: 'Main Value' },
            { label: 'Sub Label', value: 'Sub Value', caption: true },
          ]}
        />
      </Row>
      <Row label="MainSub flag without labels — used for s7-style inline cells">
        <SortBlock
          orientation="vertical"
          mainSub
          rows={[
            { value: 'Wei Kheng' },
            { value: '60 12-456 6556', caption: true },
          ]}
        />
      </Row>
    </Stack>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Stack>
      <Row label="Long content with wrap — value flows onto multiple lines (Figma SortBlockLongContent)">
        <div className="w-[200px]">
          <SortBlock
            className="flex items-start bg-[color:var(--sorting-block-sorting-fill)] px-[var(--spacing-6)] py-[var(--spacing-12)] w-full"
            rows={[
              {
                value:
                  'Long Content Long Content Long Content Long Content Long Content Long Content',
                wrap: true,
              },
            ]}
          />
        </div>
      </Row>
      <Row label="Pre-broken multi-line value — explicit \\n in source string honored">
        <div className="w-[200px]">
          <SortBlock
            className="flex items-start bg-[color:var(--sorting-block-sorting-fill)] px-[var(--spacing-6)] py-[var(--spacing-12)] w-full"
            rows={[
              {
                value:
                  '123, Jalan Mayang Pasir,\n11200 Bayan Baru,\nPulau Pinang, Malaysia.',
                wrap: true,
              },
            ]}
          />
        </div>
      </Row>
    </Stack>
  ),
};

export const NoLabel: Story = {
  render: () => (
    <Stack>
      <Row label="With label (default) — label sits above/beside the value">
        <SortBlock rows={[{ label: 'Tracking No.', value: 'MY123554G85899' }]} />
      </Row>
      <Row label="Empty label — label slot is skipped, value sits at cell start">
        <SortBlock rows={[{ value: 'MY123554G85899', bold: true }]} />
      </Row>
      <Row label="Horizontal mixed labels (2 rows: one labelled, one not) — labelled row keeps its label, unlabelled row's slot collapses to an empty placeholder so column rows still align">
        <SortBlock
          rows={[
            { label: 'Tracking No.', value: 'MY123554G85899' },
            { value: 'MY999999A11111' },
          ]}
        />
      </Row>
      <Row label="Vertical mixed labels — same rule per pair: only labelled rows render their label">
        <SortBlock
          orientation="vertical"
          rows={[
            { label: 'Order ID', value: '878973829' },
            { value: 'CP13010263179835' },
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
 * Our shipped SortBlock's `rows` API covers all four:
 *   - no-label cells: omit `label` (or pass empty string) — the label
 *     slot is skipped
 *   - wrap cells: set `wrap: true` on the row — drops nowrap and
 *     honours \n via whitespace-pre-line
 *   - mainSub gap: set `mainSub` on the SortBlock (when no className
 *     override is needed); call sites that pass className for layout
 *     control encode `gap-4` directly
 * Children API stays for body variants only (icon, button, image, etc.).
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

              {/* Tracking — bold readonly value via rows API */}
              <SortBlock
                className={`${sbTextCell} flex-1 min-w-0`}
                rows={[{ value: row.tracking, bold: true }]}
              />

              {/* Delivery — regular readonly value via rows API */}
              <SortBlock
                className={`${sbTextCell} w-[166px]`}
                rows={[{ value: row.deliveryDate }]}
              />

              {/* Customer — Figma MainSub: vertical 2-row, gap-4.
                  className REPLACES the root, so we hardcode gap-4 here
                  (the `mainSub` prop only drives the gap when no
                  className is passed; here we need self-stretch + width
                  which require full layout control). */}
              <SortBlock
                className="flex flex-col items-start
                           bg-[color:var(--sorting-block-sorting-fill)]
                           self-stretch w-[130px]
                           px-[var(--spacing-6)] py-[var(--spacing-12)]
                           gap-[var(--spacing-4)]"
                orientation="vertical"
                rows={[
                  { value: row.customerName },
                  { value: row.customerPhone, caption: true },
                ]}
              />

              {/* Address — Figma LongContent: wrapping multi-line value */}
              <SortBlock
                className="flex items-start
                           bg-[color:var(--sorting-block-sorting-fill)]
                           self-stretch w-[203px]
                           px-[var(--spacing-6)] py-[var(--spacing-12)]"
                rows={[{ value: row.addressLines.join('\n'), wrap: true }]}
              />

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
