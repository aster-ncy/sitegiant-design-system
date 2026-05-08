import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import { SortBlockGroup } from './SortBlockGroup';
import { SortBlockDefault } from './SortBlockDefault';
import { SortBlockMainSub } from './SortBlockMainSub';
import { SortBlockLongContent } from './SortBlockLongContent';
import { SortBlockIcon } from './SortBlockIcon';
import { Icon } from '../Icon';

const meta = {
  title: 'Information/SortBlock/SortBlockGroup',
  component: SortBlockGroup,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    dragging: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof SortBlockGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Fixture matching the S7 Add Trip row ─────────────────────────── */

interface RowData {
  id: string;
  tracking: string;
  deliveryDate: string;
  customerName: string;
  customerPhone: string;
  addressLines: string[];
}

const ROWS: RowData[] = [
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
    tracking: 'MY998877Z11203',
    deliveryDate: '09 May 2025 10:00AM',
    customerName: 'Aster',
    customerPhone: '60 11-222 3344',
    addressLines: ['88, Jalan Cempaka,', '50480 Kuala Lumpur, Malaysia.'],
  },
  {
    id: 'pkg-3',
    tracking: 'MY555444X90876',
    deliveryDate: '10 May 2025 2:30PM',
    customerName: 'Gracy',
    customerPhone: '60 13-789 0001',
    addressLines: ['12, Jalan SS2/24,', '47300 Petaling Jaya, Selangor, Malaysia.'],
  },
];

const Row = ({ row }: { row: RowData }) => (
  <>
    <SortBlockIcon className="self-stretch w-[45px]">
      <Icon name="drag" size={17} color="var(--color-icon-secondary)" />
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
  </>
);

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-[var(--spacing-4)]">{children}</div>
);

/* ── Default — three plain rows ───────────────────────────────────── */

export const Default: Story = {
  render: () => (
    <Stack>
      {ROWS.map((row) => (
        <SortBlockGroup key={row.id}>
          <Row row={row} />
        </SortBlockGroup>
      ))}
    </Stack>
  ),
};

/* ── Dragging — middle row darker ─────────────────────────────────── */

export const Dragging: Story = {
  render: () => (
    <Stack>
      {ROWS.map((row, i) => (
        <SortBlockGroup key={row.id} dragging={i === 1}>
          <Row row={row} />
        </SortBlockGroup>
      ))}
    </Stack>
  ),
};

/* ── Disabled — last row lighter + aria-disabled ──────────────────── */

export const Disabled: Story = {
  render: () => (
    <Stack>
      {ROWS.map((row, i) => (
        <SortBlockGroup key={row.id} disabled={i === ROWS.length - 1}>
          <Row row={row} />
        </SortBlockGroup>
      ))}
    </Stack>
  ),
};

/* ── DisabledWinsOverDragging — both true; visual is disabled ─────── */

export const DisabledWinsOverDragging: Story = {
  render: () => (
    <Stack>
      <SortBlockGroup dragging disabled>
        <Row row={ROWS[0]} />
      </SortBlockGroup>
    </Stack>
  ),
};

/* ── InteractiveDnD — drag rows to reorder ───────────────────────── */

/**
 * Demonstrates real drag-and-drop wiring with a sibling-aware row swap.
 * The dragged row flips to `dragging` mid-grab so the darker fill is
 * visible across every cell while the cursor moves.
 *
 * Implementation note: this story uses the native HTML5 drag API
 * (`draggable` + `onDragStart` / `onDragOver` / `onDragEnd`) for a
 * dependency-free demo. Production wiring will use `@dnd-kit/sortable`
 * — see the spec's "DOM pass-through and ref forwarding" section for
 * how `setNodeRef`, `transform`, and `listeners` will attach.
 */
const InteractiveDnDDemo = () => {
  const [items, setItems] = useState<RowData[]>(ROWS);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Track the last over-target we acted on. dragover fires continuously
  // while the pointer hovers a row, and after a swap the dragged row is now
  // adjacent to the original over-row — without a guard the next event
  // would oscillate the swap back. Reset on dragend so the same target can
  // be re-entered after leaving.
  const lastOverIdRef = useRef<string | null>(null);

  const handleDragOver = (overId: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggingId || draggingId === overId) return;
    if (lastOverIdRef.current === overId) return;
    lastOverIdRef.current = overId;
    setItems((current) => {
      const from = current.findIndex((r) => r.id === draggingId);
      const to = current.findIndex((r) => r.id === overId);
      if (from === -1 || to === -1) return current;
      const next = current.slice();
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-[var(--spacing-12)]">
      <p className="text-[length:var(--text-12)] leading-[var(--leading-17)] text-[color:var(--color-text-info)]">
        Grab a row by any cell and drag to reorder. The dragged row darkens via the
        SortBlockGroup `dragging` prop until released.
      </p>
      <Stack>
        {items.map((row) => (
          <SortBlockGroup
            key={row.id}
            dragging={draggingId === row.id}
            draggable
            onDragStart={(e) => {
              setDraggingId(row.id);
              lastOverIdRef.current = null;
              e.dataTransfer.effectAllowed = 'move';
              // Some browsers refuse to initiate a drag without payload data.
              e.dataTransfer.setData('text/plain', row.id);
            }}
            onDragOver={handleDragOver(row.id)}
            onDragEnd={() => {
              setDraggingId(null);
              lastOverIdRef.current = null;
            }}
            className="cursor-grab active:cursor-grabbing"
          >
            <Row row={row} />
          </SortBlockGroup>
        ))}
      </Stack>
    </div>
  );
};

export const InteractiveDnD: Story = {
  render: () => <InteractiveDnDDemo />,
};

/* ── WithRef — confirms forwardRef + style + ...rest pass-through ─── */

const RefDemo = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [attached, setAttached] = useState(false);

  useEffect(() => {
    setAttached(ref.current !== null);
  }, []);

  return (
    <div className="flex flex-col gap-[var(--spacing-8)]">
      <p className="text-[length:var(--text-12)] leading-[var(--leading-17)] text-[color:var(--color-text-info)]">
        ref attached: {attached ? 'yes' : 'no'} · row offset 8px via consumer style
      </p>
      <SortBlockGroup
        ref={ref}
        style={{ transform: 'translateX(8px)' }}
        data-testid="ref-row"
      >
        <Row row={ROWS[0]} />
      </SortBlockGroup>
    </div>
  );
};

export const WithRef: Story = {
  render: () => <RefDemo />,
};
