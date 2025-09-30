import StatBars from "./StatsBar";
import Box from "../common/Box";
import {
  getStatsByPokemon,
  PokemonStats,
} from "@/app/helpers/graphql/getStatsByPokemon";

type StatsProps = {
  pokemonName: string;
};

const Stats: React.FC<StatsProps> = async ({ pokemonName }) => {
  const statsData: PokemonStats | undefined = await getStatsByPokemon(
    pokemonName
  );

  if (!statsData)
    return <Box headingText="Base Stats:">Could not find stats.</Box>;

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
