import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: {
    docs: {
      canvas: {
        sourceState: 'hidden',
      },
    },
  },
};

export default preview;
