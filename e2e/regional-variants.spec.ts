import { test, expect } from "@playwright/test";

/**
 * E2E Tests for Regional Variant Pokemon
 *
 * These tests verify that regional variant Pokemon display the correct form
 * when selected from their regional Pokedex. This is critical because:
 * - Regional variants rely on complex logic in findVarietyForRegion
 * - Sprite selection for variants uses different code paths
 * - These scenarios have historically been prone to bugs
 *
 * Test Coverage:
 * 1. Legends Arceus - Hisui Dex - Hisuian Typhlosion
 * 2. Sun/Moon - Alola Dex - Alolan Raichu
 */

test.describe("Legends Arceus - Hisui Dex - Hisuian Typhlosion", () => {
  test("should display Hisuian Typhlosion variant (not Johto form) when selected from Hisui Dex", async ({
    page,
  }) => {
    // Step 1: Go to home page
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Step 2: Verify the game selection prompt is visible
    await expect(page.getByText(/WHICH GAME ARE YOU PLAYING/i)).toBeVisible();

    // Step 3: Select Legends Arceus version
    const gameSelector = page.getByPlaceholder("Search...");
    await expect(gameSelector).toBeVisible();

    await gameSelector.click();
    await page.waitForTimeout(500);

    // Wait for dropdown list to be visible
    const dropdown = page.locator("ul").first();
    await expect(dropdown).toBeVisible();

    // Select "Legends Arceus" - look for list item containing Legends Arceus text
    const legendsArceusOption = page
      .locator("li")
      .filter({ hasText: "Legends Arceus" })
      .first();
    await expect(legendsArceusOption).toBeVisible();
    await legendsArceusOption.click();

    // Step 4: Should navigate to the pokedex page
    await page.waitForURL("**/pokedex/legends-arceus", { timeout: 10000 });

    // Step 5: Wait for Regional Dex content to load (Hisui)
    // Wait directly for the regional dex header to appear (more reliable than waiting for spinner)
    const regionalDexHeader = page.locator(
      '[data-testid="regional-dex-header"]'
    ).first();
    await expect(regionalDexHeader).toBeVisible({ timeout: 15000 });

    // Now wait for any loading spinners to disappear
    await page.waitForSelector(".animate-spin", {
      state: "detached",
      timeout: 5000,
    }).catch(() => {
      // Ignore timeout if spinner is already gone
    });

    // Step 6: Find and interact with Regional Dex Pokemon selector
    const regionalDexSelector = page
      .locator('[data-testid="regional-dex-selector"]')
      .first();
    await expect(regionalDexSelector).toBeVisible();

    // Find the search input within the regional dex selector
    const regionalDexSearch = regionalDexSelector.getByPlaceholder("Search...");
    await expect(regionalDexSearch).toBeVisible();

    // Step 7: Search for Typhlosion in the Regional Dex (Hisui)
    await regionalDexSearch.click();
    await regionalDexSearch.fill("typhlosion");
    await page.waitForTimeout(500);

    // Step 8: Wait for dropdown to appear and click on Typhlosion
    // Find the dropdown within the regional dex selector to avoid finding other ul elements
    const regionalDropdown = regionalDexSelector.locator("ul");
    await expect(regionalDropdown).toBeVisible();

    const typhlosionOption = regionalDropdown
      .locator("li")
      .filter({ hasText: /typhlosion/i })
      .first();
    await expect(typhlosionOption).toBeVisible();
    await typhlosionOption.click();

    // Step 9: Should navigate to Typhlosion's detail page
    await page.waitForURL("**/pokemon/**");

    // Step 10: Wait for loading spinner to disappear (page fully loaded)
    await page.waitForSelector(".animate-spin", {
      state: "detached",
      timeout: 10000,
    });

    // Step 11: Verify we're on Typhlosion's page
    // The heading might contain "Typhlosion" or the full variant name
    const pokemonHeading = page
      .locator('[data-testid*="Typhlosion"]')
      .or(page.locator('[data-testid*="typhlosion"]'))
      .first();
    await expect(pokemonHeading).toBeVisible();

    // Step 12: CRITICAL - Verify the Hisuian variant sprite is displayed
    // Regional variants include the region in the Pokemon name: "Typhlosion (Hisui)"
    // This proves the correct regional variant was selected, not the default Johto form
    const hisuianSprite = page.locator(
      'img[data-testid="Typhlosion (Hisui)-main-sprite"]'
    );
    await expect(hisuianSprite).toBeVisible({
      timeout: 10000,
    });

    // Additional verification: Make sure we're NOT showing the Johto form
    // The Johto form would just be "Typhlosion-main-sprite" without the region suffix
    const johtoSprite = page.locator(
      'img[data-testid="Typhlosion-main-sprite"]'
    );
    await expect(johtoSprite).not.toBeVisible();
  });
});

