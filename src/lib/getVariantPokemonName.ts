import { PokemonSpecies } from "@/types/index";
import findVarietyForRegion from "./findVarietyForRegion";

/**
 * Determines the correct Pokemon name to use (default or variant)
 * based on the region/dex for the given game version
 * If the variant name does not contain the region name, it will use the default variant name
 *
 * @param speciesData - Pokemon species data (from fetchPokemonSpeciesByName)
 * @param regionName - Region name (e.g., "alola", "hisui", "galar")
 * @param pokemonName - Pokemon name from the URL
 * @returns Variant Pokemon name if one exists for this region, otherwise default name
 *
 * @example
 * // For Rattata in Alola region
 * getVariantPokemonName(rattataSpecies, "alola", "rattata-alola") // Returns "rattata-alola"
 *
 * // For Pikachu in Alola region (no variant)
 * getVariantPokemonName(pikachuSpecies, "alola", "pikachu-alola") // Returns "pikachu-alola"
 *
 * // For Shaymin in Sinnoh region (not a regional variant, but it does have default variant "shaymin-land")
 * getVariantPokemonName(shayminSpecies, "platinum", "shaymin-land") // Returns "shaymin-land"
 *
 * // If Name from the URL doesn't include the variant suffix, it will use the default variant name that includes the pokemon name
 * getVariantPokemonName(shayminSpecies, "platinum", "shaymin") // Returns "shaymin-land"
 *
 * // If the url pokemon name species an existing variety name, it will use the pokemon url name
 * getVariantPokemonName(shayminSpecies, "platinum", "shaymin-sky") // Returns "shaymin-sky"
 */
export function getVariantPokemonName(
  speciesData: PokemonSpecies,
  regionName: string,
  pokemonName: string // Name from the URL
): string {
  // If only one variety, use default name
  if (speciesData.varieties.length === 1) {
    return speciesData.name;
  }

  // Find variant for this region
  const regionalVariant = findVarietyForRegion(
    speciesData.varieties,
    regionName
  );

  if (regionalVariant) {
    // Return the variant Pokemon name (e.g., "rattata-alola")
    return regionalVariant.pokemon.name;
  }

  // If the url pokemon name exists in the varieties, return it
  const variety = speciesData.varieties.find(
    (variety) => variety.pokemon.name === pokemonName
  );
  if (variety) {
    return variety.pokemon.name;
  }

  // If the url pokemon name is included in the default variety name, return the default variety name
  const defaultVariety = speciesData.varieties.find(
    (variety) =>
      variety.is_default && variety.pokemon.name.includes(pokemonName)
  );
  if (defaultVariety) {
    return defaultVariety.pokemon.name;
  }

  // No variant for this region, use default
  return speciesData.name;
}
