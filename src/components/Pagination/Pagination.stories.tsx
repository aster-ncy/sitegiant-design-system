import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Pagination } from './Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['default', 'compact'] },
    siblingCount: { control: 'number' },
    showStatus: { control: 'boolean' },
    showSizeChanger: { control: 'boolean' },
  },
  args: {
    currentPage: 6,
    totalPages: 50,
    totalItems: 2500,
    pageSize: 50,
    size: 'default',
    siblingCount: 2,
    showStatus: true,
    showSizeChanger: true,
    onPageChange: fn(),
    onPageSizeChange: fn(),
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Large: Story = {
  args: {
    currentPage: 6,
    totalPages: 50,
    totalItems: 2500,
    pageSize: 50,
    siblingCount: 2,
  },
};

export const Medium: Story = {
  args: {
    currentPage: 6,
    totalPages: 10,
    totalItems: 1000,
    pageSize: 10,
    siblingCount: 1,
  },
};

export const Small: Story = {
  args: {
    currentPage: 2,
    totalPages: 10,
    totalItems: 1000,
    pageSize: 10,
    siblingCount: 0,
  },
};

export const ModalCompact: Story = {
  args: {
    currentPage: 6,
    totalPages: 50,
    totalItems: 1000,
    pageSize: 10,
    siblingCount: 1,
    size: 'compact',
  },
};

export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 50,
    totalItems: 2500,
    pageSize: 50,
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 50,
    totalPages: 50,
    totalItems: 2500,
    pageSize: 50,
  },
};

export const WithoutSizeChanger: Story = {
  args: {
    showSizeChanger: false,
  },
};

export const WithoutStatus: Story = {
  args: {
    showStatus: false,
  },
};

export const Interactive: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const total = 2500;
    const totalPages = Math.ceil(total / pageSize);
    return (
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        pageSize={pageSize}
        siblingCount={2}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
      />
    );
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-24)]">
      <div>
        <div className="mb-[var(--spacing-8)] text-[length:var(--text-12)] text-[color:var(--color-text-info)]">Large (siblingCount=2)</div>
        <Pagination currentPage={6} totalPages={50} totalItems={2500} pageSize={50} siblingCount={2} />
      </div>
      <div>
        <div className="mb-[var(--spacing-8)] text-[length:var(--text-12)] text-[color:var(--color-text-info)]">Medium (siblingCount=1)</div>
        <Pagination currentPage={6} totalPages={10} totalItems={1000} pageSize={10} siblingCount={1} />
      </div>
      <div>
        <div className="mb-[var(--spacing-8)] text-[length:var(--text-12)] text-[color:var(--color-text-info)]">Small (siblingCount=0)</div>
        <Pagination currentPage={2} totalPages={10} totalItems={1000} pageSize={10} siblingCount={0} />
      </div>
      <div>
        <div className="mb-[var(--spacing-8)] text-[length:var(--text-12)] text-[color:var(--color-text-info)]">Modal (compact)</div>
        <Pagination currentPage={6} totalPages={50} totalItems={1000} pageSize={10} siblingCount={1} size="compact" />
      </div>
    </div>
  ),
};
