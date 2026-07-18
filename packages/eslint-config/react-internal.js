import baseConfig from './base.js';

/**
 * ESLint flat config for internal React component libraries
 * (e.g. packages/shared-ui).
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
];
