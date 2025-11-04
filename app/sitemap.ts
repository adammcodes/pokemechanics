import { MetadataRoute } from "next";
import {
  POKEAPI_GRAPHQL_ENDPOINT,
  POKEAPI_REST_ENDPOINT,
} from "@/constants/apiConfig";

// Type for version group configuration
type VersionGroupConfig = {
  name: string;
  pokedexes: string[];
  generation: string;
  maxPokemonId?: number; // Optional override for remakes
  region?: string; // Region for regional variants (e.g., "alola", "galar", "hisui")
};

type PokedexVersionGroup = {
  pokedex: {
    id: number;
    name: string;
    region: {
      name: string;
    };
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

// Regional variant Pokemon by region
// These Pokemon have regional forms that should be included in sitemap
const REGIONAL_VARIANTS: Record<string, string[]> = {
  alola: [
    "rattata",
    "raticate",
    "raichu",
    "sandshrew",
    "sandslash",
    "vulpix",
    "ninetales",
    "diglett",
    "dugtrio",
    "meowth",
    "persian",
    "geodude",
    "graveler",
    "golem",
    "grimer",
    "muk",
    "exeggutor",
    "marowak",
  ],
  galar: [
    "meowth",
    "ponyta",
    "rapidash",
    "slowpoke",
    "slowbro",
    "farfetchd",
    "weezing",
    "mr-mime",
    "articuno",
    "zapdos",
    "moltres",
    "slowking",
    "corsola",
    "zigzagoon",
    "linoone",
    "darumaka",
    "darmanitan",
    "yamask",
    "stunfisk",
  ],
  hisui: [
    "growlithe",
    "arcanine",
    "voltorb",
    "electrode",
    "typhlosion",
    "qwilfish",
    "sneasel",
    "samurott",
    "lilligant",
    "zorua",
    "zoroark",
    "braviary",
    "sliggoo",
    "goodra",
    "avalugg",
    "decidueye",
  ],
  paldea: ["tauros", "wooper"],
};

// Version groups with their valid pokedexes and generation
// maxPokemonId overrides the generation's default for remakes
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
    maxPokemonId: 151, // Kanto dex only has Gen I Pokemon
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
    maxPokemonId: 493, // Original Sinnoh dex only has Gen I-IV Pokemon
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
      `${POKEAPI_REST_ENDPOINT}/pokemon?limit=1025&offset=0`,
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

    const versionGroupPokedexes = await fetch(
      `${POKEAPI_GRAPHQL_ENDPOINT}/query`,
      {
        method: "POST",
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
                  region {
                    name
                  }
                  pokemondexnumbers {
                    pokemon_species_id
                    pokedex_number
                  }
                }
              }
            }
          }`,
        }),
      }
    );

    const { data: pokedexData } = await versionGroupPokedexes.json();

    const vgPokedexes: VersionGroupPokedexes[] = pokedexData.versiongroup;

    // For each version group, generate URLs for all valid Pokemon
    VERSION_GROUPS.forEach((vg) => {
      const vgPokedex = vgPokedexes.find((v) => v.name === vg.name);
      if (vgPokedex) {
        const pokedexes = vgPokedex.pokedexversiongroups.map((p) => p.pokedex);
        pokedexes.forEach((dex) => {
          const regionName = dex.region.name;
          dex.pokemondexnumbers.forEach((dexNumber) => {
            const pokemonSpeciesId = dexNumber.pokemon_species_id;
            const pokemonSpecies = allPokemon[pokemonSpeciesId - 1];
            const isVariant = REGIONAL_VARIANTS[regionName]?.includes(
              pokemonSpecies.name
            );
            const pokemonName = isVariant
              ? `${pokemonSpecies.name}-${regionName}`
              : pokemonSpecies.name;
            urls.push({
              url: `${baseUrl}/pokemon/${pokemonName}/${vg.name}/${dex.name}`,
              lastModified: currentDate,
              changeFrequency: "monthly",
              priority: 0.7,
            });
          });
        });
      }
    });

    console.log(`Total sitemap URLs generated: ${urls.length}`);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Fallback: at least include homepage and pokedex pages
    // (already added above)
  }

  return urls;
}
