/**
 * Pokemon form variants that are documented in PokeAPI but don't have
 * complete species/pokemon data available. These variants will be excluded
 * from static route generation and will fall back to the base species name.
 *
 * Common reasons for unsupported variants:
 * - Alcremie: 63 different cream/sweet combinations (only base form has data)
 * - Floette: Colored flower forms (only base form has data)
 * - Gimmighoul: Chest form variant (only roaming form has data)
 * - Koraidon/Miraidon: Battle forms (only base forms have data)
 */

/**
 * Prefixes for Pokemon that have unsupported form variants.
 * Any variant starting with these prefixes will use the base species name.
 */
const UNSUPPORTED_VARIANT_PREFIXES = [
  "alcremie-", // 63 cream/sweet combinations
  "floette-", // 5 color variants (blue, orange, red, white, yellow)
] as const;

/**
 * Specific unsupported variant forms (not pattern-based)
 */
const SPECIFIC_UNSUPPORTED_VARIANTS = [
  "gimmighoul-chest",
  "koraidon-apex-build",
  "miraidon-ultimate-mode",
] as const;

/**
 * Set for O(1) lookup of specific variants
 */
const SPECIFIC_UNSUPPORTED_SET = new Set<string>(SPECIFIC_UNSUPPORTED_VARIANTS);

/**
 * Check if a Pokemon name is an unsupported variant
 * @param name - Pokemon name to check
 * @returns true if the variant is unsupported
 */
export function isUnsupportedVariant(name: string): boolean {
  // Check pattern-based prefixes first (most common)
  for (const prefix of UNSUPPORTED_VARIANT_PREFIXES) {
    if (name.startsWith(prefix)) {
      return true;
    }
  }

  // Check specific variants
  return SPECIFIC_UNSUPPORTED_SET.has(name);
}

/**
 * Get the base species name from a Pokemon name, handling unsupported variants
 * @param name - Pokemon name (potentially an unsupported variant)
 * @returns Base species name
 *
 * @example
 * getBaseSpeciesName("alcremie-matcha-cream-love-sweet") // Returns "alcremie"
 * getBaseSpeciesName("floette-red") // Returns "floette"
 * getBaseSpeciesName("gimmighoul-chest") // Returns "gimmighoul"
 * getBaseSpeciesName("pikachu") // Returns "pikachu"
 */
export function getBaseSpeciesName(name: string): string {
  // Check pattern-based prefixes
  for (const prefix of UNSUPPORTED_VARIANT_PREFIXES) {
    if (name.startsWith(prefix)) {
      // Extract base name (remove the hyphen and everything after)
      return prefix.slice(0, -1); // Remove trailing hyphen
    }
  }

  // Check specific variants
  if (SPECIFIC_UNSUPPORTED_SET.has(name)) {
    // Extract base species name (everything before first hyphen)
    return name.split("-")[0];
  }

  // Not an unsupported variant, return as-is
  return name;
}
