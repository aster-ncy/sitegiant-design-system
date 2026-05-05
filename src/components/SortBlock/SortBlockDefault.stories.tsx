import type { Meta, StoryObj } from '@storybook/react-vite';
import { SortBlockDefault } from './SortBlockDefault';

const meta = {
  title: 'Information/SortBlock/Default',
  component: SortBlockDefault,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    orientation: 'horizontal',
    rows: [{ label: 'Label', value: 'Value' }],
  },
} satisfies Meta<typeof SortBlockDefault>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const HorizontalSingleRow: Story = {
  args: { rows: [{ label: 'Label', value: 'Value' }] },
};

export const HorizontalTwoRows: Story = {
  args: {
    rows: [
      { label: 'Tracking No.', value: 'MY123554G85899' },
      { label: 'Delivery', value: '08 May 2025' },
    ],
  },
};

export const VerticalSingleRow: Story = {
  args: { orientation: 'vertical', rows: [{ label: 'Label', value: 'Value' }] },
};

export const VerticalTwoRows: Story = {
  args: {
    orientation: 'vertical',
    rows: [
      { label: 'Tracking No.', value: 'MY123554G85899' },
      { label: 'Delivery', value: '08 May 2025' },
    ],
  },
};

export const ReadonlyBoldState: Story = {
  args: {
    state: 'Readonly Bold',
    rows: [
      { label: 'Tracking No.', value: 'MY123554G85899' },
      { label: 'Delivery', value: '08 May 2025' },
    ],
  },
};

export const PerRowBoldOverride: Story = {
  args: {
    rows: [
      { label: 'Tracking No.', value: 'MY123554G85899', bold: true },
      { label: 'Delivery', value: '08 May 2025' },
    ],
  },
};

export const PerRowRegularOverride: Story = {
  args: {
    state: 'Readonly Bold',
    rows: [
      { label: 'Tracking No.', value: 'MY123554G85899' },
      { label: 'Delivery', value: '08 May 2025', bold: false },
    ],
  },
};

export const NoLabel: Story = {
  args: { rows: [{ value: 'MY123554G85899' }] },
};

export const MixedLabelHorizontal: Story = {
  args: {
    rows: [
      { label: 'Tracking', value: 'MY123554G85899' },
      { value: '08 May 2025' },
    ],
  },
};

/** Wraps the component in a `flex` parent so `self-stretch` actually
 *  takes effect. The visual proof: the grey fill (`--sorting-block-sorting-fill`)
 *  AND the px-6 py-12 padding remain present alongside the consumer's
 *  `self-stretch w-[200px]` — proving `className` appends to built-ins
 *  instead of replacing them (the headline footgun this split fixes). */
export const ClassNameAppendsSelfStretch: Story = {
  args: {
    rows: [{ value: 'MY123554G85899' }],
    className: 'self-stretch w-[200px]',
  },
  decorators: [
    (Story) => (
      <div className="flex items-stretch h-[80px] gap-[var(--spacing-12)] bg-[color:var(--color-surface-card)] p-[var(--spacing-12)]">
        <Story />
      </div>
    ),
  ],
};
