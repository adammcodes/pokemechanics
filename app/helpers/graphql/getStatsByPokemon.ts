import { fetchFromGraphQL } from "@/utils/api";

const query = `
  query GetStatsByPokemonName($pokemonName: String!) {
    stats: pokemon(where: { name: { _eq: $pokemonName } }) {
      name
      pokemonstats {
        base_stat
        effort
        stat {
          name
        }
      }
    }
  }
`;

type PokemonStat = {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
  };
};

export type PokemonStats = {
  name: string;
  pokemonstats: PokemonStat[];
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
