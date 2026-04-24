import type { Meta, StoryObj } from '@storybook/react-vite';
import { Logo } from './Logo';

const meta = {
  title: 'Components/Logo',
  component: Logo,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    background: { control: 'inline-radio', options: ['light', 'dark'] },
    mode: { control: 'inline-radio', options: ['default', 'favicon'] },
    height: { control: { type: 'number', min: 16, max: 240, step: 4 } },
    title: { control: 'text' },
  },
  args: {
    background: 'light',
    mode: 'default',
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

const darkSurface =
  'bg-[var(--color-set-DEFAULT)] p-[var(--spacing-24)] rounded-[var(--radius-8)]';
const lightSurface =
  'bg-[var(--color-white)] p-[var(--spacing-24)] rounded-[var(--radius-8)] border border-[color:var(--color-space-DEFAULT)]';

export const Default: Story = {};

export const DarkBackground: Story = {
  args: { background: 'dark' },
  decorators: [
    (Story) => (
      <div className={darkSurface}>
        <Story />
      </div>
    ),
  ],
};

export const Favicon: Story = {
  args: { mode: 'favicon' },
};

export const FaviconDark: Story = {
  name: 'Favicon · Dark',
  args: { background: 'dark', mode: 'favicon' },
  decorators: [
    (Story) => (
      <div className={darkSurface}>
        <Story />
      </div>
    ),
  ],
};

/* ── All four variants side by side ──────────────────────── */

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-[var(--spacing-16)]">
      <div className={`${lightSurface} flex items-center justify-center`}>
        <Logo background="light" mode="default" />
      </div>
      <div className={`${darkSurface} flex items-center justify-center`}>
        <Logo background="dark" mode="default" />
      </div>
      <div className={`${lightSurface} flex items-center justify-center`}>
        <Logo background="light" mode="favicon" />
      </div>
      <div className={`${darkSurface} flex items-center justify-center`}>
        <Logo background="dark" mode="favicon" />
      </div>
    </div>
  ),
};

/* ── Size range ──────────────────────────────────────────── */

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-[var(--spacing-24)]">
      <Logo height={24} />
      <Logo height={32} />
      <Logo height={48} />
      <Logo height={58} />
      <Logo height={96} />
    </div>
  ),
};

export const FaviconSizes: Story = {
  render: () => (
    <div className="flex items-end gap-[var(--spacing-24)]">
      <Logo mode="favicon" height={16} />
      <Logo mode="favicon" height={24} />
      <Logo mode="favicon" height={32} />
      <Logo mode="favicon" height={48} />
      <Logo mode="favicon" height={60} />
    </div>
  ),
};
