import { test, expect } from "@playwright/test";

/**
 * E2E Tests for Pokemon Search and Navigation Flow
 *
 * User Flow:
 * 1. Visit home page (/) - see "WHICH GAME ARE YOU PLAYING?_"
 * 2. Select a game version (e.g., "Red Blue")
 * 3. Redirected to /pokedex/{version} (e.g., /pokedex/red-blue)
 * 4. See National Dex and Regional Dex(es) with Pokemon selectors
 * 5. Search and select a Pokemon from either dex
 * 6. Navigate to Pokemon detail page
 *
 * To add tests for other version groups:
 * - Copy one of the tests below
 * - Update the version group name (e.g., "Gold Silver" for gold-silver)
 * - Update the regional dex name (e.g., "Johto" for gold-silver)
 * - Update the Pokemon to search for
 * - Update the expected URL path
 */

test.describe("Yellow Version - National Dex - Pikachu", () => {
  test("should complete full user flow: select game, search Pokemon from National Dex, and view details", async ({
    page,
  }) => {
    // Step 1: Go to home page
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Step 2: Verify the game selection prompt is visible
    await expect(page.getByText(/WHICH GAME ARE YOU PLAYING/i)).toBeVisible();

    // Step 3: Select Yellow version
    const gameSelector = page.getByPlaceholder("Search...");
    await expect(gameSelector).toBeVisible();

    // Click to open the dropdown
    await gameSelector.click();
    await page.waitForTimeout(500);

    // Wait for dropdown list to be visible
    const dropdown = page.locator("ul").first();
    await expect(dropdown).toBeVisible();

    // Select "Yellow" - look for list item containing Yellow text
    const yellowOption = page
      .locator("li")
      .filter({ hasText: "Yellow" })
      .first();
    await expect(yellowOption).toBeVisible();
    await yellowOption.click();

    // Step 4: Should navigate to the pokedex page
    await page.waitForURL("**/pokedex/yellow", { timeout: 10000 });

    // Step 5: Verify we're on the pokedex page with National Dex
    await expect(page.getByText(/National Dex/i)).toBeVisible();

    // Step 6: Find and interact with National Dex Pokemon selector
    // Find all search inputs and use the last one (National Dex appears after Regional Dex)
    const searchInputs = page.getByPlaceholder("Search...");
    const nationalDexSearch = searchInputs.last();
    await expect(nationalDexSearch).toBeVisible();

    // Step 7: Search for Pikachu in the National Dex
    await nationalDexSearch.click();
    await nationalDexSearch.fill("pikachu");
    await page.waitForTimeout(500);

    // Step 8: Wait for dropdown to appear and click on Pikachu
    const dropdownList = page.locator("ul").last(); // National Dex dropdown is the last one
    await expect(dropdownList).toBeVisible();

    const pikachuOption = dropdownList
      .locator("li")
      .filter({ hasText: /pikachu/i })
      .first();
    await expect(pikachuOption).toBeVisible();
    await pikachuOption.click();

    // Step 9: Should navigate to Pikachu's detail page
    await page.waitForURL("**/pokemon/**");

    // Step 10: Wait for loading spinner to disappear (page fully loaded)
    await page.waitForSelector(".animate-spin", {
      state: "detached",
      timeout: 10000,
    });

    // Step 11: Verify we're on Pikachu's page
    // Look for the Pokemon name in the card (it's in a div with class text-2xl, not always an h1)
    const pokemonNameElement = page
      .locator('div[data-testid="Pikachu-heading"]')
      .first();
    await expect(pokemonNameElement).toContainText(/pikachu/i);

    // Verify the Pokemon sprite has loaded
    const spriteImage = page.locator('img[data-testid="Pikachu-main-sprite"]');
    await expect(spriteImage).toBeVisible();
  });
});

test.describe("Gold/Silver Version - Johto Dex - Chikorita", () => {
  test("should search Pokemon from Regional Dex and view details", async ({
    page,
  }) => {
    // Step 1: Go to home page
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Step 2: Select Gold/Silver version
    const gameSelector = page.getByPlaceholder("Search...");
    await expect(gameSelector).toBeVisible();

    await gameSelector.click();
    await page.waitForTimeout(500);

    // Wait for dropdown list to be visible
    const dropdown = page.locator("ul").first();
    await expect(dropdown).toBeVisible();

    // Select "Gold Silver" - look for list item containing Gold Silver text
    const goldSilverOption = page
      .locator("li")
      .filter({ hasText: "Gold Silver" })
      .first();
    await expect(goldSilverOption).toBeVisible();
    await goldSilverOption.click();

    // Step 3: Should navigate to the pokedex page
    await page.waitForURL("**/pokedex/gold-silver", { timeout: 10000 });

    // Step 4: Verify we're on the pokedex page with Regional Dex (Johto)
    await expect(page.getByText(/Johto.*Dex/i)).toBeVisible();

    // Step 5: Find and interact with Regional Dex Pokemon selector using heading
    const johtoHeading = page.getByRole("heading", { name: /Johto.*Dex/i });
    await expect(johtoHeading).toBeVisible();

    // Find the search input within the section that contains this heading
    const regionalDexSection = page
      .locator("section")
      .filter({ has: johtoHeading });
    const regionalDexSearch = regionalDexSection.getByPlaceholder("Search...");
    await expect(regionalDexSearch).toBeVisible();

    // Step 6: Search for Chikorita in the Regional Dex (Gen 2 starter)
    await regionalDexSearch.click();
    await regionalDexSearch.fill("chikorita");
    await page.waitForTimeout(500);

    // Step 7: Wait for dropdown to appear and click on Chikorita
    const regionalDropdown = page.locator("ul").first(); // Regional Dex dropdown appears first
    await expect(regionalDropdown).toBeVisible();

    const chikoritaOption = regionalDropdown
      .locator("li")
      .filter({ hasText: /chikorita/i })
      .first();
    await expect(chikoritaOption).toBeVisible();
    await chikoritaOption.click();

    // Step 8: Should navigate to Chikorita's detail page
    await page.waitForURL("**/pokemon/**");

    // Step 9: Wait for loading spinner to disappear (page fully loaded)
    await page.waitForSelector(".animate-spin", {
      state: "detached",
      timeout: 10000,
    });

    // Step 10: Verify we're on Chikorita's page
    // Look for the Pokemon name in the card (it's in a div with class text-2xl, not always an h1)
    const pokemonNameElement = page.locator(
      'div[data-testid="Chikorita-heading"]'
    );
    await expect(pokemonNameElement).toContainText(/chikorita/i);

    // Verify the Pokemon sprite has loaded
    const spriteImage = page.locator(
      'img[data-testid="Chikorita-main-sprite"]'
    );
    await expect(spriteImage).toBeVisible();
  });
});
