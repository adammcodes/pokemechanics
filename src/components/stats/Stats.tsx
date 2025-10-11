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

  const { pokemonstats } = statsData;

  const stats = pokemonstats.map((stats) => {
    const { base_stat, effort, stat } = stats;
    const { name } = stat;
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
