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
import { Dropdown } from '../Dropdown';

const meta = {
  title: 'Navigation/TopBar',
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

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ms', label: 'Bahasa Malaysia' },
  { value: 'zh-cn', label: '简体中文' },
  { value: 'zh-tw', label: '繁體中文' },
];

const HomepageDemo = () => {
  const [language, setLanguage] = useState('en');
  return (
    <TopBar container="full">
      {/* Left slot intentionally empty per Figma — the homepage variant
          centres its cluster with everything aligned right. */}
      <div className="flex-1" />
      <div className="flex items-center gap-[var(--spacing-20)]">
        {/* Refer A Friend — pill button with attention badge tucked into the top-right corner. */}
        <div className="relative inline-flex items-center">
          <Button variant="special" size="md" label="Refer A Friend" />
          <span className="absolute left-[106px] top-[-2px] pointer-events-none">
            <Badge variant="attention" label="1" size="default" />
          </span>
        </div>
        <TextLink
          variant="subtle"
          label="Help"
          iconPosition="left"
          icon={<Icon name="help-circle" size={17} />}
        />
        {/* Notification cluster (divider + bell + alert) sits inside its own gap-16 group per Figma. */}
        <div className="flex items-center gap-[var(--spacing-16)]">
          <div
            className="h-[33px] w-px bg-[var(--color-navigator-divider-border)]"
            aria-hidden="true"
          />
          <div className="relative inline-flex">
            <IconButton name="bell" label="Notifications" />
            <span className="absolute left-[19px] top-[6px] pointer-events-none">
              <Badge variant="attention" dotOnly />
            </span>
          </div>
          <IconButton name="alert-circle" label="System alerts" />
          <Dropdown
            id="topbar-language"
            options={LANGUAGE_OPTIONS}
            value={language}
            onChange={setLanguage}
            className="w-[103px]"
          />
          <IconButton name="server" label="Apps" />
          <div className="flex items-center gap-[var(--spacing-8)]">
            <Avatar size="sm" initials="A" />
            <span
              className={[
                'text-[color:var(--color-text-primary)]',
                'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)]',
                'text-[length:var(--text-14)] leading-[var(--leading-19)]',
              ].join(' ')}
            >
              Jane Doe
            </span>
          </div>
        </div>
      </div>
    </TopBar>
  );
};

export const Homepage: Story = {
  render: () => <HomepageDemo />,
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
