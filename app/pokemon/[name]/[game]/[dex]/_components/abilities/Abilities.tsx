import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import Box from "@/components/common/Box";
import { GraphQLPokemon, GraphQLPokemonAbility } from "@/types/graphql";

type AbilitiesProps = {
  graphqlPokemonData: GraphQLPokemon | null;
};

const Abilities: React.FC<AbilitiesProps> = async ({ graphqlPokemonData }) => {
  const formatName = convertKebabCaseToTitleCase;

  const abilitiesData = graphqlPokemonData?.pokemonabilities;

  if (!abilitiesData || abilitiesData.length === 0) {
    return <Box headingText="Abilities:">Could not find abilities.</Box>;
  }

  const abilities = abilitiesData.map((a: GraphQLPokemonAbility) => {
    const { is_hidden, ability } = a;
    const { name, abilityeffecttexts } = ability;
    const { effect, short_effect } = abilityeffecttexts.length
      ? abilityeffecttexts[0]
      : { effect: "", short_effect: "" };
    return {
      name,
      is_hidden,
      effect,
      short_effect,
    };
  });

  return (
    <Box headingText="Abilities:">
      {abilities.map((ability) => (
        <div key={ability.name}>
          <h3 className="border-b-2">
            {formatName(ability.name)}{" "}
            {ability.is_hidden ? <small>(hidden)</small> : ""}
          </h3>
          <p className="text-base leading-none">{ability.short_effect}</p>
        </div>
      ))}
    </Box>
  );
};

export default Abilities;
