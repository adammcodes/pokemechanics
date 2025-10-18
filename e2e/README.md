# E2E Test Documentation

## Overview

This directory contains end-to-end (E2E) tests using Playwright to verify critical user flows in the Pokémechanics application.

## Test Files

### `search-pokemon.spec.ts`

Tests the complete Pokemon search and navigation flow:

1. **Home Page** → User sees "WHICH GAME ARE YOU PLAYING?_"
2. **Game Selection** → User selects a version (e.g., "Yellow", "Gold Silver")
3. **Pokedex Page** → User is redirected to `/pokedex/{version}`
4. **Pokemon Search** → User searches in National Dex or Regional Dex
5. **Pokemon Detail** → User navigates to Pokemon detail page and verifies content loads

**Current Coverage:**
- ✅ Yellow version with National Dex selector (Pikachu)
- ✅ Gold/Silver version with Regional Dex (Johto) selector (Chikorita)

## Test Structure

Each test follows this reliable pattern:

1. Navigate to home page and wait for network idle
2. Select game version from dropdown (wait for dropdown visibility)
3. Navigate to pokedex page and **wait for loading spinner to disappear**
4. Verify page content using `data-testid` attributes
5. Search for Pokemon in dex selector (scoped to correct component)
6. Wait for dropdown and select Pokemon
7. Navigate to Pokemon detail page and **wait for loading spinner to disappear**
8. Verify Pokemon name and sprite using `data-testid` attributes

**Key Success Factors:**
- ✅ Always wait for `.animate-spin` to be detached after navigation
- ✅ Use `data-testid` attributes for all structural elements
- ✅ Scope selectors to components to avoid finding wrong elements
- ✅ Wait for dropdowns to be visible before searching for options

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

## Best Practices

### Always Use `data-testid` Attributes

**✅ DO:** Use `data-testid` attributes for reliable element selection
```typescript
const regionalDexHeader = page.locator('[data-testid="regional-dex-header"]');
const spriteImage = page.locator('img[data-testid="Pikachu-main-sprite"]');
```

**❌ DON'T:** Select elements by tag names, class names, or text content (these can change)
```typescript
// Bad - fragile selectors
const heading = page.getByRole('heading', { level: 1 });
const section = page.locator('.text-2xl');
const element = page.getByText(/some text/i);
```

### Always Wait for Loading Spinners

After navigation, always wait for the loading spinner to disappear before checking for content:

```typescript
await page.waitForURL('**/pokemon/**');

// Wait for loading spinner to disappear (page fully loaded)
await page.waitForSelector('.animate-spin', {
  state: 'detached',
  timeout: 10000,
});

// NOW check for content
const pokemonNameElement = page.locator('div[data-testid="Pikachu-heading"]').first();
await expect(pokemonNameElement).toContainText(/pikachu/i);
```

### Scope Selectors to Avoid Conflicts

When searching for elements within a specific component, scope your selectors:

```typescript
// Find the regional dex selector first
const regionalDexSelector = page.locator('[data-testid="regional-dex-selector"]').first();

// Then find elements WITHIN it
const regionalDexSearch = regionalDexSelector.getByPlaceholder('Search...');
const dropdown = regionalDexSelector.locator('ul');
```

## Adding Tests for New Version Groups

To add tests for a different version group (e.g., Ruby/Sapphire, Sun/Moon):

1. **Copy an existing test** from `search-pokemon.spec.ts` (use Yellow or Gold/Silver as template)
2. **Update the version group:**
   - Test describe name: `"Ruby/Sapphire Version - Hoenn Dex - Treecko"`
   - Selection text: `hasText: "Ruby Sapphire"`
   - URL path: `"**/pokedex/ruby-sapphire"`
3. **Update the Pokemon:**
   - Search term: `"treecko"`
   - data-testid: `'div[data-testid="Treecko-heading"]'`
   - Sprite testid: `'img[data-testid="Treecko-main-sprite"]'`
4. **For Regional Dex tests:**
   - Use `page.locator('[data-testid="regional-dex-header"]')` to verify the page loaded
   - Use `page.locator('[data-testid="regional-dex-selector"]')` to find the selector component

### Key Patterns

**National Dex Test Pattern:**
- Use `.last()` to get the National Dex search input (it appears after Regional Dex)
- Use `page.locator("ul").last()` to get the National Dex dropdown

**Regional Dex Test Pattern:**
- Use `data-testid="regional-dex-selector"` to scope the search
- Find dropdown within: `regionalDexSelector.locator("ul")`

**Pokemon Detail Page Pattern:**
- Always wait for loading spinner to disappear
- Use `data-testid` for heading and sprite verification
- For Gold/Silver: verify both gold and silver sprites

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

### Tests timing out or failing to find elements

**Problem:** Test can't find elements or times out waiting for them.

**Solution:** Always wait for the loading spinner to disappear:
```typescript
await page.waitForSelector('.animate-spin', { state: 'detached', timeout: 10000 });
```

### Dropdown options not found

**Problem:** Playwright can't find dropdown options even though they're visible.

**Solutions:**
1. Wait for the dropdown `<ul>` to be visible first:
   ```typescript
   const dropdown = regionalDexSelector.locator("ul");
   await expect(dropdown).toBeVisible();
   ```
2. Scope your selector to the correct container (avoid using `page.locator("ul").first()` which might find the wrong element)
3. Add a 500ms timeout after filling the search input:
   ```typescript
   await searchInput.fill("pikachu");
   await page.waitForTimeout(500);
   ```

### Wrong element selected

**Problem:** Test selects the wrong `<ul>` or option from a different component.

**Solution:** Scope your selectors to the correct component using `data-testid`:
```typescript
// Bad - might find wrong ul element
const dropdown = page.locator("ul").first();

// Good - scoped to the correct component
const regionalDexSelector = page.locator('[data-testid="regional-dex-selector"]');
const dropdown = regionalDexSelector.locator("ul");
```

### Test completes before page loads

**Problem:** Test tries to verify content before Next.js finishes loading.

**Solution:** `waitForLoadState('networkidle')` is not enough for Next.js SSR pages. Wait for the loading spinner instead:
```typescript
// ❌ Not reliable for Next.js
await page.waitForLoadState('networkidle');

// ✅ Reliable - waits for actual content
await page.waitForSelector('.animate-spin', { state: 'detached', timeout: 10000 });
```

### Elements exist but test can't find them

**Problem:** The element exists on the page but Playwright can't select it.

**Solution:** Verify you're using the correct selector and that it matches the actual HTML:
- Use `data-testid` attributes (preferred)
- Avoid relying on class names or tag structure
- Check that capitalization matches (e.g., `"Pikachu-heading"` not `"pikachu-heading"`)
