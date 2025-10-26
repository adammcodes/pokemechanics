import { cache } from "react";
import { fetchFromGraphQL } from "@/utils/api";
import { GraphQLPokemonComplete, GraphQLPokemon } from "@/types/graphql";

/**
 * Comprehensive GraphQL query to fetch all Pokemon data in a single request
 * This replaces 60+ individual REST API calls with 1 GraphQL call
 *
 * Includes:
 * - Pokemon base data (id, name, height, weight, etc.)
 * - Species data (gender_rate, capture_rate, evolution_chain_id)
 * - Sprites, abilities with effect texts
 * - Stats, encounters with location/version details
 * - Types with type efficacy (current and past)
 * - Cries, forms
 * - ALL moves with complete data (pp, machines, damage_class, type, effect texts)
 */
const query = `
  query Pokemon($pokemonName: String!, $versionGroup: String!, $versions: [String!]) {
    pokemon(where: {name: {_eq: $pokemonName}}) {
      id
      pokemon_species_id
      name
      is_default
      base_experience
      height
      weight
      pokemonspecy {
        gender_rate
        generation_id
        hatch_counter
        is_baby
        forms_switchable
        base_happiness
        is_legendary
        is_mythical
        capture_rate
        evolves_from_species_id
        evolution_chain_id
      }
      pokemonsprites { sprites }
      pokemonabilities {
        pokemon_id
        is_hidden
        ability {
          name
          is_main_series
          generation_id
          abilityeffecttexts(where: {language: {name: {_eq: "en"}}}) {
            effect
            short_effect
            language { name }
          }
        }
      }
      pokemonstats {
        base_stat
        effort
        stat { name }
      }
      encounters(where: {version: {name: {_in: $versions}}}) {
        version { name }
        locationarea {
          name
          location { name }
        }
        encounterslot {
          rarity
          encountermethod { name }
        }
        min_level
        max_level
        encounterconditionvaluemaps {
          encounter_id
          encounterconditionvalue {
            name
            id
          }
        }
      }
      pokemontypes {
        type {
          name
          id
          generation_id
          TypeefficaciesByTargetTypeId {
            damage_factor
            damage_type_id
            target_type_id
            type {
              name
              id
              generation_id
            }
          }
          typeefficacypasts {
            damage_factor
            damage_type_id
            target_type_id
            generation_id
            generation { name id }
            type { name id generation_id }
          }
        }
      }
      pokemontypepasts {
        type {
          name
          id
          generation_id
          TypeefficaciesByTargetTypeId {
            damage_factor
            damage_type_id
            target_type_id
            type {
              name
              id
              generation_id
            }
          }
          typeefficacypasts {
            damage_factor
            damage_type_id
            target_type_id
            generation_id
            generation { name id }
            type { name id generation_id }
          }
        }
      }
      pokemoncries { cries }
      pokemonforms {
        form_name
        is_mega
        pokemonformsprites { sprites }
      }
      pokemonmoves(where: {versiongroup: {name: {_eq: $versionGroup}}}) {
        move_id
        level
        movelearnmethod { name }
        move {
          name
          move_effect_chance
          accuracy
          power
          pp
          machines(where: {versiongroup: {name: {_eq: $versionGroup}}}) {
            item {
              name
            }
            machine_number
          }
          movedamageclass { name }
          type {
            id
            name
          }
          moveeffect {
            moveeffecteffecttexts {
              effect
              short_effect
            }
          }
        }
      }
    }
  }
`;

export type GetPokemonCompleteParams = {
  pokemonName: string;
  versionGroup: string;
  versions: string[];
};

/**
 * Fetches complete Pokemon data from GraphQL API
 * Wrapped with React cache() to deduplicate requests during the same render pass
 *
 * @param pokemonName - Pokemon name (e.g., "pikachu", "charizard")
 * @param versionGroup - Version group name (e.g., "red-blue", "diamond-pearl")
 * @param versions - Array of version names (e.g., ["diamond", "pearl", "platinum"])
 * @returns Complete Pokemon data including moves
 */
export const getPokemonComplete = cache(
  async ({
    pokemonName,
    versionGroup,
    versions,
  }: GetPokemonCompleteParams): Promise<GraphQLPokemon | null> => {
    try {
      const response = await fetchFromGraphQL<GraphQLPokemonComplete>({
        query,
        variables: {
          pokemonName,
          versionGroup,
          versions,
        },
      });

      if (!response.data?.pokemon?.[0]) {
        throw new Error(`Pokemon '${pokemonName}' not found`);
      }

      return response.data.pokemon[0];
    } catch (error: any) {
      console.error("Error fetching complete Pokemon data:", error);
      throw error;
    }
  }
);
