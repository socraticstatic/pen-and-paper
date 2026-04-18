import { expect, test } from '@playwright/test';

test.describe('home placeholder', () => {
  test('renders the scaffold copy', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/scaffolding in place/i)).toBeVisible();
  });

  test('has the correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Pen & Paper');
  });
});
