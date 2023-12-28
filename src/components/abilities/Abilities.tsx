import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import { useQuery, gql } from "@apollo/client";
import styles from "@/styles/PokemonCard.module.css";

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
  });

  if (loading)
    return (
      <section
        className={`${styles.card__border} w-[400px] p-[1em] flex flex-col gap-y-3`}
      >
        Loading abilities...
      </section>
    );
  if (error) console.log(error);
  if (error) return <p>Abilities Error:</p>;

  const abilitiesData: AbilitiesData =
    data?.abilities.length > 0 ? data.abilities[0] : undefined;
  // console.log(abilitiesData);

  const { pokemon_v2_pokemonabilities } = abilitiesData;

  const abilities = pokemon_v2_pokemonabilities.map((ability) => {
    const { is_hidden, pokemon_v2_ability } = ability;
    const { name, pokemon_v2_abilityeffecttexts, pokemon_v2_generation } =
      pokemon_v2_ability;
    const { effect, short_effect } = pokemon_v2_abilityeffecttexts[0];
    // const { name: generationName } = pokemon_v2_generation;
    return {
      name,
      is_hidden,
      effect,
      short_effect,
    };
  });

  return (
    <section
      className={`${styles.card__border} w-[400px] p-[1em] flex flex-col gap-y-3`}
    >
      <h2 className="text-3xl">Abilities:</h2>
      {abilities.map((ability) => (
        <div key={ability.name}>
          <h3 className="text-2xl border-b-2">
            {formatName(ability.name)} {ability.is_hidden ? "(hidden)" : ""}
          </h3>
          <p className="text-xl leading-[1em]">{ability.short_effect}</p>
        </div>
      ))}
    </section>
  );
};

export default Abilities;