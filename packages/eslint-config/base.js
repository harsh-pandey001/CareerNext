import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

/**
 * Shared base ESLint flat config for the CareerNext monorepo.
 * Consumed by every app/package via `@careernext/eslint-config/*`.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': 'warn',
    },
  },
  {
    ignores: ['dist/**', 'build/**', '.next/**', 'node_modules/**', 'coverage/**'],
  },
];
