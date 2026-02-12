/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: ['../src/js/common/stories/**/*.mdx', '../src/js/common/stories/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-webpack5-compiler-swc",
    "@chromatic-com/storybook",
    "@storybook/addon-docs"
  ],

  framework: {
    name: "@storybook/react-webpack5",
    options: {
      builder: {},
    },
  },

  docs: {},

  typescript: {
    reactDocgen: "react-docgen-typescript"
  }
};
export default config;