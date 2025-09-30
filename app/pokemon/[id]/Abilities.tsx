import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import Box from "@/components/common/Box";
import {
  getAbilitiesByPokemon,
  AbilitiesData,
} from "@/app/helpers/graphql/getAbilitiesByPokemon";

type AbilitiesProps = {
  pokemonName: string;
};

const Abilities: React.FC<AbilitiesProps> = async ({ pokemonName }) => {
  const formatName = convertKebabCaseToTitleCase;

  const abilitiesData: AbilitiesData | undefined = await getAbilitiesByPokemon(
    pokemonName
  );

  if (!abilitiesData) {
    return <Box headingText="Abilities:">Could not find abilities.</Box>;
  }

  const { pokemon_v2_pokemonabilities } = abilitiesData;

  const abilities = pokemon_v2_pokemonabilities.map((ability) => {
    const { is_hidden, pokemon_v2_ability } = ability;
    const { name, pokemon_v2_abilityeffecttexts } = pokemon_v2_ability;
    const { effect, short_effect } = pokemon_v2_abilityeffecttexts.length
      ? pokemon_v2_abilityeffecttexts[0]
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
