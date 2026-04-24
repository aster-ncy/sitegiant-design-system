import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
  },
  args: {
    initials: 'A',
    size: 'md',
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { initials: 'A', size: 'md' },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-[var(--spacing-16)]">
      <Avatar size="xs" initials="A" />
      <Avatar size="sm" initials="A" />
      <Avatar size="md" initials="A" />
      <Avatar size="lg" initials="A" />
      <Avatar size="xl" initials="A" />
    </div>
  ),
};

export const TwoLetterInitials: Story = {
  render: () => (
    <div className="flex items-end gap-[var(--spacing-16)]">
      <Avatar size="sm" initials="AN" />
      <Avatar size="md" initials="AN" />
      <Avatar size="lg" initials="AN" />
      <Avatar size="xl" initials="AN" />
    </div>
  ),
};

const photo =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
       <defs>
         <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
           <stop offset="0" stop-color="#5ACC5A"/>
           <stop offset="1" stop-color="#007CE0"/>
         </linearGradient>
       </defs>
       <rect width="100" height="100" fill="url(#g)"/>
       <circle cx="50" cy="40" r="18" fill="white" opacity="0.9"/>
       <rect x="22" y="62" width="56" height="48" rx="28" fill="white" opacity="0.9"/>
     </svg>`,
  );

export const WithImage: Story = {
  render: () => (
    <div className="flex items-end gap-[var(--spacing-16)]">
      <Avatar size="xs" src={photo} alt="User" />
      <Avatar size="sm" src={photo} alt="User" />
      <Avatar size="md" src={photo} alt="User" />
      <Avatar size="lg" src={photo} alt="User" />
      <Avatar size="xl" src={photo} alt="User" />
    </div>
  ),
};

export const EmptyPlaceholder: Story = {
  name: 'Empty placeholder (no src, no initials)',
  render: () => (
    <div className="flex items-end gap-[var(--spacing-16)]">
      <Avatar size="xs" />
      <Avatar size="sm" />
      <Avatar size="md" />
      <Avatar size="lg" />
      <Avatar size="xl" />
    </div>
  ),
};
