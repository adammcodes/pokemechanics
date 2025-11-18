import { fetchFromGraphQL } from "@/utils/api";

const query = `
  query GetGenerationVersions($name: String!) {
    generation(where: {name: {_eq: $name}}) {
      id
      name
      versiongroups {
        name
        order
        id
        versions {
          id
          name
        }
        versiongroupregions {
          region {
            name
            id
          }
        }
        pokedexversiongroups {
          pokedex {
            id
            name
            region {
              name
            }
            pokemondexnumbers_aggregate {
              aggregate {
                count
              }
            }
            pokedexdescriptions(
              where: { language: { name: { _eq: "en" } } }
            ) {
              description
            }
            pokemondexnumbers(order_by: { pokedex_number: asc }) {
              pokedex_number # this is the "regional" dex number
              pokemon_species_id # this is the national dex id for the pokemon
              pokemonspecy {
                name
                pokemons(where: { is_default: { _eq: false } }) {
                  name
                  is_default
                  pokemonsprites {
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export type GenerationVersions = {
  id: number;
  name: string;
  versiongroups: VersionGroupPokedexes[];
};

export type VersionGroupPokedexes = {
  id: number;
  name: string;
  order: number;
  versions: NamedAPIResource[];
  versiongroupregions: { region: NamedAPIResource }[];
  pokedexversiongroups: {
    pokedex: {
      id: number;
      name: string;
      region: { name: string };
      pokemondexnumbers_aggregate: { aggregate: { count: number } };
      pokedexdescriptions: { description: string }[];
      pokemondexnumbers: PokemonDexNumber[];
    };
  }[];
};

export type PokemonDexNumber = {
  pokedex_number: number;
  pokemon_species_id: number;
  pokemonspecy: {
    name: string;
    pokemons: PokemonForms[];
  };
};

type PokemonForms = {
  name: string;
  is_default: boolean;
  pokemonsprites: { id: number }[];
};

type NamedAPIResource = {
  name: string;
  id: number;
};

export async function getGenerationVersions(generation: string) {
  const response = await fetchFromGraphQL({
    query,
    variables: { name: generation },
  });

  if (!response.data?.generation?.[0]) {
    throw new Error(`Generation '${generation}' not found`);
  }

  const [genVersions] = response.data.generation;

  return genVersions;
}
