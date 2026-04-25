import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DropdownMenu } from './DropdownMenu';
import { DropdownMenuItem } from './DropdownMenuItem';
import { DropdownMenuDivider } from './DropdownMenuDivider';
import { DropdownMenuCustomInput } from './DropdownMenuCustomInput';
import { DropdownMenuActions } from './DropdownMenuActions';

const meta = {
  title: 'Navigation/DropdownMenu',
  component: DropdownMenu,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const MyFlag = () => (
  <div className="w-[24px] h-[18px] bg-[var(--color-sys-red-DEFAULT)] relative overflow-hidden rounded-[2px]" />
);

const AppIcon = () => (
  <div className="w-[18px] h-[18px] bg-gradient-to-br from-[var(--color-sys-red-DEFAULT)] to-[var(--color-sys-orange-DEFAULT)] rounded-[4px]" />
);

export const DefaultItems: Story = {
  render: () => (
    <DropdownMenu width={240}>
      <DropdownMenuItem label="Option" highlight="Option Highlight" state="default" />
      <DropdownMenuItem label="Option" highlight="Option Highlight" state="hover" />
      <DropdownMenuItem label="Option" highlight="Option Highlight" state="selected" selected />
    </DropdownMenu>
  ),
};

export const CountryItems: Story = {
  render: () => (
    <DropdownMenu width={240}>
      <DropdownMenuItem leading={<MyFlag />} label="Option" highlight="Option Highlight" state="default" />
      <DropdownMenuItem leading={<MyFlag />} label="Option" highlight="Option Highlight" state="hover" />
      <DropdownMenuItem leading={<MyFlag />} label="Option" highlight="Option Highlight" state="selected" selected />
    </DropdownMenu>
  ),
};

export const AppIconItems: Story = {
  render: () => (
    <DropdownMenu width={240}>
      <DropdownMenuItem leading={<AppIcon />} label="Option" highlight="Option Highlight" state="default" />
      <DropdownMenuItem leading={<AppIcon />} label="Option" highlight="Option Highlight" state="hover" />
      <DropdownMenuItem leading={<AppIcon />} label="Option" highlight="Option Highlight" state="selected" selected />
    </DropdownMenu>
  ),
};

export const WithDivider: Story = {
  render: () => (
    <DropdownMenu width={240}>
      <DropdownMenuItem label="Option 1" />
      <DropdownMenuItem label="Option 2" />
      <DropdownMenuDivider />
      <DropdownMenuItem label="Option 3" />
      <DropdownMenuItem label="Option 4" selected />
    </DropdownMenu>
  ),
};

export const WithCustomInput: Story = {
  render: () => (
    <DropdownMenu width={260}>
      <DropdownMenuItem label="Small" />
      <DropdownMenuItem label="Medium" selected />
      <DropdownMenuItem label="Large" />
      <DropdownMenuDivider />
      <DropdownMenuCustomInput onAdd={fn()} />
    </DropdownMenu>
  ),
};

export const WithActions: Story = {
  render: () => (
    <DropdownMenu width={280}>
      <DropdownMenuItem label="Option 1" selected />
      <DropdownMenuItem label="Option 2" />
      <DropdownMenuItem label="Option 3" />
      <DropdownMenuDivider />
      <DropdownMenuActions onReset={fn()} onCancel={fn()} onSave={fn()} />
    </DropdownMenu>
  ),
};

export const FullExample: Story = {
  render: () => (
    <DropdownMenu width={280}>
      <DropdownMenuItem leading={<MyFlag />} label="Malaysia" highlight="+60" />
      <DropdownMenuItem leading={<MyFlag />} label="Singapore" highlight="+65" selected />
      <DropdownMenuItem leading={<MyFlag />} label="Indonesia" highlight="+62" />
      <DropdownMenuDivider />
      <DropdownMenuCustomInput placeholder="Custom option" onAdd={fn()} />
      <DropdownMenuActions onReset={fn()} onCancel={fn()} onSave={fn()} />
    </DropdownMenu>
  ),
};
