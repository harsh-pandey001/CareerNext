import baseConfig from './base.js';

/**
 * ESLint flat config for the Next.js web application.
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
    rules: {
      // Next.js specific rules are layered in via the app-level config
      // (eslint-config-next) which composes on top of this shared base.
    },
  },
];
