import { gql } from "@apollo/client";
import client from "@/apollo/apollo-client";

export const getNationalDexByLimit = async (limit: number) => {
  // The limit param is to limit the number of Pokémon returned that applies to the National Pokédex for that generation.
  // For example, in Generation 1, the National Pokédex only contains 151 Pokémon. So the limit param would be 151.
  const query = gql`
    query GetPokedexByLimit($limit: Int!) {
      pokemon_v2_pokedex_by_pk(id: 1) {
        id
        name
        pokemon_v2_pokedexdescriptions(
          where: { pokemon_v2_language: { name: { _eq: "en" } } }
        ) {
          description
        }
        pokemon_v2_pokemondexnumbers(
          # sort by pokemon_species_id to get the Pokémon in National Pokédex order
          order_by: { pokemon_species_id: asc }
          limit: $limit
        ) {
          pokemon_species_id
          pokemon_v2_pokemonspecy {
            name
          }
        }
      }
    }
  `;

  try {
    const { data } = await client.query({
      query,
      variables: { limit },
    });
    return data.pokemon_v2_pokedex_by_pk;
  } catch (error) {
    console.error("Error fetching National Pokédex:", error);
    return null;
  }
};
