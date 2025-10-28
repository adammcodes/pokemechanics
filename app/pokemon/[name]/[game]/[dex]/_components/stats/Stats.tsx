import StatBars from "./StatsBar";
import Box from "@/components/common/Box";
import { GraphQLPokemon, GraphQLPokemonStat } from "@/types/graphql";

type StatsProps = {
  graphqlPokemonData: GraphQLPokemon | null;
};

const Stats: React.FC<StatsProps> = async ({ graphqlPokemonData }) => {
  const statsData = graphqlPokemonData?.pokemonstats;

  if (!statsData || statsData.length === 0)
    return <Box headingText="Base Stats:">Could not find stats.</Box>;

  const stats = statsData.map((s: GraphQLPokemonStat) => {
    const { base_stat, effort, stat } = s;
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
