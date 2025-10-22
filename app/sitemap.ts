import { MetadataRoute } from "next";
import { numOfPokemonByGen } from "@/constants/numOfPokemonByGen";

// Version groups with their valid pokedexes and generation
// maxPokemonId overrides the generation's default for remakes
const VERSION_GROUPS = [
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
    maxPokemonId: 151, // Kanto dex only has Gen I Pokemon
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
  },
  {
    name: "lets-go-pikachu-lets-go-eevee",
    pokedexes: ["letsgo-kanto"],
    generation: "generation-vii",
    maxPokemonId: 151, // Kanto dex only has Gen I Pokemon
  },
  // Gen 8
  {
    name: "sword-shield",
    pokedexes: ["galar", "isle-of-armor", "crown-tundra"],
    generation: "generation-viii",
  },
  {
    name: "the-isle-of-armor",
    pokedexes: ["isle-of-armor"],
    generation: "generation-viii",
  },
  {
    name: "the-crown-tundra",
    pokedexes: ["crown-tundra"],
    generation: "generation-viii",
  },
  {
    name: "brilliant-diamond-and-shining-pearl",
    pokedexes: ["original-sinnoh"],
    generation: "generation-viii",
    maxPokemonId: 493, // Original Sinnoh dex only has Gen I-IV Pokemon
  },
  {
    name: "legends-arceus",
    pokedexes: ["hisui"],
    generation: "generation-viii",
  },
  // Gen 9
  {
    name: "scarlet-violet",
    pokedexes: ["paldea"],
    generation: "generation-ix",
  },
  {
    name: "the-teal-mask",
    pokedexes: ["kitakami"],
    generation: "generation-ix",
  },
  {
    name: "the-indigo-disk",
    pokedexes: ["blueberry"],
    generation: "generation-ix",
  },
];

// Popular/starter Pokemon to prioritize for higher priority score
const PRIORITY_POKEMON = new Set([
  "bulbasaur",
  "charmander",
  "squirtle",
  "pikachu",
  "mewtwo",
  "mew",
  "chikorita",
  "cyndaquil",
  "totodile",
  "lugia",
  "ho-oh",
  "treecko",
  "torchic",
  "mudkip",
  "rayquaza",
  "groudon",
  "kyogre",
  "charizard",
  "blastoise",
  "venusaur",
  "gengar",
  "dragonite",
  "tyranitar",
  "garchomp",
  "lucario",
  "greninja",
  "decidueye",
]);

type PokemonSpecies = {
  name: string;
  id: number;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.pokemechanics.app";
  const currentDate = new Date();

  const urls: MetadataRoute.Sitemap = [
    // Homepage
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },

    // Pokedex index
    {
      url: `${baseUrl}/pokedex`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  // Add version group pages (/pokedex/[gen])
  VERSION_GROUPS.forEach((vg) => {
    urls.push({
      url: `${baseUrl}/pokedex/${vg.name}`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  });

  // Fetch all 1025 Pokemon species with IDs for generation-based filtering
  try {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon-species?limit=1025&offset=0",
      {
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    );
    const data = await response.json();
    const allPokemon: PokemonSpecies[] = data.results.map(
      (p: { name: string; url: string }, index: number) => ({
        name: p.name,
        id: index + 1, // PokeAPI species IDs are sequential starting from 1
      })
    );

    console.log(
      `Generating sitemap for ${allPokemon.length} Pokemon across ${VERSION_GROUPS.length} version groups...`
    );

    // For each version group, generate URLs for all valid Pokemon
    VERSION_GROUPS.forEach((vg) => {
      // Get max Pokemon ID for this version group
      // Use override if present (for remakes), otherwise use generation default
      const maxPokemonId =
        "maxPokemonId" in vg
          ? vg.maxPokemonId
          : numOfPokemonByGen[vg.generation];

      // Filter Pokemon that exist in this version group
      const validPokemon = allPokemon.filter((p) => p.id <= maxPokemonId);

      console.log(
        `${vg.name} (${vg.generation}): ${validPokemon.length}/${allPokemon.length} Pokemon`
      );

      // Generate national dex URLs for all valid Pokemon
      validPokemon.forEach((pokemon) => {
        const isPriority = PRIORITY_POKEMON.has(pokemon.name);

        urls.push({
          url: `${baseUrl}/pokemon/${pokemon.name}/${vg.name}/national`,
          lastModified: currentDate,
          changeFrequency: "monthly",
          priority: isPriority ? 0.8 : 0.6,
        });
      });

      // Generate regional dex URLs for all valid Pokemon
      vg.pokedexes.forEach((dexName) => {
        validPokemon.forEach((pokemon) => {
          const isPriority = PRIORITY_POKEMON.has(pokemon.name);

          urls.push({
            url: `${baseUrl}/pokemon/${pokemon.name}/${vg.name}/${dexName}`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: isPriority ? 0.7 : 0.5,
          });
        });
      });
    });

    console.log(`Total sitemap URLs generated: ${urls.length}`);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Fallback: at least include homepage and pokedex pages
    // (already added above)
  }

  return urls;
}
