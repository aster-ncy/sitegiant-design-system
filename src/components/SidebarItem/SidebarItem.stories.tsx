import type { Meta, StoryObj } from '@storybook/react-vite';
import { SidebarItem } from './SidebarItem';
import { SidebarTag } from './SidebarTag';

const meta = {
  title: 'Navigation/Sidebar/Item',
  component: SidebarItem,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['main', 'submenu'] },
    theme: { control: 'inline-radio', options: ['default', 'premium'] },
    state: { control: 'inline-radio', options: ['default', 'hover', 'focus'] },
    collapsed: { control: 'boolean' },
    showChevron: { control: 'boolean' },
  },
  args: {
    label: 'Home',
    variant: 'main',
    theme: 'default',
    state: 'default',
  },
} satisfies Meta<typeof SidebarItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Playground ────────────────────────────────────────── */

export const Playground: Story = {};

/* ── Overview matching the Figma "Sidebar" section ─────── */

const lightSurface =
  'bg-[var(--color-white)] border border-[color:var(--color-navigator-border)] rounded-[var(--radius-8)] p-[var(--spacing-16)]';
const darkSurface =
  'bg-[var(--color-navigator-sidebar-premium-fill)] rounded-[var(--radius-8)] p-[var(--spacing-16)]';

const ColHeader = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => (
  <p
    className={[
      'text-[length:var(--text-11)] leading-[var(--leading-12)]',
      'font-[family-name:var(--font-sans)] font-[var(--font-weight-medium)]',
      'mb-[var(--spacing-8)]',
      dark ? 'text-[color:var(--color-white)]' : 'text-[color:var(--color-text-info)]',
    ].join(' ')}
  >
    {children}
  </p>
);

const Column = ({
  title,
  children,
  dark = false,
}: {
  title: string;
  children: React.ReactNode;
  dark?: boolean;
}) => (
  <div className={dark ? darkSurface : lightSurface}>
    <ColHeader dark={dark}>{title}</ColHeader>
    <div className="flex flex-col gap-[var(--spacing-2)]">{children}</div>
  </div>
);

export const DefaultTheme: Story = {
  name: 'Default theme — all variants',
  render: () => (
    <div className="grid grid-cols-3 gap-[var(--spacing-16)]">
      <Column title="Main">
        <SidebarItem label="Home" leadingIcon="home" state="default" />
        <SidebarItem label="Home" leadingIcon="home" state="hover" />
        <SidebarItem label="Home" leadingIcon="home" state="focus" />
      </Column>

      <Column title="Main · with Tag">
        <SidebarItem label="Home" leadingIcon="home" state="default" tag={<SidebarTag />} />
        <SidebarItem label="Home" leadingIcon="home" state="hover" tag={<SidebarTag />} />
        <SidebarItem label="Home" leadingIcon="home" state="focus" tag={<SidebarTag />} />
      </Column>

      <Column title="Main · with Trailing Icon">
        <SidebarItem label="Home" leadingIcon="home" trailingIcon="eye" state="default" />
        <SidebarItem label="Home" leadingIcon="home" trailingIcon="eye" state="hover" />
        <SidebarItem label="Home" leadingIcon="home" trailingIcon="eye" state="focus" />
      </Column>

      <Column title="Menu with Submenu">
        <SidebarItem label="Orders" leadingIcon="shopping-cart" showChevron state="default" />
        <SidebarItem label="Orders" leadingIcon="shopping-cart" showChevron state="hover" />
        <SidebarItem label="Orders" leadingIcon="shopping-cart" showChevron state="focus" />
      </Column>

      <Column title="Submenu (child row)">
        <SidebarItem variant="submenu" label="All orders" state="default" />
        <SidebarItem variant="submenu" label="All orders" state="hover" />
        <SidebarItem variant="submenu" label="All orders" state="focus" />
        <SidebarItem variant="submenu" label="Hot sale" state="default" tag={<SidebarTag />} />
      </Column>

      <Column title="Collapsed rail">
        <SidebarItem label="Home" leadingIcon="home" collapsed state="default" />
        <SidebarItem label="Home" leadingIcon="home" collapsed state="hover" />
        <SidebarItem label="Home" leadingIcon="home" collapsed state="focus" />
      </Column>
    </div>
  ),
};

export const PremiumTheme: Story = {
  name: 'Premium theme — all variants',
  render: () => (
    <div className="grid grid-cols-3 gap-[var(--spacing-16)]">
      <Column dark title="Main">
        <SidebarItem theme="premium" label="Home" leadingIcon="home" state="default" />
        <SidebarItem theme="premium" label="Home" leadingIcon="home" state="hover" />
        <SidebarItem theme="premium" label="Home" leadingIcon="home" state="focus" />
      </Column>

      <Column dark title="Main · with Tag">
        <SidebarItem theme="premium" label="Home" leadingIcon="home" state="default" tag={<SidebarTag />} />
        <SidebarItem theme="premium" label="Home" leadingIcon="home" state="hover" tag={<SidebarTag />} />
        <SidebarItem theme="premium" label="Home" leadingIcon="home" state="focus" tag={<SidebarTag />} />
      </Column>

      <Column dark title="Main · with Trailing Icon">
        <SidebarItem theme="premium" label="Home" leadingIcon="home" trailingIcon="eye" state="default" />
        <SidebarItem theme="premium" label="Home" leadingIcon="home" trailingIcon="eye" state="hover" />
        <SidebarItem theme="premium" label="Home" leadingIcon="home" trailingIcon="eye" state="focus" />
      </Column>

      <Column dark title="Menu with Submenu">
        <SidebarItem theme="premium" label="Orders" leadingIcon="shopping-cart" showChevron state="default" />
        <SidebarItem theme="premium" label="Orders" leadingIcon="shopping-cart" showChevron state="hover" />
        <SidebarItem theme="premium" label="Orders" leadingIcon="shopping-cart" showChevron state="focus" />
      </Column>

      <Column dark title="Submenu (child row)">
        <SidebarItem theme="premium" variant="submenu" label="All orders" state="default" />
        <SidebarItem theme="premium" variant="submenu" label="All orders" state="hover" />
        <SidebarItem theme="premium" variant="submenu" label="All orders" state="focus" />
        <SidebarItem theme="premium" variant="submenu" label="Hot sale" state="default" tag={<SidebarTag />} />
      </Column>

      <Column dark title="Collapsed rail">
        <SidebarItem theme="premium" label="Home" leadingIcon="home" collapsed state="default" />
        <SidebarItem theme="premium" label="Home" leadingIcon="home" collapsed state="hover" />
        <SidebarItem theme="premium" label="Home" leadingIcon="home" collapsed state="focus" />
      </Column>
    </div>
  ),
};

/* ── Mini composition — parent with expanded children ─────── */

export const ExpandedGroup: Story = {
  name: 'Group — parent + expanded children',
  render: () => (
    <div className={lightSurface}>
      <div className="flex flex-col gap-[var(--spacing-2)] w-[208px]">
        <SidebarItem label="Orders" leadingIcon="shopping-cart" showChevron state="focus" />
        <SidebarItem variant="submenu" label="All orders" state="default" />
        <SidebarItem variant="submenu" label="Pending" state="hover" />
        <SidebarItem variant="submenu" label="Hot sale" state="focus" tag={<SidebarTag />} />
        <SidebarItem variant="submenu" label="Fulfilled" state="default" />
      </div>
    </div>
  ),
};
