import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button, PlusIcon } from './Button';

const meta = {
  title: 'Actions/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'basic', 'outline', 'danger', 'danger-outline', 'special', 'small-primary'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: { onClick: fn(), label: 'Button' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary' },
};

export const Basic: Story = {
  args: { variant: 'basic' },
};

export const Outline: Story = {
  args: { variant: 'outline' },
};

export const Danger: Story = {
  args: { variant: 'danger' },
};

export const DangerOutline: Story = {
  args: { variant: 'danger-outline' },
};

export const Special: Story = {
  args: { variant: 'special' },
};

export const SmallPrimary: Story = {
  args: { variant: 'small-primary' },
};

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true },
};

export const DisabledOutline: Story = {
  args: { variant: 'outline', disabled: true },
};

export const DisabledBasic: Story = {
  args: { variant: 'basic', disabled: true },
};

export const DisabledDangerOutline: Story = {
  args: { variant: 'danger-outline', disabled: true },
};

/* ── With Icon ─────────────────────────────────────────── */

export const PrimaryWithIcon: Story = {
  args: { variant: 'primary', leftIcon: <PlusIcon /> },
};

export const BasicWithIcon: Story = {
  args: { variant: 'basic', leftIcon: <PlusIcon /> },
};

export const OutlineWithIcon: Story = {
  args: { variant: 'outline', leftIcon: <PlusIcon /> },
};

export const DangerWithIcon: Story = {
  args: { variant: 'danger', leftIcon: <PlusIcon /> },
};

export const SpecialWithIcon: Story = {
  args: { variant: 'special', leftIcon: <PlusIcon /> },
};

export const DisabledWithIcon: Story = {
  args: { variant: 'primary', disabled: true, leftIcon: <PlusIcon /> },
};

/* ── Sizes ─────────────────────────────────────────────── */

export const Small: Story = {
  args: { variant: 'primary', size: 'sm' },
};

export const Medium: Story = {
  args: { variant: 'primary', size: 'md' },
};

export const Large: Story = {
  args: { variant: 'primary', size: 'lg' },
};

/* ── Composite stories ─────────────────────────────────── */

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3 items-center">
        <Button variant="primary" label="Primary" />
        <Button variant="outline" label="Outline" />
        <Button variant="danger" label="Danger" />
        <Button variant="danger-outline" label="Danger Outline" />
        <Button variant="basic" label="Basic" />
        <Button variant="special" label="Special" />
        <Button variant="small-primary" label="Small Primary" />
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <span className="w-24 text-sm text-[var(--color-text-info)]">Disabled</span>
        <Button variant="primary" disabled label="Primary" />
        <Button variant="outline" disabled label="Outline" />
        <Button variant="danger" disabled label="Danger" />
        <Button variant="danger-outline" disabled label="Danger Outline" />
        <Button variant="basic" disabled label="Basic" />
        <Button variant="special" disabled label="Special" />
        <Button variant="small-primary" disabled label="Small Primary" />
      </div>
    </div>
  ),
};

export const AllVariantsWithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="primary" label="Button" leftIcon={<PlusIcon />} />
      <Button variant="outline" label="Button" leftIcon={<PlusIcon />} />
      <Button variant="danger" label="Button" leftIcon={<PlusIcon />} />
      <Button variant="danger-outline" label="Button" leftIcon={<PlusIcon />} />
      <Button variant="basic" label="Button" leftIcon={<PlusIcon />} />
      <Button variant="special" label="Button" leftIcon={<PlusIcon />} />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="primary" size="sm" label="Small" />
      <Button variant="primary" size="md" label="Medium" />
      <Button variant="primary" size="lg" label="Large" />
    </div>
  ),
};

export const AllSizesWithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="primary" size="sm" label="Small" leftIcon={<PlusIcon />} />
      <Button variant="primary" size="md" label="Medium" leftIcon={<PlusIcon />} />
      <Button variant="primary" size="lg" label="Large" leftIcon={<PlusIcon />} />
    </div>
  ),
};
