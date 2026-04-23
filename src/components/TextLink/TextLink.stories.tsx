import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TextLink } from './TextLink';
import { Icon } from '../Icon';

const meta = {
  title: 'Components/TextLink',
  component: TextLink,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['basic', 'subtle'] },
    iconPosition: { control: 'select', options: ['none', 'left', 'right'] },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Text Link',
    variant: 'basic',
    iconPosition: 'none',
    onClick: fn(),
  },
} satisfies Meta<typeof TextLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = { args: { variant: 'basic' } };
export const Subtle: Story = { args: { variant: 'subtle' } };
export const BasicWithIcon: Story = {
  args: {
    variant: 'basic',
    label: 'Add Item',
    iconPosition: 'left',
    icon: <Icon name="close" size={17} className="rotate-45" />,
  },
};
export const Disabled: Story = { args: { disabled: true } };
