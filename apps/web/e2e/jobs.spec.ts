import { test, expect } from '@playwright/test';
import { loginViaUi, registerViaApi, uniqueEmail } from './helpers';

test.describe('jobs → applications flow', () => {
  test('adding a custom job puts it on the applications board as Applied', async ({ page, request }) => {
    const email = uniqueEmail('jobs');
    await registerViaApi(request, email);
    await loginViaUi(page, email);

    await page.goto('/jobs');

    // The curated catalog is Coming Soon — Custom Jobs is the only active
    // way to get something from Jobs onto the Applications board.
    await page.getByRole('heading', { name: 'Curated Job Board' }).waitFor({ state: 'visible' });

    await page.getByRole('button', { name: 'Add Custom Job' }).click();
    await page.getByText('Job Details').waitFor({ state: 'visible' });
    await page.getByLabel('Company').fill('Acme Testing Co');
    await page.getByLabel('Job Title').fill('QA Automation Engineer');
    await page.getByRole('button', { name: 'Next' }).click();

    await page.getByText('Application Materials').waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Add & Mark Applied' }).click();

    // Confirmed added once it shows up in "Your Added Jobs" as Applied.
    await expect(page.getByText('QA Automation Engineer')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Applied' }).first()).toBeVisible();

    await page.goto('/applications');
    await expect(page.getByText('QA Automation Engineer')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Applied' })).toBeVisible();
  });
});
