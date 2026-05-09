import { useState } from 'react';
import { Toggle } from '../../components/Toggle/Toggle';
import { TextLink } from '../../components/TextLink/TextLink';
import { Icon } from '../../components/Icon/Icon';
import { Dropdown } from '../../components/Dropdown/Dropdown';
import { Input } from '../../components/Input/Input';
import { DashedButton } from '../../components/DashedButton/DashedButton';
import { NumberInput } from '../../components/NumberInput/NumberInput';
import { SortBlockGroup } from '../../components/SortBlock/SortBlockGroup';
import { SortBlockIcon } from '../../components/SortBlock/SortBlockIcon';
import { SortBlockButton } from '../../components/SortBlock/SortBlockButton';
import { IconButton } from '../../components/TopBar/IconButton';

/* ── Local type helpers ────────────────────────────────────────────── */

interface BatchRow {
  id: string;
  batchNo: string;
  qty: string;
}

interface RackRow {
  id: string;
  dropdownValue: string;
  quantityValue: string;
  batches: BatchRow[];
}

interface WarehouseRow {
  id: string;
  warehouseName: string;
  sellable: string;
  allocated: string;
  reserved: string;
  expanded: boolean;
  racks: RackRow[];
}

/* ── Initial fixture — danger states are hard-coded per brief ──────── */

function makeInitialWarehouses(): WarehouseRow[] {
  return [
    {
      id: 'wh-1',
      warehouseName: 'penang',
      sellable: '5',
      allocated: '0',
      reserved: '0',
      expanded: true,
      racks: [
        {
          id: 'rack-1',
          dropdownValue: '',
          quantityValue: '1',
          batches: [
            { id: 'batch-1', batchNo: '20251028-f2682684', qty: '0' },
            { id: 'batch-2', batchNo: '20251028-f4376d782', qty: '0' },
          ],
        },
      ],
    },
    {
      id: 'wh-2',
      warehouseName: '',
      sellable: '0',
      allocated: '',
      reserved: '0',
      expanded: false,
      racks: [],
    },
  ];
}

const warehouseOptions = [
  { value: 'penang', label: 'Penang Warehouse' },
  { value: 'kl', label: 'KL Warehouse' },
];

/* ── Typography constants (reused from index.css pattern) ──────────── */

const captionClasses =
  'font-[family-name:var(--general-font-family)] ' +
  'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)] ' +
  'font-[weight:var(--general-caption-weight)]';

/* ── Inset header strip (plain divs — custom column widths don't map
 *    cleanly to TableHeaderCell's fixed column modes) ─────────────── */

const InsetHeader = () => (
  <div
    className={[
      'flex items-center w-full',
      'bg-[color:var(--table-inset-header-fill)]',
      'rounded-[var(--radius-4)]',
      'h-[33px] py-[var(--spacing-8)]',
    ].join(' ')}
  >
    <div
      className={[
        captionClasses,
        'text-[color:var(--table-inset-header-text)]',
        'w-[528px] pl-[var(--spacing-12)] pr-[var(--spacing-6)]',
        'rounded-l-[var(--radius-4)]',
        'whitespace-nowrap',
      ].join(' ')}
    >
      Warehouse
    </div>
    <div
      className={[
        captionClasses,
        'text-[color:var(--table-inset-header-text)]',
        'w-[167px] px-[var(--spacing-6)]',
        'whitespace-nowrap',
      ].join(' ')}
    >
      Sellable Stock
    </div>
    <div
      className={[
        captionClasses,
        'text-[color:var(--table-inset-header-text)]',
        'w-[167px] px-[var(--spacing-6)]',
        'whitespace-nowrap',
      ].join(' ')}
    >
      Allocated Stock
    </div>
    <div
      className={[
        captionClasses,
        'text-[color:var(--table-inset-header-text)]',
        'w-[167px] px-[var(--spacing-6)]',
        'whitespace-nowrap',
      ].join(' ')}
    >
      Reserved Stock
    </div>
    <div
      className={[
        'flex-1 min-w-0',
        'pl-[var(--spacing-6)] pr-[var(--spacing-12)]',
        'rounded-r-[var(--radius-4)]',
      ].join(' ')}
    />
  </div>
);

