import { test, expect } from '@playwright/test';
import { loginViaUi, registerViaApi, uniqueEmail } from './helpers';

test.describe('jobs → applications flow', () => {
  test('saving a job puts it on the applications board', async ({ page, request }) => {
    const email = uniqueEmail('jobs');
    await registerViaApi(request, email);
    await loginViaUi(page, email);

    await page.goto('/jobs');
    const firstCard = page.locator('main').getByRole('button', { name: 'Save job' }).first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    // The save is confirmed once the toggle flips to "Unsave job".
    await expect(page.getByRole('button', { name: 'Unsave job' }).first()).toBeVisible();

    await page.goto('/applications');
    // Fresh account: exactly one card on the board, in the Saved column.
    await expect(page.getByRole('button', { name: 'Application actions' })).toHaveCount(1);
    await expect(page.getByText('Saved', { exact: true })).toBeVisible();
  });
});
