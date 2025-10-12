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

  const { pokemonabilities } = abilitiesData;

  const abilities = pokemonabilities.map((ability) => {
    const { is_hidden, ability: abilityData } = ability;
    const { name, abilityeffecttexts } = abilityData;
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
