import { test, expect } from '@playwright/test';
import { loginViaUi, registerViaApi, uniqueEmail } from './helpers';

test.describe('application status pipeline', () => {
  test('move to → timeline → grouped columns all reflect the new state machine', async ({ page, request }) => {
    const email = uniqueEmail('status');
    await registerViaApi(request, email);

    const loginRes = await request.post('http://localhost:4000/graphql', {
      data: {
        query: 'mutation L($input: LoginInput!) { login(input: $input) { accessToken } }',
        variables: { input: { email, password: 'E2ePassword123!' } },
      },
    });
    const { data: loginData } = (await loginRes.json()) as { data: { login: { accessToken: string } } };
    const token = loginData.login.accessToken;

    const jobsRes = await request.post('http://localhost:4000/graphql', {
      headers: { Authorization: `Bearer ${token}` },
      data: { query: 'query { jobs { items { id } } }' },
    });
    const { data: jobsData } = (await jobsRes.json()) as { data: { jobs: { items: { id: string }[] } } };
    const [firstJob] = jobsData.jobs.items;
    if (!firstJob) throw new Error('Expected at least one seeded job.');

    await request.post('http://localhost:4000/graphql', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        query: 'mutation A($jobId: ID!) { applyToJob(jobId: $jobId) { id } }',
        variables: { jobId: firstJob.id },
      },
    });

    await loginViaUi(page, email);
    await page.goto('/applications');

    // Starts in Applied — pipeline indicator shows the current label.
    await expect(page.getByText('Applied', { exact: true }).first()).toBeVisible();

    // Move forward, skipping straight to HR Round (self-reported: skips are allowed).
    await page.getByRole('button', { name: 'Application actions' }).click();
    await page.getByRole('menuitem', { name: 'HR Round' }).click();
    await expect(page.getByText('HR Round', { exact: true }).first()).toBeVisible();

    // "Move to" no longer offers anything before HR Round (Applied should be gone).
    await page.getByRole('button', { name: 'Application actions' }).click();
    await expect(page.getByRole('menuitem', { name: 'Applied' })).toHaveCount(0);
    await expect(page.getByRole('menuitem', { name: 'Offer Received' })).toBeVisible();
    await page.keyboard.press('Escape');

    // Timeline dialog shows the real recorded trail.
    await page.getByRole('button', { name: 'Application actions' }).click();
    await page.getByRole('menuitem', { name: 'View Timeline' }).click();
    await expect(page.getByRole('heading', { name: 'Status Timeline' })).toBeVisible();
    // .first(): "Applied"/"HR Round" also render in the card's own pipeline
    // caption behind the open dialog — either match confirms the text is
    // present, which is all these assertions are checking for.
    await expect(page.getByText('Applied', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('HR Round', { exact: true }).first()).toBeVisible();
    // Two "Close" buttons share the same accessible name (the DialogTitle
    // icon button and the DialogActions text button) — the text one is last
    // in DOM order.
    await page.getByRole('button', { name: 'Close' }).last().click();

    // Advance to a terminal state and confirm the board groups it under Accepted.
    await page.getByRole('button', { name: 'Application actions' }).click();
    await page.getByRole('menuitem', { name: 'Offer Received' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Application actions' }).click();
    await page.getByRole('menuitem', { name: 'Accepted' }).click();

    await expect(page.getByText('Accepted', { exact: true }).first()).toBeVisible();
    // Once terminal, the "Move to" section must be gone entirely.
    await page.getByRole('button', { name: 'Application actions' }).click();
    await expect(page.getByText('Move to')).toHaveCount(0);
  });
});
