import { fetchFromGraphQL } from "@/utils/api";

const query = `
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

export type AbilitiesData = {
  name: string; // pokemon name
  id: number; // pokemon id
  pokemon_v2_pokemonabilities: PokemonAbility[];
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
