import { test, expect } from '@playwright/test';
import { loginViaUi, registerViaApi, uniqueEmail } from './helpers';

test.describe('interviews', () => {
  test('scheduling an interview shows it on the interviews page and dashboard', async ({ page, request }) => {
    const email = uniqueEmail('interviews');
    await registerViaApi(request, email);

    // Save a job first — interviews attach to an existing application.
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
    const jobId = firstJob.id;

    await request.post('http://localhost:4000/graphql', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        query: 'mutation A($jobId: ID!) { applyToJob(jobId: $jobId) { id } }',
        variables: { jobId },
      },
    });

    await loginViaUi(page, email);

    await page.goto('/interviews');
    await page.getByRole('button', { name: 'Schedule Interview' }).click();
    await page.getByLabel('Application').click();
    await page.getByRole('option').first().click();
    await page.getByLabel('Round').click();
    await page.getByRole('option', { name: 'Technical Round 1' }).click();
    await page.getByRole('button', { name: 'Schedule' }).click();

    await expect(page.getByText('Technical Round 1')).toBeVisible();
    await expect(page.getByText('Upcoming (1)')).toBeVisible();

    await page.goto('/dashboard');
    await expect(page.getByText('Upcoming Interviews')).toBeVisible();
    await expect(page.getByText('Technical Round 1', { exact: false })).toBeVisible();
  });
});
