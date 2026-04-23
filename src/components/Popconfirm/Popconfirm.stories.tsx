import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Popconfirm } from './Popconfirm';

const meta = {
  title: 'Components/Popconfirm',
  component: Popconfirm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['default', 'header', 'footer'] },
    buttonCount: { control: 'select', options: ['2', '1'] },
    showCheckbox: { control: 'boolean' },
    showFooterAddOn: { control: 'boolean' },
  },
  args: {
    onPrimaryClick: fn(),
    onSecondaryClick: fn(),
    onCheckboxChange: fn(),
    onFooterAddOnChange: fn(),
  },
} satisfies Meta<typeof Popconfirm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: 'Popconfirm Heading',
    body: 'Popconfirm Body',
    type: 'default',
    buttonCount: '2',
    showCheckbox: true,
    checkboxLabel: 'Checkbox Value',
    primaryLabel: 'Confirm',
    secondaryLabel: 'Cancel',
  },
};

export const SingleButton: Story = {
  args: {
    heading: 'Popconfirm Heading',
    body: 'Popconfirm Body',
    type: 'default',
    buttonCount: '1',
    showCheckbox: true,
    checkboxLabel: 'Checkbox Value',
    primaryLabel: 'Confirm',
  },
};

export const NoCheckbox: Story = {
  args: {
    heading: 'Popconfirm Heading',
    body: 'Popconfirm Body',
    type: 'default',
    buttonCount: '2',
    showCheckbox: false,
    primaryLabel: 'Confirm',
    secondaryLabel: 'Cancel',
  },
};

export const Header: Story = {
  args: {
    heading: 'Popconfirm Heading',
    type: 'header',
  },
};

export const Footer: Story = {
  args: {
    type: 'footer',
    buttonCount: '2',
    primaryLabel: 'Confirm',
    secondaryLabel: 'Cancel',
    showFooterAddOn: false,
  },
};

export const FooterWithAddOn: Story = {
  args: {
    type: 'footer',
    buttonCount: '2',
    primaryLabel: 'Confirm',
    secondaryLabel: 'Cancel',
    showFooterAddOn: true,
    footerAddOnLabel: 'Do not display again',
    footerAddOnChecked: false,
  },
};

export const FooterSingleButton: Story = {
  args: {
    type: 'footer',
    buttonCount: '1',
    primaryLabel: 'Confirm',
    showFooterAddOn: true,
    footerAddOnLabel: 'Do not display again',
  },
};
