"use client";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import { useQuery, gql } from "@apollo/client";
import Box from "@/components/common/Box";

const GetAbilitiesByPokemon = gql`
  query GetAbilitiesByPokemonName($pokemonName: String!) {
    abilities: pokemon_v2_pokemon(
      where: { name: { _eq: $pokemonName } }
      order_by: { id: asc }
    ) {
      name
      id
      pokemon_v2_pokemonabilities {
        pokemon_id
        is_hidden
        pokemon_v2_ability {
          name
          pokemon_v2_abilityeffecttexts(
            where: { pokemon_v2_language: { name: { _eq: "en" } } }
          ) {
            effect
            short_effect
            pokemon_v2_language {
              name
            }
          }
          pokemon_v2_generation {
            name
          }
        }
      }
    }
  }
`;

type AbilitiesProps = {
  pokemonName: string;
};

type PokemonAbilityEffectText = {
  effect: string;
  short_effect: string;
  pokemon_v2_language: {
    name: string;
  };
};

type Ability = {
  name: string;
  pokemon_v2_abilityeffecttexts: PokemonAbilityEffectText[];
  pokemon_v2_generation: {
    name: string;
  };
};

type PokemonAbility = {
  pokemon_id: number;
  is_hidden: boolean;
  pokemon_v2_ability: Ability;
};

type AbilitiesData = {
  name: string; // pokemon name
  id: number; // pokemon id
  pokemon_v2_pokemonabilities: PokemonAbility[];
};

const Abilities: React.FC<AbilitiesProps> = ({ pokemonName }) => {
  const formatName = convertKebabCaseToTitleCase;
  const { loading, error, data } = useQuery(GetAbilitiesByPokemon, {
    variables: { pokemonName: pokemonName.toLowerCase() },
    errorPolicy: "all",
    fetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: false,
  });

  if (loading) return null;
  if (error) {
    console.error("Abilities query error:", error);
    return null;
  }

  const abilitiesData: AbilitiesData =
    data?.abilities.length > 0 ? data.abilities[0] : undefined;

  if (!abilitiesData) {
    return (
      <section
        className={`card__border w-full lg:w-[400px] p-[1em] flex flex-col gap-y-3`}
      >
        Could not find abilities.
      </section>
    );
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
