import type { Meta, StoryObj } from '@storybook/react-vite';
import { SortBlockLongContent } from './SortBlockLongContent';

const meta = {
  title: 'Information/SortBlock/LongContent',
  component: SortBlockLongContent,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    rows: [
      {
        value:
          'Long Content Long Content Long Content Long Content Long Content Long Content',
      },
    ],
    className: 'w-[193px]',
  },
} satisfies Meta<typeof SortBlockLongContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const NaturalWrap: Story = {
  args: {
    rows: [
      {
        value:
          'A long shipping address that wraps naturally because the parent has a fixed width and the value has no explicit line breaks.',
      },
    ],
    className: 'w-[203px]',
  },
};

export const ExplicitLineBreaks: Story = {
  args: {
    rows: [
      {
        value: '123, Jalan Mayang Pasir,\n11200 Bayan Baru,\nPulau Pinang, Malaysia.',
      },
    ],
    className: 'w-[203px]',
  },
};

export const LongText2pa: Story = {
  args: {
    rows: [
      {
        label: 'Address',
        value: '123, Jalan Mayang Pasir,\n11200 Bayan Baru.',
      },
      {
        label: 'Notes',
        value: 'Leave at door.',
      },
    ],
    className: 'w-[260px]',
  },
};

export const ReadonlyBoldState: Story = {
  args: {
    state: 'Readonly Bold',
    rows: [
      {
        value:
          'A bold long value rendered with whitespace-pre-line so wraps still work.',
      },
    ],
    className: 'w-[203px]',
  },
};

/** Wraps the component in a `flex` parent so `self-stretch` actually
 *  takes effect. Mirrors the s7 Add Trip address-cell usage exactly:
 *  `self-stretch w-[203px]` with a multi-line value. The visual proof:
 *  the grey fill, px-6 py-12 padding, and flex-1 value column all
 *  remain alongside the consumer's classes — the family-split footgun
 *  fix exercised against its real call-site shape. */
export const ClassNameAppendsSelfStretch: Story = {
  args: {
    rows: [{ value: '123, Jalan Mayang Pasir,\n11200 Bayan Baru.' }],
    className: 'self-stretch w-[203px]',
  },
  decorators: [
    (Story) => (
      <div className="flex items-stretch h-[80px] gap-[var(--spacing-12)] bg-[color:var(--color-surface-card)] p-[var(--spacing-12)]">
        <Story />
      </div>
    ),
  ],
};
