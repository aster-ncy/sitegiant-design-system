import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sidebar } from './Sidebar';
import { SidebarItem, SidebarTag } from '../SidebarItem';

const meta = {
  title: 'Components/Sidebar/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'inline-radio', options: ['expand', 'collapse'] },
    theme: { control: 'inline-radio', options: ['default', 'premium'] },
  },
  args: {
    mode: 'expand',
    theme: 'default',
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Demo content matching the Figma rail ────────────────── */

type Mode = 'expand' | 'collapse';
type Theme = 'default' | 'premium';

const NavContent = ({ mode, theme }: { mode: Mode; theme: Theme }) => {
  const isExpanded = mode === 'expand';
  return (
    <>
      <SidebarItem label="Get Started" leadingIcon="get-started" collapsed={!isExpanded} theme={theme} />
      <SidebarItem label="Home" leadingIcon="home" collapsed={!isExpanded} theme={theme} state="focus" />
      <SidebarItem label="Orders" leadingIcon="orders" showChevron collapsed={!isExpanded} theme={theme} />
      <SidebarItem label="Products" leadingIcon="products" showChevron collapsed={!isExpanded} theme={theme} />
      <SidebarItem label="Inventory" leadingIcon="inventory" showChevron collapsed={!isExpanded} theme={theme} />
      <SidebarItem label="Customers" leadingIcon="customers" showChevron collapsed={!isExpanded} theme={theme} />
      <SidebarItem label="Customer Service" leadingIcon="customer-service" collapsed={!isExpanded} theme={theme} />
      <SidebarItem label="WhatsApp Chat" leadingIcon="whatsapp-chat" collapsed={!isExpanded} theme={theme} />
      <SidebarItem label="Marketing Centre" leadingIcon="marketing-centre" showChevron collapsed={!isExpanded} theme={theme} />
      <SidebarItem label="Analytics" leadingIcon="analytics" collapsed={!isExpanded} theme={theme} />
      <SidebarItem label="Apps" leadingIcon="apps" collapsed={!isExpanded} theme={theme} />
      <SidebarItem
        label="Mobile App"
        leadingIcon="mobile-app"
        collapsed={!isExpanded}
        theme={theme}
        tag={<SidebarTag label="Hot" />}
      />
      <SidebarItem
        label="OMO Solution"
        leadingIcon="omo-solution"
        collapsed={!isExpanded}
        theme={theme}
        tag={<SidebarTag label="New" variant="new" />}
      />

      <Sidebar.Section
        label="CHANNELS"
        mode={mode}
        theme={theme}
        action={{ icon: 'plus-circle', label: 'Add channel' }}
      />

      <SidebarItem
        label="Webstore"
        leadingIcon="web"
        trailingIcon={isExpanded ? 'eye' : undefined}
        collapsed={!isExpanded}
        theme={theme}
      />
      <SidebarItem label="Shopee" leadingIcon="shopping-bag" collapsed={!isExpanded} theme={theme} />
      <SidebarItem label="Lazada" leadingIcon="shopping-bag" collapsed={!isExpanded} theme={theme} />
      <SidebarItem label="TikTok" leadingIcon="mobile" collapsed={!isExpanded} theme={theme} />
      <SidebarItem label="Zalora" leadingIcon="tag" collapsed={!isExpanded} theme={theme} />
    </>
  );
};

const Footer = ({ mode, theme }: { mode: Mode; theme: Theme }) => (
  <Sidebar.Footer
    mode={mode}
    theme={theme}
    actions={[
      { icon: 'settings', label: 'Settings' },
      { icon: 'clear-cache', label: 'Clear cache' },
    ]}
  />
);

/* ── Viewport wrapper — gives the rail a full-height column ──
 *
 * Autodocs renders each story inside a short preview iframe (not the
 * full Storybook canvas), so `h-screen` would collapse to whatever the
 * iframe's viewport height is — often ~40px — and clip the sidebar
 * header. We pin an explicit height instead so the sidebar has room in
 * both Docs previews and the Canvas view. */
const Viewport = ({ children }: { children: React.ReactNode }) => (
  <div
    className="flex bg-[var(--color-space-lighter)]"
    style={{ height: '720px', minHeight: '720px' }}
  >
    {children}
  </div>
);

/* ── Stories ──────────────────────────────────────────────── */

export const ExpandDefault: Story = {
  name: 'Expand · Default theme',
  render: (args) => (
    <Viewport>
      <Sidebar {...args} mode="expand" theme="default" footer={<Footer mode="expand" theme="default" />}>
        <NavContent mode="expand" theme="default" />
      </Sidebar>
    </Viewport>
  ),
};

export const CollapseDefault: Story = {
  name: 'Collapse · Default theme',
  render: (args) => (
    <Viewport>
      <Sidebar {...args} mode="collapse" theme="default" footer={<Footer mode="collapse" theme="default" />}>
        <NavContent mode="collapse" theme="default" />
      </Sidebar>
    </Viewport>
  ),
};

export const ExpandPremium: Story = {
  name: 'Expand · Premium theme',
  render: (args) => (
    <Viewport>
      <Sidebar {...args} mode="expand" theme="premium" footer={<Footer mode="expand" theme="premium" />}>
        <NavContent mode="expand" theme="premium" />
      </Sidebar>
    </Viewport>
  ),
};

export const CollapsePremium: Story = {
  name: 'Collapse · Premium theme',
  render: (args) => (
    <Viewport>
      <Sidebar {...args} mode="collapse" theme="premium" footer={<Footer mode="collapse" theme="premium" />}>
        <NavContent mode="collapse" theme="premium" />
      </Sidebar>
    </Viewport>
  ),
};

/* ── Playground — exposes args for interactive tweaking ───── */

export const Playground: Story = {
  render: ({ mode = 'expand', theme = 'default' }) => (
    <Viewport>
      <Sidebar mode={mode} theme={theme} footer={<Footer mode={mode!} theme={theme!} />}>
        <NavContent mode={mode!} theme={theme!} />
      </Sidebar>
    </Viewport>
  ),
};
