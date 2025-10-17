import { test, expect } from '@playwright/test';

test.describe('Pokemon Search and Navigation', () => {
  test('should search for a Pokemon and navigate to its detail page', async ({ page }) => {
    // Go to home page
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Find and click on the search/autocomplete input
    const searchInput = page.getByPlaceholder('Search...');
    await expect(searchInput).toBeVisible();

    // Type "pikachu" into the search
    await searchInput.fill('pikachu');

    // Wait for autocomplete dropdown to appear
    await page.waitForTimeout(500);

    // Click on the Pikachu option in the dropdown
    // The autocomplete should show "Pikachu" with ID 25
    const pikachuOption = page.getByText(/pikachu/i).first();
    await expect(pikachuOption).toBeVisible();
    await pikachuOption.click();

    // Should navigate to Pokemon detail page
    await page.waitForURL('**/pokemon/**');

    // Verify we're on Pikachu's page
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toContainText(/pikachu/i);

    // Verify Pokemon number is displayed (#025)
    await expect(page.locator('text=#025')).toBeVisible();

    // Verify basic Pokemon info is displayed
    await expect(page.getByText(/electric/i)).toBeVisible(); // Type
  });

  test('should navigate between Pokemon using navigation buttons', async ({ page }) => {
    // Go to Pikachu's page (#25)
    await page.goto('/pokemon/25');

    await page.waitForLoadState('networkidle');

    // Find and click the "Next" or forward navigation button
    const nextButton = page.getByRole('link').filter({ hasText: /next|→|►/i }).or(
      page.locator('a[href="/pokemon/26"]')
    );

    if (await nextButton.count() > 0) {
      await nextButton.first().click();

      // Should navigate to Raichu (#26)
      await page.waitForURL('**/pokemon/26');
      await expect(page.getByRole('heading', { level: 1 })).toContainText(/raichu/i);
    }
  });

  test('should display Pokemon stats and moves', async ({ page }) => {
    // Go to Bulbasaur's page
    await page.goto('/pokemon/1');

    await page.waitForLoadState('networkidle');

    // Verify Pokemon name
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/bulbasaur/i);

    // Verify stats section exists
    await expect(page.getByText(/hp/i)).toBeVisible();
    await expect(page.getByText(/attack/i)).toBeVisible();
    await expect(page.getByText(/defense/i)).toBeVisible();

    // Verify moves section exists
    await expect(page.getByText(/moves|level.*up|machine/i)).toBeVisible();
  });

  test('should filter autocomplete results', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const searchInput = page.getByPlaceholder('Search...');
    await searchInput.fill('char');

    // Wait for dropdown
    await page.waitForTimeout(500);

    // Should show Charmander, Charmeleon, Charizard
    await expect(page.getByText(/charmander/i)).toBeVisible();
  });

  test('should handle direct navigation to Pokemon page', async ({ page }) => {
    // Navigate directly to a Pokemon page
    await page.goto('/pokemon/150'); // Mewtwo

    await page.waitForLoadState('networkidle');

    // Verify page loads correctly
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/mewtwo/i);
    await expect(page.locator('text=#150')).toBeVisible();
  });
});
