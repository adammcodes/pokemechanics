import { cache } from "react";
import { getGenerations, type Generation } from "@/app/helpers/graphql/getGenerations";
import { getGenerationVersions, type GenerationVersions } from "@/app/helpers/graphql/getGenerationVersions";

export type PokemonRoute = {
  gen: string;
  pokemon: string;
};

/**
 * Fetches all valid Pokemon routes for static generation
 * New URL structure: /{gen}/{pokemon}
 * Example: /generation-i/bulbasaur
 *
 * Each generation gets one URL per unique Pokemon that appears in any of its pokedexes.
 * For example:
 * - generation-i: 151 unique Pokemon
 * - generation-ii: 251 unique Pokemon (all Gen I + Gen II Pokemon available in Gen II games)
 * - etc.
 */
export const getAllPokemonRoutes = cache(async (): Promise<PokemonRoute[]> => {
  const routes: PokemonRoute[] = [];

  try {
    // Get all generations with their version groups
    const generations: Generation[] = await getGenerations();

    console.log(`Processing ${generations.length} generations...`);

    // For each generation, get all unique Pokemon across all pokedexes
    for (const generation of generations) {
      const genName = generation.name;

      // Fetch complete generation data including all pokedexes
      const genData: GenerationVersions = await getGenerationVersions(genName);

      // Collect all unique Pokemon species names across all pokedexes in this generation
      const uniquePokemonNames = new Set<string>();

      // Iterate through version groups -> pokedexes -> Pokemon
      genData.versiongroups.forEach((versionGroup) => {
        versionGroup.pokedexversiongroups.forEach((pvg) => {
          pvg.pokedex.pokemondexnumbers.forEach((dexNumber) => {
            // Add the Pokemon species name
            uniquePokemonNames.add(dexNumber.pokemonspecy.name);
          });
        });
      });

      // Create a route for each unique Pokemon in this generation
      uniquePokemonNames.forEach((pokemonName) => {
        routes.push({
          gen: genName,
          pokemon: pokemonName,
        });
      });

      console.log(`${genName}: ${uniquePokemonNames.size} unique Pokemon`);
    }

    console.log(`Generated ${routes.length} Pokemon routes for static build`);
    console.log(`Breakdown: ${generations.length} generations`);

    return routes;
  } catch (error) {
    console.error("Error fetching Pokemon routes:", error);
    // Return empty array on error - build will fail gracefully
    return [];
  }
});

/**
 * Get all generation names for static generation
 */
export async function getAllGenerations(): Promise<string[]> {
  const generations = await getGenerations();
  return generations.map((gen) => gen.name);
}
