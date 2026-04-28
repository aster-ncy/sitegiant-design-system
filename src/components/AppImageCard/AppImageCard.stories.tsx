import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppImageCard } from './AppImageCard';
import { AppTagGroup } from '../AppTagGroup';

const meta = {
  title: 'Surfaces/AppImageCard',
  component: AppImageCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    imageSrc: 'https://placehold.co/280x90',
    caption:
      'Encourage customers to shop more by create Store Vouchers for storewide, or Product Vouchers for specific products.',
  },
} satisfies Meta<typeof AppImageCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Shared placeholder values for every story */
const placeholderImage = 'https://placehold.co/280x90';
const sampleCaption =
  'Encourage customers to shop more by create Store Vouchers for storewide, or Product Vouchers for specific products.';

/* ── Type × Tag Count matrix (Figma: 2 × 5 = 10 variants) ─ */

export const DefaultTagNone: Story = {
  name: 'Default · No Tags',
  args: {
    imageSrc: placeholderImage,
    caption: sampleCaption,
    type: 'default',
  },
};

export const SubscribedTagNone: Story = {
  name: 'Subscribed · No Tags',
  args: {
    imageSrc: placeholderImage,
    caption: sampleCaption,
    type: 'subscribed',
  },
};

export const DefaultTag1: Story = {
  name: 'Default · 1 Tag',
  args: {
    imageSrc: placeholderImage,
    caption: sampleCaption,
    type: 'default',
    tags: [{ type: 'beta' }],
  },
};

export const SubscribedTag1: Story = {
  name: 'Subscribed · 1 Tag',
  args: {
    imageSrc: placeholderImage,
    caption: sampleCaption,
    type: 'subscribed',
    tags: [{ type: 'beta' }],
  },
};

export const DefaultTag2: Story = {
  name: 'Default · 2 Tags',
  args: {
    imageSrc: placeholderImage,
    caption: sampleCaption,
    type: 'default',
    tags: [{ type: 'new' }, { type: 'beta' }],
  },
};

export const SubscribedTag2: Story = {
  name: 'Subscribed · 2 Tags',
  args: {
    imageSrc: placeholderImage,
    caption: sampleCaption,
    type: 'subscribed',
    tags: [{ type: 'new' }, { type: 'beta' }],
  },
};

export const DefaultTag3: Story = {
  name: 'Default · 3 Tags',
  args: {
    imageSrc: placeholderImage,
    caption: sampleCaption,
    type: 'default',
    tags: [{ type: 'hot' }, { type: 'new' }, { type: 'beta' }],
  },
};

export const SubscribedTag3: Story = {
  name: 'Subscribed · 3 Tags',
  args: {
    imageSrc: placeholderImage,
    caption: sampleCaption,
    type: 'subscribed',
    tags: [{ type: 'hot' }, { type: 'new' }, { type: 'beta' }],
  },
};

export const DefaultTag4: Story = {
  name: 'Default · 4 Tags',
  args: {
    imageSrc: placeholderImage,
    caption: sampleCaption,
    type: 'default',
    tags: [
      { type: 'free-trial' },
      { type: 'hot' },
      { type: 'new' },
      { type: 'beta' },
    ],
  },
};

export const SubscribedTag4: Story = {
  name: 'Subscribed · 4 Tags',
  args: {
    imageSrc: placeholderImage,
    caption: sampleCaption,
    type: 'subscribed',
    tags: [
      { type: 'free-trial' },
      { type: 'hot' },
      { type: 'new' },
      { type: 'beta' },
    ],
  },
};

/* ── Edge cases ─────────────────────────────────────── */

export const ShortCaption: Story = {
  name: 'Short Caption (still reserves 3 lines)',
  args: {
    imageSrc: placeholderImage,
    caption: 'Quick note.',
    type: 'default',
  },
};

export const LongCaption: Story = {
  name: 'Long Caption (truncates at 3 lines)',
  args: {
    imageSrc: placeholderImage,
    caption:
      'This caption is intentionally long to verify that the three-line clamp truncates properly without pushing the action row down or distorting the card height across the grid. The rest of this text should be cut off.',
    type: 'default',
    tags: [{ type: 'new' }],
  },
};

export const CustomCtaLabel: Story = {
  name: 'Custom CTA label',
  args: {
    imageSrc: placeholderImage,
    caption: sampleCaption,
    type: 'default',
    ctaLabel: 'Learn more',
  },
};

export const CustomTagGroup: Story = {
  name: 'Custom tagGroup slot (advanced)',
  parameters: {
    docs: {
      description: {
        story:
          'The `tagGroup` prop accepts any React node, so consumers can compose non-standard tag layouts. Here we pass an `<AppTagGroup>` manually — equivalent to the `tags` array API, but demonstrates the escape hatch.',
      },
    },
  },
  args: {
    imageSrc: placeholderImage,
    caption: sampleCaption,
    type: 'default',
    tagGroup: (
      <AppTagGroup
        tags={[
          { type: 'premium' },
          { type: 'hot' },
        ]}
      />
    ),
  },
};

/* ── Full matrix — visual smoke test ─────────────────── */

export const AllVariants: Story = {
  name: 'All Variants (matrix)',
  args: {},
  render: () => (
    <div className="grid grid-cols-2 gap-[var(--spacing-20)]">
      <AppImageCard imageSrc={placeholderImage} caption={sampleCaption} type="default" />
      <AppImageCard imageSrc={placeholderImage} caption={sampleCaption} type="subscribed" />

      <AppImageCard imageSrc={placeholderImage} caption={sampleCaption} type="default" tags={[{ type: 'beta' }]} />
      <AppImageCard imageSrc={placeholderImage} caption={sampleCaption} type="subscribed" tags={[{ type: 'beta' }]} />

      <AppImageCard imageSrc={placeholderImage} caption={sampleCaption} type="default" tags={[{ type: 'new' }, { type: 'beta' }]} />
      <AppImageCard imageSrc={placeholderImage} caption={sampleCaption} type="subscribed" tags={[{ type: 'new' }, { type: 'beta' }]} />

      <AppImageCard imageSrc={placeholderImage} caption={sampleCaption} type="default" tags={[{ type: 'hot' }, { type: 'new' }, { type: 'beta' }]} />
      <AppImageCard imageSrc={placeholderImage} caption={sampleCaption} type="subscribed" tags={[{ type: 'hot' }, { type: 'new' }, { type: 'beta' }]} />

      <AppImageCard imageSrc={placeholderImage} caption={sampleCaption} type="default" tags={[{ type: 'free-trial' }, { type: 'hot' }, { type: 'new' }, { type: 'beta' }]} />
      <AppImageCard imageSrc={placeholderImage} caption={sampleCaption} type="subscribed" tags={[{ type: 'free-trial' }, { type: 'hot' }, { type: 'new' }, { type: 'beta' }]} />
    </div>
  ),
};
