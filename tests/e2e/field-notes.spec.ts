import { expect, test } from '@playwright/test';

test.describe('field notes', () => {
  test('renders the field notes index', async ({ page }) => {
    await page.goto('/field-notes');
    await expect(page.getByRole('heading', { name: 'Field Notes' })).toBeVisible();
  });

  test('renders 404 for non-existent note', async ({ page }) => {
    await page.goto('/field-notes/this-note-does-not-exist');
    await expect(page.getByText(/does not appear in the catalogue/i)).toBeVisible();
  });
});
