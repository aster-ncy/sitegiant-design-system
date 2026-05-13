import type { Preview } from '@storybook/react-vite';
import { AntdThemeProvider } from '../src/components/AntdThemeProvider';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    options: {
      storySort: (a, b) => {
        const bodyCellStoryOrder = [
          'docs',
          'playground',
          'default-body-row',
          'inset-body-row',
          'listing-body-row',
          'subrow-body-row',
          'default-text-matrix',
          'default-number-matrix',
          'inset-text-number-matrix',
          'subrow-text-number-matrix',
        ];
        const bodyCellStoryPrefix = 'tables-table-atoms-body-cell--';
        const aIsBodyCell = a.id.startsWith(bodyCellStoryPrefix);
        const bIsBodyCell = b.id.startsWith(bodyCellStoryPrefix);

        if (!aIsBodyCell || !bIsBodyCell) {
          return 0;
        }

        const aIndex = bodyCellStoryOrder.indexOf(a.id.replace(bodyCellStoryPrefix, ''));
        const bIndex = bodyCellStoryOrder.indexOf(b.id.replace(bodyCellStoryPrefix, ''));

        if (aIndex === -1 && bIndex === -1) {
          return 0;
        }

        if (aIndex === -1) {
          return 1;
        }

        if (bIndex === -1) {
          return -1;
        }

        return aIndex - bIndex;
      },
    },
    controls: {
      disableSaveFromUI: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
    docs: {
      canvas: {
        sourceState: 'hidden',
      },
    },
  },
  decorators: [
    (Story) => (
      <AntdThemeProvider>
        <Story />
      </AntdThemeProvider>
    ),
  ],
};

export default preview;
