import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { Dropdown } from './Dropdown';
import { Button } from '../Button';

const sampleOptions = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing',    label: 'Clothing & Apparel' },
  { value: 'home',        label: 'Home & Living' },
  { value: 'sports',      label: 'Sports & Outdoors' },
  { value: 'books',       label: 'Books & Media', disabled: true },
];

const meta = {
  title: 'Forms/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    options: sampleOptions,
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Individual stories ──────────────────────────────── */

export const Default: Story = {
  args: {
    placeholder: 'Select a category...',
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Select a category...',
    value: 'electronics',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Product category',
    placeholder: 'Select a category...',
  },
};

export const WithLabelAndInfo: Story = {
  args: {
    label: 'Product category',
    labelInfo: '(required)',
    placeholder: 'Select a category...',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Product category',
    placeholder: 'Select a category...',
    disabled: true,
  },
};

export const DisabledWithValue: Story = {
  args: {
    label: 'Product category',
    value: 'electronics',
    disabled: true,
  },
};

export const Readonly: Story = {
  args: {
    label: 'Product category',
    value: 'electronics',
    readonly: true,
  },
};

/* ── Interactive story ───────────────────────────────── */

export const Interactive: Story = {
  render: () => {
    const [selected, setSelected] = useState('');
    return (
      <div className="flex flex-col gap-[var(--spacing-8)] max-w-xs">
        <Dropdown
          label="Product category"
          placeholder="Select a category..."
          options={sampleOptions}
          value={selected}
          onChange={setSelected}
        />
        <p className="text-[length:var(--text-12)] text-[color:var(--form-label-info-text)]">
          Selected: {selected || <em>none</em>}
        </p>
      </div>
    );
  },
};

/* ── Composite: all states ───────────────────────────── */

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-16)] max-w-xs">
      <Dropdown
        label="Default (no selection)"
        placeholder="Select an option..."
        options={sampleOptions}
      />
      <Dropdown
        label="With value"
        options={sampleOptions}
        value="clothing"
      />
      <Dropdown
        label="Disabled (no selection)"
        placeholder="Select an option..."
        options={sampleOptions}
        disabled
      />
      <Dropdown
        label="Disabled with value"
        options={sampleOptions}
        value="home"
        disabled
      />
      <Dropdown
        label="Readonly text layout"
        options={sampleOptions}
        value="home"
        readonly
      />
    </div>
  ),
};

/* ── Programmatic ref focus ────────────────────────────── */

const RefFocusDemo = () => {
  const ref = useRef<HTMLSelectElement>(null);
  return (
    <div className="flex flex-col gap-[var(--spacing-12)] max-w-xs">
      <Dropdown label="Product category" options={sampleOptions} selectRef={ref} />
      <Button label="Focus the dropdown" onClick={() => ref.current?.focus()} />
    </div>
  );
};

export const RefFocus: Story = {
  render: () => <RefFocusDemo />,
};
