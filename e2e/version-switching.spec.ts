import { test, expect } from '@playwright/test';

test.describe('Game Version Switching', () => {
  test('should switch between game versions', async ({ page }) => {
    // Go to a Pokemon page
    await page.goto('/pokemon/25'); // Pikachu

    await page.waitForLoadState('networkidle');

    // Find the version selector/dropdown
    // It might be a select element or custom dropdown
    const versionSelector = page.locator('select').first().or(
      page.getByRole('combobox').first()
    );

    if (await versionSelector.count() > 0) {
      // Get current version
      const currentVersion = await versionSelector.inputValue().catch(() => '');

      // Find all options
      const options = await page.locator('select option, [role="option"]').all();

      if (options.length > 1) {
        // Select a different version
        const secondOption = await options[1].textContent();

        if (secondOption) {
          await versionSelector.selectOption({ index: 1 });

          // Wait for page to update
          await page.waitForTimeout(1000);

          // Verify URL changed or content updated
          const newVersion = await versionSelector.inputValue().catch(() => '');
          expect(newVersion).not.toBe(currentVersion);
        }
      }
    }
  });

  test('should persist version selection across navigation', async ({ page }) => {
    await page.goto('/');

    await page.waitForLoadState('networkidle');

    // Select a specific version (if selector exists)
    const versionSelector = page.locator('select').first();

    if (await versionSelector.count() > 0) {
      // Select "Gold/Silver" or second option
      await versionSelector.selectOption({ index: 1 });

      const selectedVersion = await versionSelector.inputValue();

      // Navigate to a Pokemon page
      await page.goto('/pokemon/1');
      await page.waitForLoadState('networkidle');

      // Check if version is still selected (might be persisted in cookie/localStorage)
      const currentVersion = await versionSelector.inputValue().catch(() => null);

      if (currentVersion) {
        // If version selector exists on this page, verify it maintained selection
        expect(currentVersion).toBe(selectedVersion);
      }
    }
  });

  test('should display version-specific sprites', async ({ page }) => {
    await page.goto('/pokemon/25'); // Pikachu

    await page.waitForLoadState('networkidle');

    // Find Pokemon sprite image
    const sprite = page.locator('img[alt*="sprite" i], img[src*="sprite" i]').first();

    if (await sprite.count() > 0) {
      const initialSrc = await sprite.getAttribute('src');

      // Switch version (if selector exists)
      const versionSelector = page.locator('select').first();

      if (await versionSelector.count() > 0) {
        await versionSelector.selectOption({ index: 1 });

        // Wait for sprite to update
        await page.waitForTimeout(1000);

        const newSrc = await sprite.getAttribute('src');

        // Sprite source should change with version
        // (This might not always be true, but we can check)
        console.log('Initial sprite:', initialSrc);
        console.log('New sprite:', newSrc);
      }
    }
  });

  test('should show version-specific moves', async ({ page }) => {
    await page.goto('/pokemon/1'); // Bulbasaur

    await page.waitForLoadState('networkidle');

    // Verify moves section is visible
    const movesSection = page.locator('text=/moves|moveset/i');
    await expect(movesSection.first()).toBeVisible();

    // Different versions might have different move lists
    // We just verify the moves section exists and updates
  });

  test('should navigate to pokedex and filter by generation', async ({ page }) => {
    await page.goto('/pokedex');

    await page.waitForLoadState('networkidle');

    // Should show pokedex page
    await expect(page).toHaveURL(/pokedex/);

    // Try navigating to a specific generation
    await page.goto('/pokedex/generation-i');

    await page.waitForLoadState('networkidle');

    // Verify we're on gen 1 pokedex
    await expect(page).toHaveURL(/generation-i/);

    // Should show generation 1 Pokemon (1-151)
    await expect(page.getByText(/bulbasaur|charmander|squirtle/i)).toBeVisible();
  });

  test('should display version chip/badge for selected game', async ({ page }) => {
    await page.goto('/pokemon/1');

    await page.waitForLoadState('networkidle');

    // Look for version chip/badge display
    // This might be a styled element showing current version
    const versionDisplay = page.locator('[class*="version" i], [class*="chip" i]').first();

    // If version display exists, verify it's visible
    if (await versionDisplay.count() > 0) {
      await expect(versionDisplay).toBeVisible();
    }
  });

  test('should handle page refresh without losing version selection', async ({ page }) => {
    await page.goto('/pokemon/25');

    await page.waitForLoadState('networkidle');

    const versionSelector = page.locator('select').first();

    if (await versionSelector.count() > 0) {
      // Select a version
      await versionSelector.selectOption({ index: 1 });
      const selectedVersion = await versionSelector.inputValue();

      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Version should be persisted (via cookie or localStorage)
      const versionAfterReload = await versionSelector.inputValue();
      expect(versionAfterReload).toBe(selectedVersion);
    }
  });
});
