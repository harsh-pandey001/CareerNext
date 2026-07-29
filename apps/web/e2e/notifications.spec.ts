import { test, expect } from '@playwright/test';
import { API_URL, E2E_PASSWORD, loginViaUi, registerViaApi, uniqueEmail } from './helpers';

test.describe('notifications', () => {
  test('a real status change is reflected in the bell badge and popover, and mark-all-read clears it', async ({
    page,
    request,
  }) => {
    const email = uniqueEmail('notifications');

    // `register` returns an accessToken directly — one auth call instead of
    // register-then-separately-login, since this test also needs a bearer
    // token for the setup API calls below. The login throttle (10/60s) is
    // shared across the whole suite's concurrent workers, so every avoidable
    // auth call here is one less chance of tripping it for a neighboring test.
    const regRes = await request.post(API_URL, {
      data: {
        query: 'mutation R($input: RegisterInput!) { register(input: $input) { accessToken } }',
        variables: { input: { email, password: E2E_PASSWORD, firstName: 'E2e', lastName: 'Tester' } },
      },
    });
    const { data: regData } = (await regRes.json()) as { data: { register: { accessToken: string } } };
    const token = regData.register.accessToken;

    const jobsRes = await request.post(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
      data: { query: 'query { jobs { items { id } } }' },
    });
    const { data: jobsData } = (await jobsRes.json()) as { data: { jobs: { items: { id: string }[] } } };
    const [firstJob] = jobsData.jobs.items;
    if (!firstJob) throw new Error('Expected at least one seeded job.');

    await request.post(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
      data: { query: 'mutation A($jobId: ID!) { applyToJob(jobId: $jobId) { id } }', variables: { jobId: firstJob.id } },
    });

    const appsRes = await request.post(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
      data: { query: 'query { myApplications { id } }' },
    });
    const { data: appsData } = (await appsRes.json()) as { data: { myApplications: { id: string }[] } };
    const applicationId = appsData.myApplications[0]?.id;
    if (!applicationId) throw new Error('Expected an application to exist after applyToJob.');

    await loginViaUi(page, email);

    const bellButton = page.getByRole('button', { name: 'Notifications' });
    const popover = page.locator('.MuiPopover-paper');

    // Fresh account — nothing to see yet.
    await bellButton.click();
    await expect(popover.getByText("You're all caught up.")).toBeVisible();
    await page.keyboard.press('Escape');

    // A real transition, triggered independently of the open page (mirrors
    // how the reminder cron or another tab would create one) — the bell's
    // list query must refetch on open to pick this up, not just its polled
    // unread count.
    await request.post(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        query:
          'mutation U($applicationId: ID!, $status: ApplicationStatus!) { updateApplicationStatus(applicationId: $applicationId, status: $status) { id status } }',
        variables: { applicationId, status: 'OA_SCHEDULED' },
      },
    });

    await bellButton.click();
    await expect(popover.getByText('Application status updated')).toBeVisible();
    await expect(popover.getByText('moved to Oa Scheduled', { exact: false })).toBeVisible();
    await page.keyboard.press('Escape');

    // MUI's Popover marks background siblings aria-hidden while open (a11y
    // focus-trapping), which makes the bell itself unreachable by role while
    // the popover is open — badge assertions must happen with it closed. The
    // open above already refetched both the list and the unread count.
    await expect(bellButton.locator('.MuiBadge-badge')).toHaveText('1');

    await bellButton.click();
    await popover.getByRole('button', { name: 'Mark all read' }).click();
    await page.keyboard.press('Escape');
    // MUI's Badge keeps its last-shown number in the DOM through the exit
    // transition (never rewrites it to "0") and hides it via this class
    // instead — that's the correct signal for "no unread left", not text.
    await expect(bellButton.locator('.MuiBadge-badge')).toHaveClass(/MuiBadge-invisible/);
  });

  test('a failed action shows a toast (not a page banner) and it auto-dismisses', async ({ page, request }) => {
    const email = uniqueEmail('toast');
    await registerViaApi(request, email);
    await loginViaUi(page, email);

    await page.route('**/graphql', async (route) => {
      const body = route.request().postDataJSON();
      if (typeof body?.query === 'string' && body.query.includes('saveJob')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ errors: [{ message: 'Simulated save failure' }], data: null }),
        });
        return;
      }
      await route.continue();
    });

    await page.goto('/jobs');
    const firstSave = page.locator('main').getByRole('button', { name: 'Save job' }).first();
    await expect(firstSave).toBeVisible();
    await firstSave.click();

    const toast = page.locator('.MuiAlert-filledError');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Simulated save failure');
    // The old per-page error banner must not also appear — one signal, not two.
    await expect(page.locator('.MuiAlert-outlinedError')).toHaveCount(0);
    await expect(toast).toBeHidden({ timeout: 8000 });
  });
});
