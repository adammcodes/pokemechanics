# E2E Test Documentation

## Overview

This directory contains end-to-end (E2E) tests using Playwright to verify critical user flows in the Pokémechanics application.

## Test Files

### `search-pokemon.spec.ts`

Tests the complete Pokemon search and navigation flow:

1. **Home Page** → User sees "WHICH GAME ARE YOU PLAYING?_"
2. **Game Selection** → User selects a version (e.g., "Red Blue")
3. **Pokedex Page** → User is redirected to `/pokedex/{version}`
4. **Pokemon Search** → User searches in National Dex or Regional Dex
5. **Pokemon Detail** → User navigates to Pokemon detail page

**Current Coverage:**
- ✅ Red/Blue version with National Dex selector
- ✅ Red/Blue version with Regional Dex (Kanto) selector
- ✅ Navigation between Pokemon pages

### `version-switching.spec.ts`

Tests game version switching and persistence across the application.

## Running Tests

### Run all E2E tests
```bash
npm run test:e2e
```

### Run tests in UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run specific test file
```bash
npx playwright test e2e/search-pokemon.spec.ts
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

### Debug a specific test
```bash
npx playwright test --debug e2e/search-pokemon.spec.ts
```

## Adding Tests for New Version Groups

To add tests for a different version group (e.g., Gold/Silver, Sun/Moon):

1. Copy an existing test from `search-pokemon.spec.ts`
2. Update the version group name:
   - "Red Blue" → "Gold Silver"
   - "red-blue" → "gold-silver"
3. Update the regional dex name:
   - "Kanto" → "Johto" (for Gold/Silver)
   - Multiple regions for Sun/Moon (Alola, Melemele, Akala, etc.)
4. Update Pokemon examples if needed
5. Update URL expectations

### Example: Gold/Silver Test Template

```typescript
test.describe('Pokemon Search and Navigation - Gold/Silver Version', () => {
  test('should search Pokemon from Regional Dex', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Select Gold/Silver
    const gameSelector = page.getByPlaceholder('Search...');
    await gameSelector.click();
    const goldSilverOption = page.getByText(/Gold Silver/i).first();
    await goldSilverOption.click();

    await page.waitForURL('**/pokedex/gold-silver');

    // Verify Johto regional dex
    await expect(page.getByText(/Johto.*Dex/i)).toBeVisible();

    // Search for Chikorita
    const regionalDexSection = page.locator('section').filter({ hasText: /Johto.*Dex/i });
    const regionalDexSearch = regionalDexSection.getByPlaceholder('Search...');
    await regionalDexSearch.fill('chikorita');
    await page.waitForTimeout(500);

    const chikoritaOption = regionalDexSection.getByText(/chikorita/i).first();
    await chikoritaOption.click();

    await page.waitForURL('**/pokemon/**');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/chikorita/i);
  });
});
```

## Regional Dex Names by Generation

| Version Group | Regional Dex(es) |
|--------------|------------------|
| red-blue | Kanto |
| yellow | Kanto |
| gold-silver | Johto |
| crystal | Johto |
| ruby-sapphire | Hoenn |
| emerald | Hoenn |
| firered-leafgreen | Kanto |
| diamond-pearl | Sinnoh |
| platinum | Sinnoh |
| heartgold-soulsilver | Johto |
| black-white | Unova |
| black-2-white-2 | Unova |
| x-y | Kalos (Central, Coastal, Mountain) |
| omega-ruby-alpha-sapphire | Hoenn |
| sun-moon | Alola (Melemele, Akala, Ulaula, Poni, Alola) |
| ultra-sun-ultra-moon | Alola (Multiple) |
| sword-shield | Galar |
| scarlet-violet | Paldea |

## CI/CD Integration

These tests are configured to run automatically in CI environments. The `playwright.config.ts` is set up to:
- Use 1 worker in CI (serial execution)
- Retry failed tests 2 times in CI
- Start the dev server automatically before running tests

## Troubleshooting

### Tests timing out
- Increase timeout in individual tests: `test.setTimeout(60000)`
- Or in config: Update `timeout` in `playwright.config.ts`

### Element not found
- Use `page.waitForLoadState('networkidle')` after navigation
- Use more specific selectors
- Add `await page.waitForTimeout(500)` after typing in autocomplete

### Flaky tests
- Use `await expect(...).toBeVisible()` instead of direct assertions
- Add proper waits for dynamic content
- Use `page.waitForURL()` for navigation assertions
