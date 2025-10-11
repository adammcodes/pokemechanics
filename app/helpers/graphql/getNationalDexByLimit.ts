import { fetchFromGraphQL } from "@/utils/api";

// The limit param is to limit the number of Pokémon returned that applies to the National Pokédex for that generation.
// For example, in Generation 1, the National Pokédex only contains 151 Pokémon. So the limit param would be 151.
const query = `
  query GetPokedexByLimit($limit: Int!) {
    pokedex(where: { id: { _eq: 1 } }) {
      id
      name
      pokedexdescriptions(
        where: { language: { name: { _eq: "en" } } }
      ) {
        description
      }
      pokemondexnumbers(
        # sort by pokemon_species_id to get the Pokémon in National Pokédex order
        order_by: { pokemon_species_id: asc }
        limit: $limit
      ) {
        pokemon_species_id
        pokemonspecy {
          name
        }
      }
    }
  }
`;

export const getNationalDexByLimit = async (limit: number) => {
  try {
    const response = await fetchFromGraphQL({
      query,
      variables: { limit },
    });

    if (!response.data?.pokedex?.[0]) {
      throw new Error(`National Pokédex not found`);
    }

    return response.data.pokedex[0];
  } catch (error) {
    console.error("Error fetching National Pokédex:", error);
    return null;
  }
};
