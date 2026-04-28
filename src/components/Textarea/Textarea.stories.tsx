import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Textarea } from './Textarea';

const meta = {
  title: 'Forms/Textarea',
  component: Textarea,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    placeholder: 'Write comment here',
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'disabled', 'readonly', 'readonly-bold'],
    },
    validation: { control: 'select', options: ['default', 'error'] },
    showCount: { control: 'boolean' },
    maxLength: { control: 'number' },
    rows: { control: 'number' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 328 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { helperText: 'Hint text' },
};

export const Filled: Story = {
  args: {
    defaultValue: "Hi, here's some text that was previously entered into the textarea field.",
    helperText: 'Hint text',
  },
};

export const Error: Story = {
  args: {
    validation: 'error',
    helperText: 'Hint text',
  },
};

export const ErrorFilled: Story = {
  args: {
    defaultValue: "Hi, here's some text that was previously entered.",
    validation: 'error',
    helperText: 'Hint text',
  },
};

export const Disabled: Story = {
  args: {
    state: 'disabled',
    defaultValue: "Hi, here's some text.",
    helperText: 'Hint text',
  },
};

export const Readonly: Story = {
  args: {
    state: 'readonly',
    defaultValue: "Hi, here's some text.",
    helperText: 'Hint text',
  },
};

export const ReadonlyBold: Story = {
  args: {
    state: 'readonly-bold',
    defaultValue: "Hi, here's some text.",
    helperText: 'Hint text',
  },
};

export const WithCharCount: Story = {
  args: {
    maxLength: 500,
    showCount: true,
    helperText: 'Hint text',
  },
};

export const CharCountOnly: Story = {
  args: {
    maxLength: 500,
    showCount: true,
  },
};

export const Controlled: Story = {
  render: function Controlled(args) {
    const [val, setVal] = useState('');
    return (
      <Textarea
        {...args}
        value={val}
        onChange={setVal}
        maxLength={200}
        showCount
        helperText="Controlled textarea"
      />
    );
  },
  args: {
    placeholder: 'Type here...',
  },
};

export const FullMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-16)]" style={{ width: 700 }}>
      <div className="flex gap-[var(--spacing-16)]">
        <div className="flex-1">
          <p className="text-[length:var(--text-12)] text-[color:var(--color-text-info)] mb-[var(--spacing-4)]">
            Default
          </p>
          <Textarea placeholder="Write comment here" helperText="Hint text" />
        </div>
        <div className="flex-1">
          <p className="text-[length:var(--text-12)] text-[color:var(--color-text-info)] mb-[var(--spacing-4)]">
            Error
          </p>
          <Textarea placeholder="Write comment here" validation="error" helperText="Hint text" />
        </div>
      </div>
      <div className="flex gap-[var(--spacing-16)]">
        <div className="flex-1">
          <p className="text-[length:var(--text-12)] text-[color:var(--color-text-info)] mb-[var(--spacing-4)]">
            Filled
          </p>
          <Textarea defaultValue="Hi, here's some text." helperText="Hint text" />
        </div>
        <div className="flex-1">
          <p className="text-[length:var(--text-12)] text-[color:var(--color-text-info)] mb-[var(--spacing-4)]">
            Filled Error
          </p>
          <Textarea defaultValue="Hi, here's some text." validation="error" helperText="Hint text" />
        </div>
      </div>
      <div className="flex gap-[var(--spacing-16)]">
        <div className="flex-1">
          <p className="text-[length:var(--text-12)] text-[color:var(--color-text-info)] mb-[var(--spacing-4)]">
            Disabled
          </p>
          <Textarea state="disabled" defaultValue="Hi, here's some text." helperText="Hint text" />
        </div>
        <div className="flex-1">
          <p className="text-[length:var(--text-12)] text-[color:var(--color-text-info)] mb-[var(--spacing-4)]">
            Disabled Error
          </p>
          <Textarea state="disabled" defaultValue="Hi, here's some text." validation="error" helperText="Hint text" />
        </div>
      </div>
      <div className="flex gap-[var(--spacing-16)]">
        <div className="flex-1">
          <p className="text-[length:var(--text-12)] text-[color:var(--color-text-info)] mb-[var(--spacing-4)]">
            Readonly
          </p>
          <Textarea state="readonly" defaultValue="Hi, here's some text." helperText="Hint text" />
        </div>
        <div className="flex-1">
          <p className="text-[length:var(--text-12)] text-[color:var(--color-text-info)] mb-[var(--spacing-4)]">
            Readonly Bold
          </p>
          <Textarea state="readonly-bold" defaultValue="Hi, here's some text." helperText="Hint text" />
        </div>
      </div>
    </div>
  ),
  args: {
    placeholder: 'Write comment here',
  },
};
