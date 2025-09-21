import { PokemonSpeciesVariety, SpeciesVariety } from "@/types/index";

/**
 * This function takes in an array of pokemon varieties and a region name
 * It will return the pokemon variety that matches the name of the region
 * If there is no match, it will return undefined
 * @param varieties - The varieties of the pokemon
 * @param regionName - The name of the region
 * @returns The pokemon variety that matches the name of the region or undefined if no match is found
 */
export default function findVarietyForRegion(
  varieties: PokemonSpeciesVariety["varieties"],
  regionName: string
) {
  const pokemonVarietyForRegion: SpeciesVariety | undefined = varieties
    .filter((variety) => !variety.is_default)
    .find((variety) => {
      return variety.pokemon.name.includes(regionName.toLowerCase());
    });

  return pokemonVarietyForRegion;
}
