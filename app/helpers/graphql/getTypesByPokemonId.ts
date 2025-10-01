import { fetchFromGraphQL } from "@/utils/api";

const query = `
  query GetPokemonTypes($pokemonId: Int!) {
    pokemon_v2_pokemontype(where: { pokemon_id: { _eq: $pokemonId } }) {
      pokemon_v2_pokemon {
        name
        pokemon_v2_pokemontypepasts {
          pokemon_v2_type {
            generation_id
            name
          }
        }
        pokemon_v2_pokemontypes {
          pokemon_v2_type {
            generation_id
            name
          }
        }
      }
    }
  }
`;

type TypesData = {
  pokemon_v2_pokemontype: {
    pokemon_v2_pokemon: {
      name: string;
      pokemon_v2_pokemontypepasts: {
        pokemon_v2_type: {
          generation_id: number;
          name: string;
        };
      }[];
      pokemon_v2_pokemontypes: {
        pokemon_v2_type: {
          generation_id: number;
          name: string;
        };
      }[];
    };
  }[];
};

export async function getTypesByPokemonId(pokemonId: number) {
  const response = await fetchFromGraphQL({
    query,
    variables: { pokemonId },
  });

  if (!response.data?.pokemon_v2_pokemontype) {
    throw new Error(`Types not found for pokemon ${pokemonId}`);
  }

  const typesData: TypesData = response.data;

  return typesData;
}
