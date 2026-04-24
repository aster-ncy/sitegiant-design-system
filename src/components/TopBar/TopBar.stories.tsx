import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TopBar } from './TopBar';
import { IconButton } from './IconButton';
import { SegmentedButton } from './SegmentedButton';
import { Button } from '../Button';
import { EllipsisButton } from '../Button';
import { TextLink } from '../TextLink';
import { Badge } from '../Badge';
import { Icon } from '../Icon';
import { Avatar } from '../Avatar';
import { Logo } from '../Logo';

const meta = {
  title: 'Components/TopBar',
  component: TopBar,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof TopBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Inner Page variants (Fullwidth / Large / Medium / Small) ──────── */

const innerPageLeft = <TopBar.Back title="Page Title" />;
const innerPageRight = (
  <>
    <EllipsisButton />
    <Button variant="outline" label="Button" size="md" />
    <Button variant="primary" label="Button" size="md" />
  </>
);

export const InnerPageFullwidth: Story = {
  args: {
    container: 'full',
    left: innerPageLeft,
    right: innerPageRight,
  },
};

export const InnerPageLarge: Story = {
  args: {
    container: 'lg',
    left: innerPageLeft,
    right: innerPageRight,
  },
};

export const InnerPageMedium: Story = {
  args: {
    container: 'md',
    left: innerPageLeft,
    right: innerPageRight,
  },
};

export const InnerPageSmall: Story = {
  args: {
    container: 'sm',
    left: innerPageLeft,
    right: innerPageRight,
  },
};

/* ── Webstore Builder ──────────────────────────────────────────────── */

const WebstoreBuilderDemo = () => {
  const [preview, setPreview] = useState('desktop');
  return (
    <TopBar
      container="full"
      left={<TopBar.Back backLabel="Back to storefront settings" />}
      center={
        <SegmentedButton
          value={preview}
          onChange={setPreview}
          options={[
            { value: 'desktop', icon: 'monitor', label: 'Desktop' },
            { value: 'tablet', icon: 'tablet', label: 'Tablet' },
            { value: 'mobile', icon: 'mobile', label: 'Mobile' },
          ]}
        />
      }
      right={
        <>
          <IconButton name="eye" label="Preview" />
          <Button
            variant="outline"
            size="md"
            leftIcon={<Icon name="reverse-ccw" size={17} />}
            label="Reset to Default"
          />
          <Button variant="primary" size="md" label="Save and Publish" />
        </>
      }
    />
  );
};

export const WebstoreBuilder: Story = {
  render: () => <WebstoreBuilderDemo />,
};

/* ── Homepage (full desktop topbar) ────────────────────────────────── */

export const Homepage: Story = {
  render: () => (
    <TopBar container="full">
      {/* Left slot intentionally empty per Figma — the homepage variant
          centres its cluster with everything aligned right. */}
      <div className="flex-1" />
      <div className="flex items-center gap-[var(--spacing-20)]">
        <div className="relative inline-flex">
          <Button variant="special" size="md" label="Refer A Friend" />
          <span className="absolute -top-0.5 -right-1">
            <Badge variant="attention" label="1" size="default" />
          </span>
        </div>
        <TextLink
          variant="subtle"
          label="Help"
          iconPosition="left"
          icon={<Icon name="help-circle" size={17} />}
        />
        <div
          className="h-8 w-px"
          style={{ backgroundColor: 'var(--color-navigator-divider-border)' }}
          aria-hidden="true"
        />
        <div className="relative">
          <IconButton name="bell" label="Notifications" />
          <span className="absolute top-1 right-1 pointer-events-none">
            <Badge variant="attention" dotOnly />
          </span>
        </div>
        <IconButton name="alert-circle" label="System alerts" />
        {/* Language switcher — compact form-dropdown shell inline. */}
        <button
          type="button"
          className={[
            'h-8 w-24 pl-3 pr-2 inline-flex items-center justify-between',
            'rounded-[var(--radius-4)]',
            'bg-[var(--color-form-dropdown-default-fill)]',
            'border border-[color:var(--color-form-dropdown-default-border)]',
            'text-[color:var(--color-form-dropdown-value-text)]',
            'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
            'text-[length:var(--text-14)] leading-[var(--leading-16)]',
          ].join(' ')}
        >
          <span>English</span>
          <Icon name="chevron-down" size={17} />
        </button>
        <IconButton name="server" label="Apps" />
        <div className="flex items-center gap-[var(--spacing-8)]">
          <Avatar size="sm" initials="A" />
          <span
            className={[
              'text-[color:var(--color-text-primary)]',
              'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
              'text-[length:var(--text-14)] leading-[var(--leading-20)]',
            ].join(' ')}
          >
            Andy Lam
          </span>
        </div>
      </div>
    </TopBar>
  ),
};

/* ── Mobile Homepage ───────────────────────────────────────────────── */

export const MobileHomepage: Story = {
  render: () => (
    <div className="w-96 mx-auto">
      <TopBar
        container="full"
        className="px-[var(--spacing-12)] py-[var(--spacing-8)]"
        left={<Logo mode="favicon" height={32} />}
        right={
          <div className="flex items-center gap-[var(--spacing-4)]">
            <div className="relative">
              <IconButton name="bell" label="Notifications" />
              <span className="absolute top-1 right-1 pointer-events-none">
                <Badge variant="attention" dotOnly />
              </span>
            </div>
            <IconButton name="alert-circle" label="System alerts" />
            <IconButton name="menu" label="Open menu" />
          </div>
        }
      />
    </div>
  ),
};

/* ── Overview ──────────────────────────────────────────────────────── */

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-20)] p-[var(--spacing-20)] bg-[var(--color-space-lighter)]">
      <TopBar container="full" left={innerPageLeft} right={innerPageRight} />
      <TopBar container="lg" left={innerPageLeft} right={innerPageRight} />
      <TopBar container="md" left={innerPageLeft} right={innerPageRight} />
      <TopBar container="sm" left={innerPageLeft} right={innerPageRight} />
    </div>
  ),
};
