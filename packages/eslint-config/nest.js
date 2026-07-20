import baseConfig from './base.js';

/**
 * ESLint flat config for the NestJS API application.
 * Decorator-heavy code relaxes a few strictness rules.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  ...baseConfig,
  {
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // NestJS DI resolves constructor params via emitted `design:paramtypes`
      // reflection metadata, which needs the real class reference at runtime.
      // This rule can't see that and its --fix breaks DI by erasing the import.
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
];
