import { gql } from "@apollo/client";
import client from "@/apollo/apollo-client";

export const getPokedexById = async (dexId: number) => {
  const query = gql`
    query GetPokedexById($dexId: Int!) {
      pokemon_v2_pokedex_by_pk(id: $dexId) {
        id
        name
        pokemon_v2_pokedexversiongroups {
          pokemon_v2_versiongroup {
            name
            pokemon_v2_versiongroupregions {
              pokemon_v2_region {
                name
              }
            }
          }
        }
        pokemon_v2_pokedexdescriptions(
          where: { pokemon_v2_language: { name: { _eq: "en" } } }
        ) {
          description
        }
        pokemon_v2_pokemondexnumbers(order_by: { pokedex_number: asc }) {
          pokedex_number # this is the "regional" dex number
          pokemon_species_id # this is the national dex id for the pokemon
          pokemon_v2_pokemonspecy {
            name
            pokemon_v2_pokemons(where: { is_default: { _eq: false } }) {
              name
              is_default
              pokemon_v2_pokemonsprites {
                id
              }
            }
          }
        }
      }
    }
  `;

  try {
    const { data } = await client.query({
      query,
      variables: { dexId },
    });
    return data.pokemon_v2_pokedex_by_pk;
  } catch (error) {
    console.error("Error fetching Pokédex:", error);
    return null;
  }
};
