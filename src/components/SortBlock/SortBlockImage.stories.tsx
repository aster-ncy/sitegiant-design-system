import type { Meta, StoryObj } from '@storybook/react-vite';
import { SortBlockImage } from './SortBlockImage';

const meta = {
  title: 'Information/SortBlock/Image',
  component: SortBlockImage,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    children: (
      <div
        className="size-[41px] bg-[color:var(--color-set-lightest)]"
        aria-label="Light image placeholder"
      />
    ),
  },
} satisfies Meta<typeof SortBlockImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightTile: Story = {
  render: () => (
    <SortBlockImage>
      <div
        className="size-[41px] bg-[color:var(--color-set-lightest)]"
        aria-label="Light image placeholder"
      />
    </SortBlockImage>
  ),
};

export const DarkTile: Story = {
  render: () => (
    <SortBlockImage>
      <div
        className="size-[41px] bg-[color:var(--color-text-primary)]"
        aria-label="Dark image placeholder"
      />
    </SortBlockImage>
  ),
};
