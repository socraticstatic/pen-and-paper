import { expect, test } from '@playwright/test';

test.describe('specimen detail page', () => {
  test('renders 404 for non-existent slug', async ({ page }) => {
    await page.goto('/catalogue/this-specimen-does-not-exist');
    await expect(page.getByText(/does not appear in the catalogue/i)).toBeVisible();
  });
});
