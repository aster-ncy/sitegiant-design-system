import type { Meta, StoryObj } from '@storybook/react-vite';
import { SortBlockButton } from './SortBlockButton';
import { TextLink } from '../TextLink';
import { DashedButton } from '../DashedButton';
import { Icon } from '../Icon';

const meta = {
  title: 'Information/SortBlock/Button',
  component: SortBlockButton,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof SortBlockButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextLinkKind: Story = {
  render: () => (
    <SortBlockButton kind="textlink">
      <TextLink label="Button" />
    </SortBlockButton>
  ),
} as unknown as Story;

export const DashedKind: Story = {
  render: () => (
    <SortBlockButton kind="dashed">
      <DashedButton>
        <Icon name="plus" size={17} />
        Button
      </DashedButton>
    </SortBlockButton>
  ),
} as unknown as Story;
