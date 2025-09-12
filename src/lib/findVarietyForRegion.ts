import { PokemonSpeciesVariety, SpeciesVariety } from "@/types/index";

// This function takes in an array of pokemon varieties and an array of regions
// It will return the pokemon variety that matches the name of the region
// If there is no match, it will return undefined
export default function findVarietyForRegion(
  varieties: PokemonSpeciesVariety["varieties"],
  regions: { name: string; id: number }[]
) {
  const pokemonVarietyForRegion: SpeciesVariety | undefined = varieties
    .filter((variety) => !variety.is_default)
    .find((variety) => {
      return variety.pokemon.name.includes(regions[0]?.name);
    });

  return regions.length > 0 ? pokemonVarietyForRegion : undefined;
}
