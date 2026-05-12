import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": "@storybook/react-vite",
  "tags": {
    "visual-qa": {
      "defaultFilterSelection": "exclude"
    }
  },
  viteFinal: async (config) =>
    mergeConfig(config, {
      build: {
        chunkSizeWarningLimit: 2000,
        rolldownOptions: {
          checks: {
            pluginTimings: false,
          },
        },
      },
    }),
};
export default config;
