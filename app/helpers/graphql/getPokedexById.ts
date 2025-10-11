import { fetchFromGraphQL } from "@/utils/api";

const query = `
    query GetPokedexById($dexId: Int!) {
      pokedex(where: { id: { _eq: $dexId } }) {
        id
        name
        region {
          name
        }
        pokedexdescriptions(
          where: { language: { name: { _eq: "en" } } }
        ) {
          description
        }
        pokemondexnumbers(order_by: { pokedex_number: asc }) {
          pokedex_number # this is the "regional" dex number
          pokemon_species_id # this is the national dex id for the pokemon
          pokemonspecy {
            name
            pokemons(where: { is_default: { _eq: false } }) {
              name
              is_default
              pokemonsprites {
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
    const gqlResponse = await fetchFromGraphQL({
      query,
      variables: { dexId },
    });

    // Optional: fetch Pokedex data from the REST API where its easier to access the region name
    // const restResponse = await fetchPokedexById(dexId);

    if (!gqlResponse.data?.pokedex?.[0]) {
      throw new Error(`Pokedex with ID ${dexId} not found`);
    }

    // console.log("gqlResponse", gqlResponse);
    // console.log("restResponse", restResponse);

    return gqlResponse.data.pokedex[0];
  } catch (error) {
    console.error("Error fetching Pokedex data:", error);
    return null;
  }
}
