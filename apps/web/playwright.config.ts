import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  // Specs share one live DB — serial keeps register/save-job flows isolated.
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'list' : 'html',
  // Dev-server compiles on first route visit are slow — don't fail on them.
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // Both servers boot automatically when not already running (locally the
  // dev servers usually are — reuseExistingServer picks them up). The e2e
  // suite runs against the real API + local Postgres, not mocks.
  // Port checks, not URL probes: Apollo's CSRF prevention 400s bare GETs on
  // /graphql, which a URL probe would read as "server not up".
  webServer: [
    {
      command: 'pnpm --filter @careernext/api dev',
      cwd: '../..',
      port: 4000,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'pnpm dev',
      port: 3000,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
