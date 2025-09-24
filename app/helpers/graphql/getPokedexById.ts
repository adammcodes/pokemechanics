import { fetchFromGraphQL } from "@/utils/api";
// import { fetchPokedexById } from "../rest/fetchPokedexById";

const query = `
    query GetPokedexById($dexId: Int!) {
      pokemon_v2_pokedex_by_pk(id: $dexId) {
        id
        name
        pokemon_v2_region {
          name
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

export async function getPokedexById(dexId: number) {
  try {
    const gqlResponse = await fetchFromGraphQL(query, { dexId });

    // Optional: fetch Pokedex data from the REST API where its easier to access the region name
    // const restResponse = await fetchPokedexById(dexId);

    if (!gqlResponse.data?.pokemon_v2_pokedex_by_pk) {
      throw new Error(`Pokedex with ID ${dexId} not found`);
    }

    // console.log("gqlResponse", gqlResponse);
    // console.log("restResponse", restResponse);

    return gqlResponse.data.pokemon_v2_pokedex_by_pk;
  } catch (error) {
    console.error("Error fetching Pokedex data:", error);
    return null;
  }
}
