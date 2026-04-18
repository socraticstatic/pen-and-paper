import { expect, test } from '@playwright/test';

test.describe('home page', () => {
  test('renders the site nav', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('navigation', { name: 'Site navigation' })).toBeVisible();
    await expect(page.getByText('The Catalogue')).toBeVisible();
    await expect(page.getByText('The Register')).toBeVisible();
    await expect(page.getByText('Field Notes')).toBeVisible();
  });

  test('has skip-to-content link', async ({ page }) => {
    await page.goto('/');
    const skip = page.getByRole('link', { name: /skip to content/i });
    await expect(skip).toBeAttached();
  });

  test('renders stage index with four stages', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('region', { name: 'Stages' })).toBeVisible();
    const stageCards = page.locator('.stage-card');
    await expect(stageCards).toHaveCount(4);
  });

  test('has the correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Pen & Paper');
  });
});
