import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { useState } from 'react';
import { SearchBox } from './SearchBox';

const meta = {
  title: 'Components/SearchBox',
  component: SearchBox,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'with-categories', 'search-placeholder-only', 'dropdown', 'date-range', 'date-range-with-search'],
    },
    size: { control: 'select', options: ['default', 'small'] },
    state: { control: 'select', options: ['default', 'focus', 'danger', 'disabled', 'readonly'] },
    showSearchButton: { control: 'boolean' },
  },
  args: {
    onChange: fn(),
    onClear: fn(),
    onSearchClick: fn(),
    onCategoryClick: fn(),
  },
} satisfies Meta<typeof SearchBox>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Default type ────────────────────────────────────── */

export const Default: Story = {
  args: { type: 'default', size: 'default' },
};

export const DefaultSmall: Story = {
  args: { type: 'default', size: 'small' },
};

/* ── With Categories ─────────────────────────────────── */

export const WithCategories: Story = {
  args: { type: 'with-categories', size: 'default', showSearchButton: false },
};

export const WithCategoriesSmall: Story = {
  args: { type: 'with-categories', size: 'small', showSearchButton: false },
};

export const WithCategoriesSearchButton: Story = {
  args: { type: 'with-categories', size: 'default', showSearchButton: true },
};

export const WithCategoriesSearchButtonSmall: Story = {
  args: { type: 'with-categories', size: 'small', showSearchButton: true },
};

/* ── Search Placeholder Only ─────────────────────────── */

export const SearchPlaceholderOnly: Story = {
  args: { type: 'search-placeholder-only', size: 'default', showSearchButton: true },
};

export const SearchPlaceholderOnlySmall: Story = {
  args: { type: 'search-placeholder-only', size: 'small', showSearchButton: true },
};

/* ── Dropdown ────────────────────────────────────────── */

export const Dropdown: Story = {
  args: { type: 'dropdown', size: 'default', label: 'Search Label' },
};

export const DropdownSmall: Story = {
  args: { type: 'dropdown', size: 'small', label: 'Search Label' },
};

/* ── Date Range ──────────────────────────────────────── */

export const DateRange: Story = {
  args: { type: 'date-range', size: 'default', label: 'Search Label' },
};

export const DateRangeSmall: Story = {
  args: { type: 'date-range', size: 'small', label: 'Search Label' },
};

/* ── Date Range with Search ──────────────────────────── */

export const DateRangeWithSearch: Story = {
  args: { type: 'date-range-with-search', size: 'default', label: 'Search Label' },
};

export const DateRangeWithSearchSmall: Story = {
  args: { type: 'date-range-with-search', size: 'small', label: 'Search Label' },
};

/* ── Interactive ─────────────────────────────────────── */

export const Interactive: Story = {
  render: () => {
    const [query, setQuery] = useState('');
    return (
      <div className="flex flex-col gap-[var(--spacing-8)] max-w-sm">
        <SearchBox
          type="default"
          placeholder="Search products..."
          value={query}
          onChange={setQuery}
          onClear={() => setQuery('')}
        />
        <p className="text-[length:var(--text-12)] text-[color:var(--color-text-info)]">
          Query: {query || <em>empty</em>}
        </p>
      </div>
    );
  },
};

/* ── All types gallery ───────────────────────────────── */

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-24)]">
      <div className="flex flex-col gap-[var(--spacing-8)]">
        <p className="text-[length:var(--text-12)] text-[color:var(--color-text-info)]">Default</p>
        <SearchBox type="default" />
      </div>
      <div className="flex flex-col gap-[var(--spacing-8)]">
        <p className="text-[length:var(--text-12)] text-[color:var(--color-text-info)]">With Categories</p>
        <SearchBox type="with-categories" />
      </div>
      <div className="flex flex-col gap-[var(--spacing-8)]">
        <p className="text-[length:var(--text-12)] text-[color:var(--color-text-info)]">With Categories + Search Button</p>
        <SearchBox type="with-categories" showSearchButton />
      </div>
      <div className="flex flex-col gap-[var(--spacing-8)]">
        <p className="text-[length:var(--text-12)] text-[color:var(--color-text-info)]">Search Placeholder Only + Search Button</p>
        <SearchBox type="search-placeholder-only" showSearchButton />
      </div>
      <div className="flex flex-col gap-[var(--spacing-8)]">
        <p className="text-[length:var(--text-12)] text-[color:var(--color-text-info)]">Date Range</p>
        <SearchBox type="date-range" label="Search Label" />
      </div>
      <div className="flex flex-col gap-[var(--spacing-8)]">
        <p className="text-[length:var(--text-12)] text-[color:var(--color-text-info)]">Date Range with Search</p>
        <SearchBox type="date-range-with-search" label="Search Label" />
      </div>
      <div className="flex flex-col gap-[var(--spacing-8)]">
        <p className="text-[length:var(--text-12)] text-[color:var(--color-text-info)]">Dropdown</p>
        <SearchBox type="dropdown" label="Search Label" />
      </div>
    </div>
  ),
};
