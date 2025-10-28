import { PokemonSpecies } from "@/types/index";
import findVarietyForRegion from "./findVarietyForRegion";

/**
 * Determines the correct Pokemon name to use (default or variant)
 * based on the region/dex for the given game version
 *
 * @param speciesData - Pokemon species data (from fetchPokemonSpeciesByName)
 * @param regionName - Region name (e.g., "alola", "hisui", "galar")
 * @returns Variant Pokemon name if one exists for this region, otherwise default name
 *
 * @example
 * // For Rattata in Alola region
 * getVariantPokemonName(rattataSpecies, "alola") // Returns "rattata-alola"
 *
 * // For Pikachu in Alola region (no variant)
 * getVariantPokemonName(pikachuSpecies, "alola") // Returns "pikachu"
 */
export function getVariantPokemonName(
  speciesData: PokemonSpecies,
  regionName: string
): string {
  // If only one variety, use default name
  if (speciesData.varieties.length === 1) {
    return speciesData.name;
  }

  // Find variant for this region
  const variant = findVarietyForRegion(speciesData.varieties, regionName);

  if (variant) {
    // Return the variant Pokemon name (e.g., "rattata-alola")
    return variant.pokemon.name;
  }

  // No variant for this region, use default
  return speciesData.name;
}