/* ── Sub-header strip shown when a warehouse row is expanded ───────── */

const SubHeader = ({ hasBatches }: { hasBatches: boolean }) => (
  <div
    className={[
      'flex items-center w-full',
      'bg-[color:var(--table-inset-subrow-fill)]',
      'h-[33px] py-[var(--spacing-8)]',
    ].join(' ')}
  >
    {/* drag-column 45px — aligns with rack body drag handle */}
    <div className="w-[45px] shrink-0" />

    {/* Rack — 244px aligns with rack body's dropdown cell */}
    <div
      className={[
        captionClasses,
        'text-[color:var(--table-inset-header-text)]',
        'w-[244px] shrink-0 px-[var(--spacing-6)]',
        'whitespace-nowrap',
      ].join(' ')}
    >
      Rack
    </div>

    {/* Stock On Hand — fixed 212px aligned with rack body's Quantity cell.
     *  Includes the danger pip "-6 unlocated". The cells AFTER this
     *  (trash + SetPicking + AddBatch) get their own non-labeled spacers. */}
    <div
      className={[
        'w-[212px] shrink-0 px-[var(--spacing-6)]',
        'flex items-center gap-[var(--spacing-4)]',
      ].join(' ')}
    >
      <span
        className={[
          captionClasses,
          'text-[color:var(--table-inset-header-text)]',
          'whitespace-nowrap',
        ].join(' ')}
      >
        Stock On Hand
      </span>
      <Icon name="alert-triangle" size={15} color="var(--color-icon-danger)" />
      <span className="inline-flex items-center gap-[var(--spacing-4)]">
        <span
          className={[
            'font-[family-name:var(--general-font-family)]',
            'text-[length:var(--general-caption-size)] leading-[var(--general-caption-slim-lineheight)]',
            'font-[weight:var(--font-weight-medium)]',
            'text-[color:var(--color-text-danger)] whitespace-nowrap',
          ].join(' ')}
        >
          -6
        </span>
        <span
          className={[
            'font-[family-name:var(--general-font-family)]',
            'text-[length:var(--general-caption-size)] leading-[var(--general-caption-slim-lineheight)]',
            'font-[weight:var(--general-caption-weight)]',
            'text-[color:var(--color-text-danger)] whitespace-nowrap',
          ].join(' ')}
        >
          unlocated
        </span>
      </span>
    </div>

    {/* Trash spacer in body — 45px (SortBlockIcon's pl-12 pr-16 + 17 icon). */}
    <div className="w-[45px] shrink-0" />

    {/* "Set as Picking Zone" body width spacer. SortBlockButton has
     *  pl-12 pr-16 + intrinsic "Set as Picking Zone" text (~140px at 14/17). */}
    <div className="w-[168px] shrink-0" />

    {/* "Add Batch" body width spacer — 164px matches the body's SortBlockButton. */}
    <div className="w-[164px] shrink-0" />

    {/* Batch + Quantity sub-headers — only render when the rack has at least
     *  one batch. They sit over the nested column in the rack body, which
     *  starts AFTER trash + SetPicking + AddBatch (the spacers above) plus a
     *  9px gutter (4px ml + 1px divider + 4px pl). */}
    {hasBatches && (
      // pl-[5px] aligns the Batch label with the body's batch-no input
      // border. Body geometry: 1px divider + 4px inner column pl-4 + 6px
      // cell px-6 = 11px to input border. SubHeader: 5px + cell px-6 = 11px.
      <div className="flex flex-1 min-w-0 pl-[5px]">
        {/* Batch — flex-1 aligns with batch-no input cell in BatchSubRow */}
        <div
          className={[
            'flex-1 min-w-0 px-[var(--spacing-6)]',
            'flex items-center gap-[var(--spacing-4)]',
          ].join(' ')}
        >
          <span
            className={[
              captionClasses,
              'text-[color:var(--table-inset-header-text)]',
              'whitespace-nowrap',
            ].join(' ')}
          >
            Batch
          </span>
          <Icon name="help-circle" size={15} color="var(--color-icon-secondary)" />
        </div>

        {/* Quantity — 142px aligns with qty input cell in BatchSubRow */}
        <div
          className={[
            captionClasses,
            'text-[color:var(--table-inset-header-text)]',
            'w-[142px] shrink-0 px-[var(--spacing-6)]',
            'whitespace-nowrap',
          ].join(' ')}
        >
          Quantity
        </div>

        {/* Trash spacer — reserves the same column width as the trash
         *  IconButton in BatchSubRow (~45px) so the labels end at the
         *  card's right padding edge. */}
        <div className="w-[45px] shrink-0" />
      </div>
    )}
  </div>
);

