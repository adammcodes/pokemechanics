"use client";
import { useQuery, gql } from "@apollo/client";
import StatBars from "./StatsBar";
import Box from "../common/Box";

const GetPokemonStats = gql`
  query GetPokemonStats($pokemonName: String!) {
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

type StatsProps = {
  pokemonName: string;
};

type PokemonStat = {
  base_stat: number;
  effort: number;
  pokemon_v2_stat: {
    name: string;
  };
};

type PokemonStats = {
  name: string;
  pokemon_v2_pokemonstats: PokemonStat[];
};

const Stats: React.FC<StatsProps> = ({ pokemonName }) => {
  const { loading, error, data } = useQuery(GetPokemonStats, {
    variables: { pokemonName: pokemonName.toLowerCase() },
  });

  if (loading) return null;
  if (error) {
    console.error(error);
    return null;
  }

  const statsData: PokemonStats | undefined =
    data?.stats?.length > 0 ? data.stats[0] : undefined;

  if (!statsData)
    return (
      <section
        className={`card__border w-full lg:w-[400px] p-[1em] flex flex-col gap-y-3`}
      >
        Could not find stats.
      </section>
    );

  const { pokemon_v2_pokemonstats } = statsData;

  const stats = pokemon_v2_pokemonstats.map((stats) => {
    const { base_stat, effort, pokemon_v2_stat } = stats;
    const { name } = pokemon_v2_stat;
    return {
      name,
      base_stat,
      effort,
    };
  });

  return (
    <Box headingText="Base Stats:">
      <StatBars stats={stats} />
    </Box>
  );
};

export default Stats;
