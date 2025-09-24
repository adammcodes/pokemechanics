"use client";
import { useQuery, gql } from "@apollo/client";
import PokemonTypes from "./PokemonTypes";

const GetPokemonTypes = gql`
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

// Example query response for pokemonId 35 (clefairy):
/**
  {
    "data": {
      "pokemon_v2_pokemontype": [
        {
          "pokemon_v2_pokemon": {
            "name": "clefairy",
            "pokemon_v2_pokemontypepasts": [
              {
                "pokemon_v2_type": {
                  "generation_id": 1,
                  "name": "normal"
                }
              }
            ],
            "pokemon_v2_pokemontypes": [
              {
                "pokemon_v2_type": {
                  "generation_id": 6,
                  "name": "fairy"
                }
              }
            ]
          }
        }
      ]
    }
  }
 */

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

type TypesProps = {
  generationId: number; // 1
  pokemonId: number; // 35 (clefairy)
};

/**
 * @param generationId = number e.g. if versionGroup is "red-blue", generationId is 1
 * @param pokemonId = number e.g. 35 (clefairy)
 * @returns Component displaying type chips for a pokemon
 */
const Types: React.FC<TypesProps> = ({ generationId, pokemonId }) => {
  // console.log("generationId", generationId);
  // console.log("pokemonId", pokemonId); // This is actually the pokemon sprite Id

  const { loading, error, data } = useQuery(GetPokemonTypes, {
    variables: { generationId, pokemonId },
    errorPolicy: "all",
    fetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: false,
  });

  if (loading) return null;
  if (error) {
    console.error("Types query error:", error);
    return null;
  }

  const typesData = data as TypesData;

  if (!typesData) {
    return <span>Could not find types data.</span>;
  }

  const pokemonTypes = typesData.pokemon_v2_pokemontype;

  if (pokemonTypes.length === 0) {
    return <span>Could not find pokemon types.</span>;
  }

  const { pokemon_v2_pokemon } = pokemonTypes[0];

  // past and present types
  const pastTypes = pokemon_v2_pokemon.pokemon_v2_pokemontypepasts;
  const presentTypes = pokemon_v2_pokemon.pokemon_v2_pokemontypes;

  const existingPastTypesForGen = pastTypes.filter(
    (t) => t.pokemon_v2_type.generation_id >= generationId
  );

  // Do not show past types if the current generation is greater than the past type's generation
  // Do not show present types if the current generation is less than the present type's generation
  const typesForGen = existingPastTypesForGen.length ? pastTypes : presentTypes;

  if (typesForGen.length === 0) {
    return (
      <span>Something went wrong: could not find types for generation.</span>
    );
  }

  return <PokemonTypes types={typesForGen} />;
};

export default Types;
