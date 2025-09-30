import { fetchFromGraphQL } from "@/utils/api";

const query = `
  query GetStatsByPokemonName($pokemonName: String!) {
    stats: pokemon_v2_pokemon(where: { name: { _eq: $pokemonName } }) {
      name
      pokemon_v2_pokemonstats {
        base_stat
        effort
        pokemon_v2_stat {
          name
        }
      }
    }
  }
`;

type PokemonStat = {
  base_stat: number;
  effort: number;
  pokemon_v2_stat: {
    name: string;
  };
};

export type PokemonStats = {
  name: string;
  pokemon_v2_pokemonstats: PokemonStat[];
};

export async function getStatsByPokemon(pokemonName: string) {
  const response = await fetchFromGraphQL({
    query,
    variables: { pokemonName },
  });

  if (!response.data?.stats) {
    throw new Error(`Stats not found for pokemon ${pokemonName}`);
  }

  const statsData: PokemonStats | undefined =
    response.data?.stats.length > 0 ? response.data.stats[0] : undefined;

  return statsData;
}
