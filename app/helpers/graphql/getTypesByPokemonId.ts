import { fetchFromGraphQL } from "@/utils/api";

const query = `
  query GetPokemonTypes($pokemonId: Int!) {
    pokemontype(where: { pokemon_id: { _eq: $pokemonId } }) {
      pokemon {
        name
        pokemontypepasts {
          type {
            id
            generation_id
            name
          }
        }
        pokemontypes {
          type {
            id
            generation_id
            name
          }
        }
      }
    }
  }
`;

type TypesData = {
  pokemontype: {
    pokemon: {
      name: string;
      pokemontypepasts: {
        type: {
          id: number;
          generation_id: number;
          name: string;
        };
      }[];
      pokemontypes: {
        type: {
          id: number;
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

  if (!response.data?.pokemontype) {
    throw new Error(`Types not found for pokemon ${pokemonId}`);
  }

  const typesData: TypesData = response.data;

  return typesData;
}
