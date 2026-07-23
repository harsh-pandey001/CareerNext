import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  // e2e/ holds Playwright specs (run via `test:e2e`), not Jest tests.
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/e2e/'],
  // .next/standalone/ (the Docker deploy build, see infrastructure/docker/Dockerfile.web)
  // bundles its own package.json — without this, Jest's haste map sees two
  // files both named "@careernext/web" and warns about a naming collision.
  modulePathIgnorePatterns: ['<rootDir>/.next/'],
};

export default createJestConfig(config);
