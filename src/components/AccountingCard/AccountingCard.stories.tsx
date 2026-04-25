import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AccountingCard } from './AccountingCard';

const meta = {
  title: 'Surfaces/AccountingCard',
  component: AccountingCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    onClick: fn(),
    onMenuClick: fn(),
  },
} satisfies Meta<typeof AccountingCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Placeholder brand logos for stories — in real usage consumers pass real
// provider logo URLs from their assets folder or CDN.
const sqlLogo = 'https://placehold.co/48x48/5a2d8c/ffffff?text=SQL';
const xeroLogo = 'https://placehold.co/48x48/13b5ea/ffffff?text=Xe';
const quickbooksLogo = 'https://placehold.co/48x48/2ca01c/ffffff?text=QB';
const autocountLogo = 'https://placehold.co/48x48/ff6b00/ffffff?text=AC';

export const Default: Story = {
  args: {
    logoSrc: sqlLogo,
    logoAlt: 'SQL Accounting',
    label: 'Test Company Sdn Bhd - Test Company Account (No. ABCDEFG - 12345678)',
  },
};

export const ShortLabel: Story = {
  args: {
    logoSrc: xeroLogo,
    logoAlt: 'Xero',
    label: 'My Primary Account',
  },
};

export const LongLabelTruncates: Story = {
  name: 'Long label (clamps at 3 lines)',
  args: {
    logoSrc: quickbooksLogo,
    logoAlt: 'QuickBooks',
    label:
      'This is an intentionally long account label meant to verify that the text clamp engages at three lines and the rest of the content is truncated with an ellipsis rather than pushing the card height beyond what a grid layout expects.',
  },
};

export const NoCardClick: Story = {
  name: 'Only ellipsis is interactive',
  parameters: {
    docs: {
      description: {
        story:
          'When `onClick` is omitted, the card is presentational and only the ellipsis menu is interactive. Useful when the entire surface is not a navigation target.',
      },
    },
  },
  args: {
    logoSrc: autocountLogo,
    logoAlt: 'AutoCount',
    label: 'View-only Account (No. XYZ-000001)',
    onClick: undefined,
  },
};

export const Grid: Story = {
  name: 'List of connected accounts',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-12)] max-w-[360px]">
      <AccountingCard
        logoSrc={sqlLogo}
        logoAlt="SQL Accounting"
        label="Test Company Sdn Bhd - Test Company Account (No. ABCDEFG - 12345678)"
        onClick={fn()}
        onMenuClick={fn()}
      />
      <AccountingCard
        logoSrc={xeroLogo}
        logoAlt="Xero"
        label="Acme Retail Pte Ltd"
        onClick={fn()}
        onMenuClick={fn()}
      />
      <AccountingCard
        logoSrc={quickbooksLogo}
        logoAlt="QuickBooks"
        label="Eastside Boutique LLC - Main Operating Account"
        onClick={fn()}
        onMenuClick={fn()}
      />
      <AccountingCard
        logoSrc={autocountLogo}
        logoAlt="AutoCount"
        label="Greenfield Trading - Secondary Ledger (Read Only)"
        onClick={fn()}
        onMenuClick={fn()}
      />
    </div>
  ),
};