/* ── Nested batch sub-row pair (right side of a rack row) ─────────── */

interface BatchSubRowProps {
  batch: BatchRow;
  onRemove: () => void;
}

const BatchSubRow = ({ batch, onRemove }: BatchSubRowProps) => (
  <div className="flex items-stretch w-full">
    {/* Batch No input — flex-1 so the row never exceeds parent width */}
    <div
      className="flex-1 min-w-0 bg-[color:var(--sorting-block-sorting-fill)] px-[var(--spacing-6)] py-[var(--spacing-4)] flex items-center"
    >
      <Input className="flex-1 min-w-0" value={batch.batchNo} onChange={() => undefined} />
    </div>
    {/* Qty input — 142px fixed, danger border */}
    <div
      className="w-[142px] shrink-0 bg-[color:var(--sorting-block-sorting-fill)] px-[var(--spacing-6)] py-[var(--spacing-4)] flex items-center"
    >
      <Input
        className="flex-1 min-w-0"
        value={batch.qty}
        state="danger"
        onChange={() => undefined}
      />
    </div>
    {/* Trash */}
    <SortBlockIcon className="!items-center">
      <button
        type="button"
        aria-label="Remove batch"
        className="inline-flex items-center justify-center bg-transparent border-none p-0 cursor-pointer"
        onClick={onRemove}
      >
        <Icon name="trash" size={17} color="var(--color-icon-secondary)" />
      </button>
    </SortBlockIcon>
  </div>
);

/* ── Rack row (one SortBlockGroup with nested batch sub-rows) ──────── */

interface RackRowProps {
  rack: RackRow;
  isFixtureDanger: boolean;
  onRemove: () => void;
  onAddBatch: () => void;
  onRemoveBatch: (batchId: string) => void;
}

