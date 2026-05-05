import type { Meta, StoryObj } from '@storybook/react-vite';
import { SortBlockIcon } from './SortBlockIcon';
import { Icon } from '../Icon';

const meta = {
  title: 'Information/SortBlock/Icon',
  component: SortBlockIcon,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof SortBlockIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Drag: Story = {
  render: () => (
    <SortBlockIcon>
      <Icon name="drag" size={17} className="text-[color:var(--color-icon-secondary)]" />
    </SortBlockIcon>
  ),
} as unknown as Story;

export const Close: Story = {
  render: () => (
    <SortBlockIcon>
      <button
        type="button"
        aria-label="Remove"
        className="inline-flex items-center justify-center bg-transparent border-none p-0 cursor-pointer"
      >
        <Icon name="close" size={17} className="text-[color:var(--color-icon-secondary)]" />
      </button>
    </SortBlockIcon>
  ),
} as unknown as Story;

/** Wraps the component in a `flex` parent so `self-stretch` actually
 *  takes effect. Mirrors the s7 Add Trip drag/close cell shape exactly:
 *  `self-stretch w-[45px]` with an icon child. Proves the grey fill +
 *  pl-12 pr-16 py-12 padding survive alongside the consumer's classes. */
export const ClassNameAppendsSelfStretch: Story = {
  render: () => (
    <div className="flex items-stretch h-[80px] gap-[var(--spacing-12)] bg-[color:var(--color-surface-card)] p-[var(--spacing-12)]">
      <SortBlockIcon className="self-stretch w-[45px]">
        <Icon name="drag" size={17} className="text-[color:var(--color-icon-secondary)]" />
      </SortBlockIcon>
    </div>
  ),
} as unknown as Story;
