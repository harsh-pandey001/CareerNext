import { test, expect } from '@playwright/test';

test('home page renders the CareerNext tagline', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Your Next Career Move Starts Here.')).toBeVisible();
});
