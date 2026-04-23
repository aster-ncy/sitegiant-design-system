import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'inset'] },
    padding: { control: 'select', options: ['sm', 'md', 'lg'] },
    title: { control: 'text' },
  },
  args: {
    children: <p className="text-[length:var(--text-14)] text-[color:var(--color-text-info)]">Card content goes here.</p>,
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'default' },
};

export const Inset: Story = {
  args: { variant: 'inset' },
};

export const WithTitle: Story = {
  args: { variant: 'default', title: 'Card Title' },
};

export const SmallPadding: Story = {
  args: { variant: 'default', padding: 'sm', title: 'Small Padding' },
};

export const MediumPadding: Story = {
  args: { variant: 'default', padding: 'md', title: 'Medium Padding' },
};

export const LargePadding: Story = {
  args: { variant: 'default', padding: 'lg', title: 'Large Padding' },
};

export const NestedCards: Story = {
  render: () => (
    <Card variant="default" padding="md" title="Outer Card" className="w-80">
      <p className="text-[length:var(--text-14)] text-[color:var(--color-text-info)] mb-3">This is the outer card content.</p>
      <Card variant="inset" padding="sm">
        <p className="text-[length:var(--text-12)] text-[color:var(--color-text-muted)]">This is an inset card inside the outer card.</p>
      </Card>
    </Card>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4 items-start">
      <Card variant="default" padding="md" title="Default Card" className="w-60">
        <p className="text-[length:var(--text-14)] text-[color:var(--color-text-info)]">Default variant with border and shadow.</p>
      </Card>
      <Card variant="inset" padding="md" title="Inset Card" className="w-60">
        <p className="text-[length:var(--text-14)] text-[color:var(--color-text-info)]">Inset variant with subtle background.</p>
      </Card>
    </div>
  ),
};
