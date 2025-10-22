import { MetadataRoute } from "next";

// Version groups with their valid pokedexes (from robots.txt)
const VERSION_GROUPS = [
  // Gen 1
  { name: "red-blue", pokedexes: ["kanto"] },
  { name: "yellow", pokedexes: ["kanto"] },
  // Gen 2
  { name: "gold-silver", pokedexes: ["original-johto"] },
  { name: "crystal", pokedexes: ["original-johto"] },
  // Gen 3
  { name: "ruby-sapphire", pokedexes: ["hoenn"] },
  { name: "emerald", pokedexes: ["hoenn"] },
  { name: "firered-leafgreen", pokedexes: ["kanto"] },
  // Gen 4
  { name: "diamond-pearl", pokedexes: ["original-sinnoh"] },
  { name: "platinum", pokedexes: ["extended-sinnoh"] },
  { name: "heartgold-soulsilver", pokedexes: ["updated-johto"] },
  // Gen 5
  { name: "black-white", pokedexes: ["original-unova"] },
  { name: "black-2-white-2", pokedexes: ["updated-unova"] },
  // Gen 6
  {
    name: "x-y",
    pokedexes: ["kalos-central", "kalos-coastal", "kalos-mountain"],
  },
  { name: "omega-ruby-alpha-sapphire", pokedexes: ["updated-hoenn"] },
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
  },
  { name: "lets-go-pikachu-lets-go-eevee", pokedexes: ["letsgo-kanto"] },
  // Gen 8
  {
    name: "sword-shield",
    pokedexes: ["galar", "isle-of-armor", "crown-tundra"],
  },
  { name: "the-isle-of-armor", pokedexes: ["isle-of-armor"] },
  { name: "the-crown-tundra", pokedexes: ["crown-tundra"] },
  {
    name: "brilliant-diamond-and-shining-pearl",
    pokedexes: ["original-sinnoh"],
  },
  { name: "legends-arceus", pokedexes: ["hisui"] },
  // Gen 9
  { name: "scarlet-violet", pokedexes: ["paldea"] },
  { name: "the-teal-mask", pokedexes: ["kitakami"] },
  { name: "the-indigo-disk", pokedexes: ["blueberry"] },
];

// Total Pokemon species in the National Pokedex
// We'll limit to first 1025 to avoid massive sitemap
const TOTAL_POKEMON = 1025;

// Popular/starter Pokemon to prioritize (Gen 1-3 starters + legendaries + fan favorites)
const PRIORITY_POKEMON = [
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
];

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

  // Strategy: Add National Pokedex pages for ALL Pokemon across major version groups
  // This gives search engines comprehensive coverage without bloating the sitemap
  const majorVersionGroups = [
    "red-blue", // Gen 1
    "crystal", // Gen 2
    "emerald", // Gen 3
    "platinum", // Gen 4
    "black-2-white-2", // Gen 5
    "x-y", // Gen 6
    "ultra-sun-ultra-moon", // Gen 7
    "lets-go-pikachu-lets-go-eevee", // Gen 7 (Let's Go)
    "sword-shield", // Gen 8
    "legends-arceus", // Gen 8 (Legends)
    "brilliant-diamond-and-shining-pearl", // Gen 8 (remakes)
    "scarlet-violet", // Gen 9
  ];

  // Fetch first 151 Pokemon (Gen 1) - these are most searched
  try {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon-species?limit=151&offset=0",
      {
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    );
    const data = await response.json();
    const gen1Pokemon: string[] = data.results.map(
      (p: { name: string }) => p.name
    );

    // Add national dex pages for Gen 1 Pokemon across major version groups
    gen1Pokemon.forEach((pokemonName) => {
      majorVersionGroups.forEach((versionGroup) => {
        const isPriority = PRIORITY_POKEMON.includes(pokemonName);

        urls.push({
          url: `${baseUrl}/pokemon/${pokemonName}/${versionGroup}/national`,
          lastModified: currentDate,
          changeFrequency: "monthly",
          priority: isPriority ? 0.8 : 0.6,
        });
      });
    });

    // Add priority Pokemon for ALL version groups (not just major ones)
    PRIORITY_POKEMON.forEach((pokemonName) => {
      VERSION_GROUPS.forEach((vg) => {
        urls.push({
          url: `${baseUrl}/pokemon/${pokemonName}/${vg.name}/national`,
          lastModified: currentDate,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      });
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Fallback: at least include priority Pokemon
    PRIORITY_POKEMON.forEach((pokemonName) => {
      majorVersionGroups.forEach((versionGroup) => {
        urls.push({
          url: `${baseUrl}/pokemon/${pokemonName}/${versionGroup}/national`,
          lastModified: currentDate,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      });
    });
  }

  return urls;
}
