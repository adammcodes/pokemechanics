import { test, expect } from "@playwright/test";

/**
 * E2E Tests for Type Efficacy Across Generations
 *
 * These tests verify that Pokemon display correct type matchups based on
 * the generation they're being viewed in. Type efficacy calculations are
 * complex and generation-dependent:
 *
 * Key Test Cases:
 * 1. Jigglypuff in Red-Blue (Gen I) - Normal type only (Fairy didn't exist)
 * 2. Jigglypuff in X-Y (Gen VI) - Normal/Fairy type (Fairy introduced in Gen VI)
 *
 * Why These Tests Matter:
 * - Fairy type was introduced in Generation VI (X-Y)
 * - Before Gen VI, Pokemon like Jigglypuff were pure Normal type
 * - Type efficacy multiplies for dual-type Pokemon (Normal × Fairy)
 * - Historical accuracy is critical for game-specific mechanics
 */

test.describe("Type Efficacy - Jigglypuff Red-Blue (Gen I)", () => {
  test("should show Normal type efficacies only (Fairy type did not exist in Gen I)", async ({
    page,
  }) => {
    // Step 1: Navigate directly to Jigglypuff's Red-Blue/Kanto page
    await page.goto("/pokemon/jigglypuff/red-blue/kanto");
    await page.waitForLoadState("networkidle");

    // Step 2: Wait for page to fully load (spinner disappears)
    await page
      .waitForSelector(".animate-spin", {
        state: "detached",
        timeout: 15000,
      })
      .catch(() => {
        // Ignore timeout if spinner is already gone
      });

    // Step 3: Wait for Type Efficacy box to be visible
    const typeEfficacyBox = page.locator('[data-testid="type-efficacy-box"]');
    await expect(typeEfficacyBox).toBeVisible({ timeout: 15000 });

    // Step 4: Verify Fighting type is super effective (x2.0)
    // Fighting is super effective against Normal type
    const fightingEfficacy = page.locator(
      '[data-testid="type-efficacy-fighting"]'
    );
    await expect(fightingEfficacy).toBeVisible();

    const fightingDamage = page.locator(
      '[data-testid="type-efficacy-fighting-damage"]'
    );
    await expect(fightingDamage).toContainText("x2.0");
    await expect(fightingDamage).toHaveClass(/color-super-effective/);

    // Step 5: Verify Ghost type does no damage (x0)
    // In Gen I, Ghost type does no damage to Normal type
    const ghostEfficacy = page.locator('[data-testid="type-efficacy-ghost"]');
    await expect(ghostEfficacy).toBeVisible();

    const ghostDamage = page.locator(
      '[data-testid="type-efficacy-ghost-damage"]'
    );
    await expect(ghostDamage).toContainText("x0");
    await expect(ghostDamage).toHaveClass(/color-no-effect/);

    // Step 6: CRITICAL - Verify Fairy type does NOT exist in Gen I
    // Fairy type was not introduced until Gen VI
    const fairyEfficacy = page.locator('[data-testid="type-efficacy-fairy"]');
    await expect(fairyEfficacy).not.toBeVisible();
  });
});

test.describe("Type Efficacy - Jigglypuff X-Y (Gen VI)", () => {
  test("should show Normal/Fairy dual-type efficacies (Fairy type introduced in Gen VI)", async ({
    page,
  }) => {
    // Step 1: Navigate directly to Jigglypuff's X-Y/Kalos Mountain page
    await page.goto("/pokemon/jigglypuff/x-y/kalos-mountain");
    await page.waitForLoadState("networkidle");

    // Step 2: Wait for page to fully load (spinner disappears)
    await page
      .waitForSelector(".animate-spin", {
        state: "detached",
        timeout: 15000,
      })
      .catch(() => {
        // Ignore timeout if spinner is already gone
      });

    // Step 3: Wait for Type Efficacy box to be visible
    const typeEfficacyBox = page.locator('[data-testid="type-efficacy-box"]');
    await expect(typeEfficacyBox).toBeVisible({ timeout: 15000 });

    // Step 4: Verify Fighting type is neutral damage (x1.0)
    // Fighting is super effective vs Normal (x2.0) but not very effective vs Fairy (x0.5)
    // Combined: 2.0 × 0.5 = 1.0 (neutral)
    const fightingEfficacy = page.locator(
      '[data-testid="type-efficacy-fighting"]'
    );
    await expect(fightingEfficacy).toBeVisible();

    const fightingDamage = page.locator(
      '[data-testid="type-efficacy-fighting-damage"]'
    );
    await expect(fightingDamage).toContainText("x1.0");
    // Should NOT have color-super-effective or color-not-effective (neutral = no special color)
    await expect(fightingDamage).not.toHaveClass(/color-super-effective/);
    await expect(fightingDamage).not.toHaveClass(/color-not-effective/);

    // Step 5: Verify Dragon type does no damage (x0)
    // Dragon type does no damage to Fairy type
    const dragonEfficacy = page.locator('[data-testid="type-efficacy-dragon"]');
    await expect(dragonEfficacy).toBeVisible();

    const dragonDamage = page.locator(
      '[data-testid="type-efficacy-dragon-damage"]'
    );
    await expect(dragonDamage).toContainText("x0");
    await expect(dragonDamage).toHaveClass(/color-no-effect/);

    // Step 6: Verify Poison type is super effective (x2.0)
    // Poison is super effective against Fairy type
    const poisonEfficacy = page.locator('[data-testid="type-efficacy-poison"]');
    await expect(poisonEfficacy).toBeVisible();

    const poisonDamage = page.locator(
      '[data-testid="type-efficacy-poison-damage"]'
    );
    await expect(poisonDamage).toContainText("x2.0");
    await expect(poisonDamage).toHaveClass(/color-super-effective/);

    // Step 7: Verify Steel type is super effective (x2.0)
    // Steel is super effective against Fairy type
    const steelEfficacy = page.locator('[data-testid="type-efficacy-steel"]');
    await expect(steelEfficacy).toBeVisible();

    const steelDamage = page.locator(
      '[data-testid="type-efficacy-steel-damage"]'
    );
    await expect(steelDamage).toContainText("x2.0");
    await expect(steelDamage).toHaveClass(/color-super-effective/);
  });
});
