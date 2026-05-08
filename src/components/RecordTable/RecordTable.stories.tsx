import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fragment } from 'react';
import { RecordTableActionCell } from './RecordTableActionCell';
import { RecordTableFormFieldCell } from './RecordTableFormFieldCell';
import { RecordTableHeaderCell } from './RecordTableHeaderCell';
import { RecordTableListingCell } from './RecordTableListingCell';
import { RecordTableMoreInfoCell } from './RecordTableMoreInfoCell';
import { RecordTableRowCell } from './RecordTableRowCell';

const meta = {
  title: 'Tables/Record Table/Cells',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const columns = ['first', 'center', 'last'] as const;
const alignments = ['left', 'center', 'right'] as const;
const listingColumns = ['first', 'center'] as const;

const MatrixLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[length:var(--text-12)] leading-[var(--leading-15)] text-[color:var(--color-text-info)]">
    {children}
  </span>
);

export const Header: Story = {
  render: () => (
    <div className="w-[180px]">
      <RecordTableHeaderCell column="first" align="left" />
    </div>
  ),
};

export const ListingRow: Story = {
  render: () => (
    <div className="w-[409px]">
      <RecordTableListingCell column="first" />
    </div>
  ),
};

export const FormFieldRow: Story = {
  render: () => (
    <div className="w-[172px]">
      <RecordTableFormFieldCell column="first" />
    </div>
  ),
};

export const ActionButtonRow: Story = {
  render: () => (
    <div className="w-[81px]">
      <RecordTableActionCell type="text" actionCount={1} />
    </div>
  ),
};

export const DefaultRow: Story = {
  render: () => (
    <div className="w-[178px]">
      <RecordTableRowCell column="first" />
    </div>
  ),
};

export const MoreInfoRow: Story = {
  render: () => (
    <div className="w-[227px]">
      <RecordTableMoreInfoCell column="first" />
    </div>
  ),
};

/**
 * Figma parity matrix: Record Table Header (3038:8728).
 */
export const HeaderMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-16)]">
      <p className="text-[length:var(--text-14)] leading-[var(--leading-21)] text-[color:var(--color-text-primary)]">
        Visual check only. Use Header for copyable product code.
      </p>
      <div className="grid grid-cols-[96px_repeat(3,220px)] gap-[var(--spacing-12)] items-start">
        <span />
        {columns.map((column) => (
          <MatrixLabel key={column}>{column}</MatrixLabel>
        ))}
        {alignments.map((align) => (
          <Fragment key={align}>
            <MatrixLabel key={`${align}-label`}>{align}</MatrixLabel>
            {columns.map((column) => (
              <RecordTableHeaderCell
                key={`${column}-${align}`}
                column={column}
                align={align}
                checkbox={column === 'first' ? undefined : null}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  ),
};

/**
 * Figma parity matrix: Record Table Row - Listing (3042:9588).
 */
export const ListingMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => (
    <div className="grid grid-cols-[96px_repeat(2,409px)] gap-[var(--spacing-16)] items-start">
      <span />
      {listingColumns.map((column) => (
        <MatrixLabel key={column}>{column}</MatrixLabel>
      ))}
      {[false, true].map((hovered) => (
        <Fragment key={hovered ? 'hover' : 'default'}>
          <MatrixLabel key={`${hovered}-label`}>{hovered ? 'hover' : 'default'}</MatrixLabel>
          {listingColumns.map((column) => (
            <RecordTableListingCell
              key={`${column}-${hovered}`}
              column={column}
              hovered={hovered}
            />
          ))}
        </Fragment>
      ))}
    </div>
  ),
};

/**
 * Figma parity matrix: Record Table Row - Form field (3042:9890).
 */
export const FormFieldMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => (
    <div className="grid grid-cols-[96px_repeat(3,190px)] gap-[var(--spacing-12)] items-start">
      <span />
      {columns.map((column) => (
        <MatrixLabel key={column}>{column}</MatrixLabel>
      ))}
      {[false, true].map((hovered) => (
        <Fragment key={hovered ? 'hover' : 'default'}>
          <MatrixLabel key={`${hovered}-label`}>{hovered ? 'hover' : 'default'}</MatrixLabel>
          {columns.map((column) => (
            <RecordTableFormFieldCell
              key={`${column}-${hovered}`}
              column={column}
              hovered={hovered}
            />
          ))}
        </Fragment>
      ))}
    </div>
  ),
};

/**
 * Figma parity matrix: Record Table Row - Action Button (3042:10640).
 */
export const ActionButtonMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => (
    <div className="grid grid-cols-[96px_repeat(7,max-content)] gap-[var(--spacing-16)] items-start">
      <span />
      {[1, 2, 3, 4].map((count) => (
        <MatrixLabel key={`text-${count}`}>{count} action{count > 1 ? 's' : ''}</MatrixLabel>
      ))}
      {[1, 2, 3].map((count) => (
        <MatrixLabel key={`icon-${count}`}>{count} icon</MatrixLabel>
      ))}
      {[false, true].map((hovered) => (
        <Fragment key={hovered ? 'hover' : 'default'}>
          <MatrixLabel>{hovered ? 'hover' : 'default'}</MatrixLabel>
          {[1, 2, 3, 4].map((count) => (
            <RecordTableActionCell
              key={`text-${count}-${hovered}`}
              type="text"
              actionCount={count as 1 | 2 | 3 | 4}
              hovered={hovered}
            />
          ))}
          {[1, 2, 3].map((count) => (
            <RecordTableActionCell
              key={`icon-${count}-${hovered}`}
              type="icon"
              actionCount={count as 1 | 2 | 3}
              hovered={hovered}
            />
          ))}
        </Fragment>
      ))}
    </div>
  ),
};

/**
 * Figma parity matrix: Record Table Row (3042:11088).
 */
export const DefaultRowMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => (
    <div className="grid grid-cols-[96px_repeat(3,190px)] gap-[var(--spacing-12)] items-start">
      <span />
      {columns.map((column) => (
        <MatrixLabel key={column}>{column}</MatrixLabel>
      ))}
      {[false, true].map((hovered) => (
        <Fragment key={hovered ? 'hover' : 'default'}>
          <MatrixLabel>{hovered ? 'hover' : 'default'}</MatrixLabel>
          {columns.map((column) => (
            <RecordTableRowCell
              key={`${column}-${hovered}`}
              column={column}
              hovered={hovered}
            />
          ))}
        </Fragment>
      ))}
    </div>
  ),
};

/**
 * Figma parity matrix: Record Table Row - More Info (3043:9164).
 */
export const MoreInfoMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => (
    <div className="grid grid-cols-[96px_repeat(2,227px)] gap-[var(--spacing-16)] items-start">
      <span />
      {listingColumns.map((column) => (
        <MatrixLabel key={column}>{column}</MatrixLabel>
      ))}
      {[false, true].map((hovered) => (
        <Fragment key={hovered ? 'hover' : 'default'}>
          <MatrixLabel>{hovered ? 'hover' : 'default'}</MatrixLabel>
          {listingColumns.map((column) => (
            <RecordTableMoreInfoCell
              key={`${column}-${hovered}`}
              column={column}
              hovered={hovered}
            />
          ))}
        </Fragment>
      ))}
    </div>
  ),
};
