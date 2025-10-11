import { fetchFromGraphQL } from "@/utils/api";

const query = `
  query GetAbilitiesByPokemonName($pokemonName: String!) {
    abilities: pokemon(
      where: { name: { _eq: $pokemonName } }
      order_by: { id: asc }
    ) {
      name
      id
      pokemonabilities {
        pokemon_id
        is_hidden
        ability {
          name
          abilityeffecttexts(
            where: { language: { name: { _eq: "en" } } }
          ) {
            effect
            short_effect
            language {
              name
            }
          }
          generation {
            name
          }
        }
      }
    }
  }
`;

type PokemonAbilityEffectText = {
  effect: string;
  short_effect: string;
  language: {
    name: string;
  };
};

type Ability = {
  name: string;
  abilityeffecttexts: PokemonAbilityEffectText[];
  generation: {
    name: string;
  };
};

type PokemonAbility = {
  pokemon_id: number;
  is_hidden: boolean;
  ability: Ability;
};

export type AbilitiesData = {
  name: string; // pokemon name
  id: number; // pokemon id
  pokemonabilities: PokemonAbility[];
};

export async function getAbilitiesByPokemon(pokemonName: string) {
  const response = await fetchFromGraphQL({
    query,
    variables: { pokemonName },
  });

  if (!response.data?.abilities) {
    throw new Error(`Abilities not found for pokemon ${pokemonName}`);
  }

  const abilitiesData: AbilitiesData =
    response.data?.abilities.length > 0
      ? response.data.abilities[0]
      : undefined;

  return abilitiesData;
}
