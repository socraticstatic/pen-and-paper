import { expect, test } from '@playwright/test';

test.describe('admin entry', () => {
  test('redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test('rejects invalid credentials', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByLabel(/email/i).fill('no-such-user@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /log in/i }).click();
    await expect(page.getByText(/invalid/i)).toBeVisible({ timeout: 5_000 });
  });
});