const RackRowView = ({
  rack,
  isFixtureDanger,
  onRemove,
  onAddBatch,
  onRemoveBatch,
}: RackRowProps) => {
  // Per AGENTS rule #7: when the row contains multi-row content (the nested
  // batch column has 2+ stacked sub-rows), every sibling cell must top-align
  // so they don't drift to the visual middle of the tallest stretched cell.
  // Single-row cases stay center.
  const rowHasMultipleRows = rack.batches.length > 1;
  const cellAlign = rowHasMultipleRows ? 'items-start' : 'items-center';

  return (
  <div className="flex flex-col">
    <SortBlockGroup>
      {/* Drag handle */}
      <SortBlockIcon className={`self-stretch w-[45px] !${cellAlign}`}>
        <Icon name="drag" size={17} color="var(--color-icon-secondary)" className="cursor-grab" />
      </SortBlockIcon>

      {/* Rack dropdown — 244px */}
      <div
        className={[
          'w-[244px] bg-[color:var(--sorting-block-sorting-fill)]',
          'px-[var(--spacing-6)] py-[var(--spacing-4)] flex',
          cellAlign,
        ].join(' ')}
      >
        <Dropdown
          className="flex-1 min-w-0"
          options={warehouseOptions}
          value={rack.dropdownValue}
          placeholder="Value"
          onChange={() => undefined}
        />
      </div>

      {/* Quantity cell — 212px. NumberInput's `inlineHint` prop renders the
       *  alert-triangle + "10 unlocated" pip inside the shared red border
       *  per Figma 7927:76424. */}
      <div
        className={[
          'w-[212px] bg-[color:var(--sorting-block-sorting-fill)]',
          'px-[var(--spacing-6)] py-[var(--spacing-4)] flex',
          cellAlign,
        ].join(' ')}
      >
        <NumberInput
          className="flex-1 min-w-0"
          value={rack.quantityValue}
          validation={isFixtureDanger ? 'error' : 'default'}
          onChange={() => undefined}
          inlineHint={
            isFixtureDanger
              ? {
                  icon: 'alert-triangle',
                  tone: 'danger',
                  text: (
                    <>
                      <strong className="font-[weight:var(--font-weight-medium)]">10</strong>{' '}
                      unlocated
                    </>
                  ),
                }
              : undefined
          }
        />
      </div>

      {/* Trash */}
      <SortBlockIcon className={`self-stretch !${cellAlign}`}>
        <button
          type="button"
          aria-label="Remove rack"
          className="inline-flex items-center justify-center bg-transparent border-none p-0 cursor-pointer"
          onClick={onRemove}
        >
          <Icon name="trash" size={17} color="var(--color-icon-secondary)" />
        </button>
      </SortBlockIcon>

      {/* "Set as Picking Zone" textlink button — fixed width so SubHeader's
       *  spacer can mirror it deterministically (intrinsic text width drifts
       *  with font metrics and breaks Batch-label alignment with the
       *  nested column below). */}
      <SortBlockButton kind="textlink" className={`w-[168px] !${cellAlign}`}>
        <TextLink label="Set as Picking Zone" variant="basic" />
      </SortBlockButton>

      {/* "Add Batch" dashed button — w-164 cell per Figma 7927:77097; the
       *  DashedButton fills its parent (fullWidth) at the standard 33px chrome. */}
      <SortBlockButton kind="dashed" className={`w-[164px] !${cellAlign}`}>
        <DashedButton fullWidth onClick={onAddBatch}>
          <Icon name="plus" size={17} />
          Add Batch
        </DashedButton>
      </SortBlockButton>

      {/* Nested batch column — flex-1 so the row never exceeds the inset
       *  table content width. When batches exist, render the divider + sub-row
       *  list. When the rack has no batches, still fill with the sortblock
       *  background so the grey strip spans the full row width (per Figma:
       *  the rack-row fill is continuous, not capped at the Add Batch cell). */}
      <div className="flex flex-1 min-w-0 self-stretch bg-[color:var(--sorting-block-sorting-fill)]">
        {rack.batches.length > 0 && (
          <>
            <div
              aria-hidden
              className="w-px self-stretch my-[var(--spacing-4)] bg-[color:var(--color-divider-DEFAULT)]"
            />
            <div className="flex flex-col flex-1 min-w-0 pl-[var(--spacing-4)]">
              {rack.batches.map((batch) => (
                <BatchSubRow
                  key={batch.id}
                  batch={batch}
                  onRemove={() => onRemoveBatch(batch.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </SortBlockGroup>
  </div>
  );
};

/* ── Outer warehouse row ───────────────────────────────────────────── */

interface WarehouseRowViewProps {
  wh: WarehouseRow;
  isFirst: boolean;
  /** Trash hides when this is the last remaining warehouse (must keep at least one). */
  isOnlyWarehouse: boolean;
  onToggleExpand: () => void;
  onAddRack: () => void;
  onRemoveRack: (rackId: string) => void;
  onAddBatch: (rackId: string) => void;
  onRemoveBatch: (rackId: string, batchId: string) => void;
  onRemove: () => void;
}

const WarehouseRowView = ({
  wh,
  isFirst,
  isOnlyWarehouse,
  onToggleExpand,
  onAddRack,
  onRemoveRack,
  onAddBatch,
  onRemoveBatch,
  onRemove,
}: WarehouseRowViewProps) => (
  <div className="flex flex-col">
    {/* Outer row — column geometry MIRRORS the InsetHeader strip so the body
     *  cells sit directly under their header labels. Each cell uses the
     *  InsetHeader column's exact width + padding (no inter-cell gap).
     *  py-12 gives breathing room between the row and adjacent strips
     *  (InsetHeader above and SubHeader below when expanded). */}
    <div
      className="flex items-center py-[var(--spacing-12)] bg-[color:var(--color-surface-card)]"
    >
      {/* Warehouse — 528px col, pl-12 pr-6 to match header */}
      <div className="w-[528px] shrink-0 pl-[var(--spacing-12)] pr-[var(--spacing-6)]">
        <Dropdown
          options={warehouseOptions}
          value={wh.warehouseName}
          placeholder="Select Warehouse"
          disabled={isFirst}
          onChange={() => undefined}
        />
      </div>

      {/* Sellable Stock — 167px col, px-6 */}
      <div className="w-[167px] shrink-0 px-[var(--spacing-6)]">
        <Input
          value={wh.sellable}
          state="disabled"
          trailingIcon={<Icon name="external-link" size={17} />}
          onChange={() => undefined}
        />
      </div>

      {/* Allocated Stock — 167px col, px-6 */}
      <div className="w-[167px] shrink-0 px-[var(--spacing-6)]">
        <Input
          value={wh.allocated}
          state="disabled"
          onChange={() => undefined}
        />
      </div>

      {/* Reserved Stock — 167px col, px-6 */}
      <div className="w-[167px] shrink-0 px-[var(--spacing-6)]">
        <Input
          value={wh.reserved}
          onChange={() => undefined}
        />
      </div>

      {/* Action col — flex-1 fills remaining width. Inner cluster: Add Rack
       *  + (trash | placeholder) + chevron, separated by gap-12. The trash
       *  slot is always reserved (invisible on expanded) so the chevron
       *  anchors at the same x across rows. */}
      <div className="flex-1 min-w-0 flex items-center gap-[var(--spacing-12)] pl-[var(--spacing-6)] pr-[var(--spacing-12)] justify-end">
        <div className="w-[148px] shrink-0">
          <DashedButton fullWidth onClick={onAddRack}>
            <Icon name="plus" size={17} />
            Add Rack
          </DashedButton>
        </div>

        {/* Trash always shown except when this is the only warehouse (must
         *  keep at least one). The hidden state still reserves layout space so
         *  the chevron anchor stays consistent across rows. */}
        <IconButton
          name="trash"
          variant="default"
          label="Remove warehouse"
          onClick={onRemove}
          className={isOnlyWarehouse ? 'invisible pointer-events-none' : undefined}
        />

        <IconButton
          name={wh.expanded ? 'chevron-up' : 'chevron-down'}
          variant="default"
          label={wh.expanded ? 'Collapse' : 'Expand'}
          onClick={onToggleExpand}
        />
      </div>
    </div>

    {/* Expanded content — sub-header + rack rows */}
    {wh.expanded && (
      <div className="flex flex-col">
        <SubHeader hasBatches={wh.racks.some((r) => r.batches.length > 0)} />
        <div className="flex flex-col gap-[var(--spacing-4)] mt-[var(--spacing-4)]">
          {wh.racks.map((rack) => (
            <RackRowView
              key={rack.id}
              rack={rack}
              isFixtureDanger={isFirst && rack.id === 'rack-1'}
              onRemove={() => onRemoveRack(rack.id)}
              onAddBatch={() => onAddBatch(rack.id)}
              onRemoveBatch={(batchId) => onRemoveBatch(rack.id, batchId)}
            />
          ))}
        </div>
      </div>
    )}
  </div>
);

/* ── Counter for unique IDs ─────────────────────────────────────────── */
let _uid = 100;
const uid = () => `gen-${++_uid}`;

/* ── Main exported component ─────────────────────────────────────────── */

export const WarehouseInfoDemo = () => {
  const [batchMode, setBatchMode] = useState(true);
  const [warehouses, setWarehouses] = useState<WarehouseRow[]>(makeInitialWarehouses);

  /* expand all */
  const expandAll = () =>
    setWarehouses((prev) => prev.map((wh) => ({ ...wh, expanded: true })));

  /* toggle one warehouse expand state */
  const toggleExpand = (whId: string) =>
    setWarehouses((prev) =>
      prev.map((wh) => (wh.id === whId ? { ...wh, expanded: !wh.expanded } : wh)),
    );

  /* add rack to a warehouse */
  const addRack = (whId: string) =>
    setWarehouses((prev) =>
      prev.map((wh) =>
        wh.id === whId
          ? {
              ...wh,
              expanded: true,
              racks: [
                ...wh.racks,
                { id: uid(), dropdownValue: '', quantityValue: '', batches: [] },
              ],
            }
          : wh,
      ),
    );

  /* remove rack */
  const removeRack = (whId: string, rackId: string) =>
    setWarehouses((prev) =>
      prev.map((wh) =>
        wh.id === whId ? { ...wh, racks: wh.racks.filter((r) => r.id !== rackId) } : wh,
      ),
    );

  /* add batch to a rack */
  const addBatch = (whId: string, rackId: string) =>
    setWarehouses((prev) =>
      prev.map((wh) =>
        wh.id === whId
          ? {
              ...wh,
              racks: wh.racks.map((r) =>
                r.id === rackId
                  ? {
                      ...r,
                      batches: [...r.batches, { id: uid(), batchNo: '', qty: '' }],
                    }
                  : r,
              ),
            }
          : wh,
      ),
    );

  /* remove batch */
  const removeBatch = (whId: string, rackId: string, batchId: string) =>
    setWarehouses((prev) =>
      prev.map((wh) =>
        wh.id === whId
          ? {
              ...wh,
              racks: wh.racks.map((r) =>
                r.id === rackId
                  ? { ...r, batches: r.batches.filter((b) => b.id !== batchId) }
                  : r,
              ),
            }
          : wh,
      ),
    );

  /* remove warehouse */
  const removeWarehouse = (whId: string) =>
    setWarehouses((prev) => prev.filter((wh) => wh.id !== whId));

  /* add warehouse */
  const addWarehouse = () =>
    setWarehouses((prev) => [
      ...prev,
      {
        id: uid(),
        warehouseName: '',
        sellable: '',
        allocated: '',
        reserved: '',
        expanded: false,
        racks: [],
      },
    ]);

  return (
    <div
      className={[
        'bg-[color:var(--color-surface-card)]',
        'border border-solid border-[color:var(--color-surface-card-border)]',
        'rounded-[var(--radius-12)]',
        'px-[var(--spacing-24)] pt-[var(--spacing-20)] pb-[var(--spacing-40)]',
        'flex flex-col gap-[var(--spacing-20)]',
      ].join(' ')}
    >
      {/* Card header — title + Batch Mode toggle */}
      <div className="flex items-center justify-between">
        <span
          className={[
            'font-[family-name:var(--general-font-family)]',
            'text-[length:var(--text-18)] leading-[var(--leading-22)]',
            'font-[weight:var(--font-weight-medium)]',
            'text-[color:var(--color-text-primary)]',
          ].join(' ')}
        >
          Warehouse Info
        </span>
        <Toggle checked={batchMode} onChange={setBatchMode} label="Batch Mode" />
      </div>

      {/* Expand All text link — right-aligned */}
      <div className="flex justify-end">
        <TextLink
          label="Expand All"
          variant="basic"
          iconPosition="left"
          icon={<Icon name="plus-square" size={17} />}
          onClick={expandAll}
        />
      </div>

      {/* Product List — InsetHeader + warehouse rows grouped so the header
       *  strip sits close to the first row (per Figma 7927:76398, no extra
       *  card-level 20px gap between header and content). */}
      <div className="flex flex-col">
        <InsetHeader />
        <div className="flex flex-col gap-[var(--spacing-12)]">
          {warehouses.map((wh, idx) => (
            <WarehouseRowView
              key={wh.id}
              wh={wh}
              isFirst={idx === 0}
              isOnlyWarehouse={warehouses.length === 1}
              onToggleExpand={() => toggleExpand(wh.id)}
              onAddRack={() => addRack(wh.id)}
              onRemoveRack={(rackId) => removeRack(wh.id, rackId)}
              onAddBatch={(rackId) => addBatch(wh.id, rackId)}
              onRemoveBatch={(rackId, batchId) => removeBatch(wh.id, rackId, batchId)}
              onRemove={() => removeWarehouse(wh.id)}
            />
          ))}
        </div>
      </div>

      {/* Footer — Add Warehouse */}
      <DashedButton fullWidth onClick={addWarehouse}>
        <Icon name="plus" size={17} />
        Add Warehouse
      </DashedButton>
    </div>
  );
};

export default WarehouseInfoDemo;
