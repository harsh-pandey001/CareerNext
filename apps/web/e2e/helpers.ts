import type { APIRequestContext, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export const API_URL = 'http://localhost:4000/graphql';

/** One unique account per test run — the suite runs against the real dev DB. */
export function uniqueEmail(prefix: string): string {
  return `e2e.${prefix}.${Date.now()}@example.com`;
}

export const E2E_PASSWORD = 'E2ePassword123!';

/** Registers straight through the API — UI signup has its own dedicated spec. */
export async function registerViaApi(request: APIRequestContext, email: string): Promise<void> {
  const response = await request.post(API_URL, {
    data: {
      query: `mutation R($input: RegisterInput!) { register(input: $input) { user { id } } }`,
      variables: {
        input: { email, password: E2E_PASSWORD, firstName: 'E2e', lastName: 'Tester' },
      },
    },
  });
  const body = (await response.json()) as { data?: unknown; errors?: { message: string }[] };
  if (!body.data) {
    throw new Error(`registerViaApi failed: ${body.errors?.[0]?.message ?? 'unknown error'}`);
  }
}

export async function loginViaUi(page: Page, email: string): Promise<void> {
  await page.goto('/login');
  await page.getByLabel('Email Address').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(E2E_PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  // Generous timeout: on a cold dev server the first /dashboard visit
  // compiles the whole route (charts included) before the URL settles.
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });
}
