import type { Meta, StoryObj } from '@storybook/react-vite';
import { SortBlockMainSub } from './SortBlockMainSub';

const meta = {
  title: 'Information/SortBlock/MainSub',
  component: SortBlockMainSub,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    rows: [
      { label: 'Main Label', value: 'Main Value' },
      { label: 'Sub Label', value: 'Sub Value' },
    ],
  },
} satisfies Meta<typeof SortBlockMainSub>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ReadonlyBoldMain: Story = {
  args: {
    state: 'Readonly Bold',
    rows: [
      { label: 'Main Label', value: 'Main Value' },
      { label: 'Sub Label', value: 'Sub Value' },
    ],
  },
};

export const NoLabels: Story = {
  args: {
    rows: [
      { value: 'Wei Kheng' },
      { value: '60 12-456 6556' },
    ],
  },
};

export const MainBoldOverride: Story = {
  args: {
    rows: [
      { value: 'Wei Kheng', bold: true },
      { value: '60 12-456 6556' },
    ],
  },
};

/** Wraps the component in a `flex` parent so `self-stretch` actually
 *  takes effect. The visual proof: the grey fill (`--sorting-block-sorting-fill`),
 *  px-6 py-12 padding, AND the gap-4 between main/sub rows all remain
 *  present alongside the consumer's `self-stretch w-[130px]` — proving
 *  `className` appends to built-ins instead of replacing them (the
 *  headline footgun this split fixes; previously the gap-4 was silently
 *  lost when className was passed). */
export const ClassNameAppendsSelfStretch: Story = {
  args: {
    rows: [
      { value: 'Wei Kheng' },
      { value: '60 12-456 6556' },
    ],
    className: 'self-stretch w-[130px]',
  },
  decorators: [
    (Story) => (
      <div className="flex items-stretch h-[80px] gap-[var(--spacing-12)] bg-[color:var(--color-surface-card)] p-[var(--spacing-12)]">
        <Story />
      </div>
    ),
  ],
};
