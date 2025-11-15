import { POKEAPI_GRAPHQL_ENDPOINT } from "@/constants/apiConfig";

// Type for version group configuration
type VersionGroupConfig = {
  name: string;
  pokedexes: string[];
  generation: string;
  maxPokemonId?: number;
  region?: string;
};

type PokedexVersionGroup = {
  pokedex: {
    id: number;
    name: string;
    pokemondexnumbers: {
      pokemon_species_id: number;
      pokedex_number: number;
    }[];
  };
};

type VersionGroupPokedexes = {
  id: number;
  name: string;
  generation_id: number;
  pokedexversiongroups: PokedexVersionGroup[];
};

// Version groups with their valid pokedexes and generation
const VERSION_GROUPS: VersionGroupConfig[] = [
  // Gen 1
  { name: "red-blue", pokedexes: ["kanto"], generation: "generation-i" },
  { name: "yellow", pokedexes: ["kanto"], generation: "generation-i" },
  // Gen 2
  {
    name: "gold-silver",
    pokedexes: ["original-johto"],
    generation: "generation-ii",
  },
  {
    name: "crystal",
    pokedexes: ["original-johto"],
    generation: "generation-ii",
  },
  // Gen 3
  { name: "ruby-sapphire", pokedexes: ["hoenn"], generation: "generation-iii" },
  { name: "emerald", pokedexes: ["hoenn"], generation: "generation-iii" },
  {
    name: "firered-leafgreen",
    pokedexes: ["kanto"],
    generation: "generation-iii",
    maxPokemonId: 151,
  },
  // Gen 4
  {
    name: "diamond-pearl",
    pokedexes: ["original-sinnoh"],
    generation: "generation-iv",
  },
  {
    name: "platinum",
    pokedexes: ["extended-sinnoh"],
    generation: "generation-iv",
  },
  {
    name: "heartgold-soulsilver",
    pokedexes: ["updated-johto"],
    generation: "generation-iv",
  },
  // Gen 5
  {
    name: "black-white",
    pokedexes: ["original-unova"],
    generation: "generation-v",
  },
  {
    name: "black-2-white-2",
    pokedexes: ["updated-unova"],
    generation: "generation-v",
  },
  // Gen 6
  {
    name: "x-y",
    pokedexes: ["kalos-central", "kalos-coastal", "kalos-mountain"],
    generation: "generation-vi",
  },
  {
    name: "omega-ruby-alpha-sapphire",
    pokedexes: ["updated-hoenn"],
    generation: "generation-vi",
  },
  // Gen 7
  {
    name: "sun-moon",
    pokedexes: [
      "original-melemele",
      "original-alola",
      "original-akala",
      "original-ulaula",
      "original-poni",
    ],
    generation: "generation-vii",
    region: "alola",
  },
  {
    name: "ultra-sun-ultra-moon",
    pokedexes: [
      "updated-alola",
      "updated-melemele",
      "updated-akala",
      "updated-ulaula",
      "updated-poni",
    ],
    generation: "generation-vii",
    region: "alola",
  },
  {
    name: "lets-go-pikachu-lets-go-eevee",
    pokedexes: ["letsgo-kanto"],
    generation: "generation-vii",
    maxPokemonId: 151,
  },
  // Gen 8
  {
    name: "sword-shield",
    pokedexes: ["galar", "isle-of-armor", "crown-tundra"],
    generation: "generation-viii",
    region: "galar",
  },
  {
    name: "the-isle-of-armor",
    pokedexes: ["isle-of-armor"],
    generation: "generation-viii",
    region: "galar",
  },
  {
    name: "the-crown-tundra",
    pokedexes: ["crown-tundra"],
    generation: "generation-viii",
    region: "galar",
  },
  {
    name: "brilliant-diamond-and-shining-pearl",
    pokedexes: ["original-sinnoh"],
    generation: "generation-viii",
    maxPokemonId: 493,
  },
  {
    name: "legends-arceus",
    pokedexes: ["hisui"],
    generation: "generation-viii",
    region: "hisui",
  },
  // Gen 9
  {
    name: "scarlet-violet",
    pokedexes: ["paldea"],
    generation: "generation-ix",
    region: "paldea",
  },
  {
    name: "the-teal-mask",
    pokedexes: ["kitakami"],
    generation: "generation-ix",
    region: "paldea",
  },
  {
    name: "the-indigo-disk",
    pokedexes: ["blueberry"],
    generation: "generation-ix",
    region: "paldea",
  },
];

export type PokemonRoute = {
  name: string;
  game: string;
  dex: string;
};

export type PokemonSpeciesVariety = {
  name: string;
  id: number;
  pokemons: {
    is_default: boolean;
    pokemonforms: { name: string; id: number; form_name: string }[];
  }[];
};

/**
 * Fetches all valid Pokemon routes for static generation
 * Returns an array of { name, game, dex } objects
 */
export async function getAllPokemonRoutes(): Promise<PokemonRoute[]> {
  const routes: PokemonRoute[] = [];

  try {
    // Fetch all 1025 Pokemon species and their varieties
    const pokemonResponse = await fetch(POKEAPI_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query SpeciesVarieties {
            pokemonspecies(
              limit: 1025
              order_by: [ {
              id: asc
            }]) {
              name
              id
              pokemons {
                is_default
                pokemonforms {
                  name
                  id
                  form_name
                }
              }
            }
          }
          `,
      }),
    });

    const { data: speciesVarietiesData } = await pokemonResponse.json();
    const allPokemon: PokemonSpeciesVariety[] =
      speciesVarietiesData.pokemonspecies;

    // Fetch version group/pokedex mappings
    const versionGroupPokedexes = await fetch(POKEAPI_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query GetVersionGroupsAndPokedexes {
            versiongroup {
              id
              name
              generation_id
              pokedexversiongroups {
                pokedex {
                  id
                  name
                  pokemondexnumbers {
                    pokemon_species_id
                    pokedex_number
                  }
                }
              }
            }
          }`,
      }),
    });

    const { data: pokedexData } = await versionGroupPokedexes.json();
    const vgPokedexes: VersionGroupPokedexes[] = pokedexData.versiongroup;

    // Generate routes for all version groups
    VERSION_GROUPS.forEach((vg) => {
      const vgPokedex = vgPokedexes.find((v) => v.name === vg.name);
      if (vgPokedex) {
        const pokedexes = vgPokedex.pokedexversiongroups.map((p) => p.pokedex);
        pokedexes.forEach((dex) => {
          dex.pokemondexnumbers.forEach((dexNumber) => {
            const pokemonSpeciesId = dexNumber.pokemon_species_id;
            const pokemonSpecies = allPokemon[pokemonSpeciesId - 1];
            const forms = pokemonSpecies.pokemons;

            if (forms.length > 1) {
              forms.forEach((form) => {
                form.pokemonforms.forEach((f) => {
                  routes.push({
                    name: f.name,
                    game: vg.name,
                    dex: dex.name,
                  });
                });
              });
            } else {
              routes.push({
                name: pokemonSpecies.name,
                game: vg.name,
                dex: dex.name,
              });
            }
          });
        });
      }
    });

    console.log(`Generated ${routes.length} Pokemon routes for static build`);
    return routes;
  } catch (error) {
    console.error("Error fetching Pokemon routes:", error);
    // Return empty array on error - build will fail gracefully
    return [];
  }
}

/**
 * Get all version group names for static generation
 */
export function getAllVersionGroups(): string[] {
  return VERSION_GROUPS.map((vg) => vg.name);
}

/**
 * Export VERSION_GROUPS for use in other modules
 */
export { VERSION_GROUPS };
