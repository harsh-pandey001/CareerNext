import { test, expect } from '@playwright/test';
import { loginViaUi, registerViaApi, uniqueEmail } from './helpers';

test.describe('authentication', () => {
  test('guarded routes bounce anonymous visitors to login with redirectTo', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login\?redirectTo=%2Fdashboard/);
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('login lands on the dashboard and logout locks the app again', async ({ page, request }) => {
    const email = uniqueEmail('auth');
    await registerViaApi(request, email);

    await loginViaUi(page, email);
    await expect(page.getByText(/Welcome back, E2e/)).toBeVisible();

    await page.getByRole('button', { name: 'Account menu' }).click();
    await page.getByRole('menuitem', { name: 'Log out' }).click();
    await expect(page).toHaveURL(/\/login/);

    // The refresh cookie must actually be gone — /dashboard bounces again.
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('wrong password shows the uniform credentials error', async ({ page, request }) => {
    const email = uniqueEmail('badpw');
    await registerViaApi(request, email);

    await page.goto('/login');
    await page.getByLabel('Email Address').fill(email);
    await page.getByLabel('Password', { exact: true }).fill('WrongPassword1!');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Invalid email or password.')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });
});
