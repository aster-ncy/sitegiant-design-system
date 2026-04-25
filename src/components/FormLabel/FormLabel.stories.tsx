import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormLabel, type FormLabelSize, type FormLabelWeight } from './FormLabel';

const meta = {
  title: 'Forms/FormLabel',
  component: FormLabel,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] satisfies FormLabelSize[] },
    weight: { control: 'inline-radio', options: ['regular', 'medium', 'bold'] satisfies FormLabelWeight[] },
    required: { control: 'boolean' },
    showIcon: { control: 'boolean' },
    hintText: { control: 'text' },
    label: { control: 'text' },
  },
  args: {
    label: 'Label',
  },
} satisfies Meta<typeof FormLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Email address' },
};

export const Required: Story = {
  args: { label: 'Email address', required: true },
};

export const WithIcon: Story = {
  args: { label: 'Email address', required: true, showIcon: true },
};

export const WithHint: Story = {
  args: {
    label: 'Email address',
    required: true,
    showIcon: true,
    hintText: "We'll never share your email.",
  },
};

export const Bold: Story = {
  args: { label: 'Email address', required: true, weight: 'bold' },
};

export const Medium: Story = {
  args: { label: 'Email address', required: true, weight: 'medium' },
};

export const Small: Story = {
  args: { label: 'Email address', required: true, size: 'sm', showIcon: true, hintText: 'Hint text' },
};

export const Large: Story = {
  args: { label: 'Email address', required: true, size: 'lg', showIcon: true, hintText: 'Hint text' },
};

export const FullMatrix: Story = {
  args: { label: 'Label' },
  render: () => {
    const sizes: FormLabelSize[] = ['sm', 'md', 'lg'];
    const weights: FormLabelWeight[] = ['regular', 'medium', 'bold'];
    return (
      <div className="grid grid-cols-3 gap-x-[var(--spacing-32)] gap-y-[var(--spacing-16)]">
        {sizes.flatMap((size) =>
          weights.map((weight) => (
            <FormLabel
              key={`${size}-${weight}`}
              label={`${size}/${weight}`}
              size={size}
              weight={weight}
              required
              showIcon
              hintText="Hint text"
            />
          )),
        )}
      </div>
    );
  },
};

export const WithCustomIcon: Story = {
  args: { label: 'Edit profile', icon: 'edit', showIcon: true, weight: 'medium' },
};
