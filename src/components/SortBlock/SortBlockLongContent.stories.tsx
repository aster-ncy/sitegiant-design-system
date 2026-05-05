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
