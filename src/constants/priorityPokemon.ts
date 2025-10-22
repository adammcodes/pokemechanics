/**
 * List of popular/priority Pokemon for:
 * - Higher sitemap priority scores
 * - Static generation at build time (generateStaticParams)
 *
 * These Pokemon will be pre-rendered, eliminating runtime API calls.
 */

export const PRIORITY_POKEMON = [
  // Gen 1 Starters & Evolutions
  "bulbasaur",
  "ivysaur",
  "venusaur",
  "charmander",
  "charmeleon",
  "charizard",
  "squirtle",
  "wartortle",
  "blastoise",

  // Gen 1 Popular
  "pikachu",
  "raichu",
  "eevee",
  "vaporeon",
  "jolteon",
  "flareon",
  "gengar",
  "dragonite",
  "mewtwo",
  "mew",
  "snorlax",
  "lapras",

  // Gen 2 Starters & Evolutions
  "chikorita",
  "bayleef",
  "meganium",
  "cyndaquil",
  "quilava",
  "typhlosion",
  "totodile",
  "croconaw",
  "feraligatr",

  // Gen 2 Popular
  "lugia",
  "ho-oh",
  "tyranitar",
  "espeon",
  "umbreon",

  // Gen 3 Starters & Evolutions
  "treecko",
  "grovyle",
  "sceptile",
  "torchic",
  "combusken",
  "blaziken",
  "mudkip",
  "marshtomp",
  "swampert",

  // Gen 3 Popular
  "rayquaza",
  "groudon",
  "kyogre",
  "garchomp",
  "lucario",
  "metagross",
  "salamence",

  // Gen 4-9 Popular
  "greninja",
  "decidueye",
  "incineroar",
  "primarina",
  "cinderace",
  "inteleon",
  "rillaboom",
] as const;

export const PRIORITY_POKEMON_SET = new Set(PRIORITY_POKEMON);
