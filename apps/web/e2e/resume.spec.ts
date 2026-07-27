import { test, expect } from '@playwright/test';
import { loginViaUi, registerViaApi, uniqueEmail } from './helpers';

test.describe('resume upload', () => {
  test('uploading a PDF creates the active resume version', async ({ page, request }) => {
    const email = uniqueEmail('resume');
    await registerViaApi(request, email);
    await loginViaUi(page, email);

    await page.goto('/resume');
    await expect(page.getByText('Drag & Drop Here')).toBeVisible();

    await page.locator('input[type="file"]').setInputFiles({
      name: 'e2e-resume.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4\nE2E resume content'),
    });

    await expect(page.getByText('Active Resume')).toBeVisible();
    await expect(page.getByText('e2e-resume.pdf').first()).toBeVisible();
    await expect(page.getByText('Version History')).toBeVisible();
  });
});