test.describe("Sun/Moon - Alola Dex - Alolan Raichu", () => {
  test("should display Alolan Raichu variant (not Kanto form) when selected from Alola Dex", async ({
    page,
  }) => {
    // Step 1: Go to home page
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Step 2: Verify the game selection prompt is visible
    await expect(page.getByText(/WHICH GAME ARE YOU PLAYING/i)).toBeVisible();

    // Step 3: Select Sun/Moon version
    const gameSelector = page.getByPlaceholder("Search...");
    await expect(gameSelector).toBeVisible();

    await gameSelector.click();
    await page.waitForTimeout(500);

    // Wait for dropdown list to be visible
    const dropdown = page.locator("ul").first();
    await expect(dropdown).toBeVisible();

    // Select "Sun Moon" - look for list item containing Sun Moon text
    const sunMoonOption = page
      .locator("li")
      .filter({ hasText: "Sun Moon" })
      .first();
    await expect(sunMoonOption).toBeVisible();
    await sunMoonOption.click();

    // Step 4: Should navigate to the pokedex page
    await page.waitForURL("**/pokedex/sun-moon", { timeout: 10000 });

    // Step 5: Wait for Regional Dex content to load
    // Sun/Moon has multiple regional dexes (Melemele, Akala, Ulaula, Poni, Alola)
    // Wait directly for the regional dex header to appear (more reliable than waiting for spinner)
    const regionalDexHeader = page.locator(
      '[data-testid="regional-dex-header"]'
    ).first();
    await expect(regionalDexHeader).toBeVisible({ timeout: 15000 });

    // Now wait for any loading spinners to disappear
    await page.waitForSelector(".animate-spin", {
      state: "detached",
      timeout: 5000,
    }).catch(() => {
      // Ignore timeout if spinner is already gone
    });

    // Step 6: Find and interact with Regional Dex Pokemon selector
    // Use the first regional dex selector (could be any of the Alola island dexes)
    const regionalDexSelector = page
      .locator('[data-testid="regional-dex-selector"]')
      .first();
    await expect(regionalDexSelector).toBeVisible();

    // Find the search input within the regional dex selector
    const regionalDexSearch = regionalDexSelector.getByPlaceholder("Search...");
    await expect(regionalDexSearch).toBeVisible();

    // Step 7: Search for Raichu in the Regional Dex (Alola)
    await regionalDexSearch.click();
    await regionalDexSearch.fill("raichu");
    await page.waitForTimeout(500);

    // Step 8: Wait for dropdown to appear and click on Raichu
    // Find the dropdown within the regional dex selector to avoid finding other ul elements
    const regionalDropdown = regionalDexSelector.locator("ul");
    await expect(regionalDropdown).toBeVisible();

    const raichuOption = regionalDropdown
      .locator("li")
      .filter({ hasText: /raichu/i })
      .first();
    await expect(raichuOption).toBeVisible();
    await raichuOption.click();

    // Step 9: Should navigate to Raichu's detail page
    await page.waitForURL("**/pokemon/**");

    // Step 10: Wait for loading spinner to disappear (page fully loaded)
    await page.waitForSelector(".animate-spin", {
      state: "detached",
      timeout: 10000,
    });

    // Step 11: Verify we're on Raichu's page
    // The heading might contain "Raichu" or the full variant name
    const pokemonHeading = page
      .locator('[data-testid*="Raichu"]')
      .or(page.locator('[data-testid*="raichu"]'))
      .first();
    await expect(pokemonHeading).toBeVisible();

    // Step 12: CRITICAL - Verify the Alolan variant sprite is displayed
    // Regional variants include the region in the Pokemon name: "Raichu (Alola)"
    // This proves the correct regional variant was selected, not the default Kanto form
    const alolanSprite = page.locator(
      'img[data-testid="Raichu (Alola)-main-sprite"]'
    );
    await expect(alolanSprite).toBeVisible({
      timeout: 10000,
    });

    // Additional verification: Make sure we're NOT showing the Kanto form
    // The Kanto form would just be "Raichu-main-sprite" without the region suffix
    const kantoSprite = page.locator('img[data-testid="Raichu-main-sprite"]');
    await expect(kantoSprite).not.toBeVisible();
  });
});
