import { useQuery, gql } from "@apollo/client";
import Box from "@/components/common/Box";
import PokemonTypeChip from "@/components/common/PokemonTypeChip";
import { useMemo } from "react";
import "./TypeEfficacy.css";

const GetEfficacies = gql`
  query GetAllTypeEfficacies {
    pokemon_v2_type {
      name
      id
      generation_id
      pokemonV2TypeefficaciesByTargetTypeId {
        damage_factor
        damage_type_id
        target_type_id
        pokemon_v2_type {
          name
          generation_id
        }
      }
      pokemon_v2_typeefficacypasts {
        damage_factor
        damage_type_id
        target_type_id
        generation_id
        pokemon_v2_generation {
          name
          id
        }
        pokemon_v2_type {
          name
          generation_id
        }
      }
    }
  }
`;

// Example query response for id 8 ghost:
/**
 * 
 * @returns 
 * {
  "data": {
    "pokemon_v2_type": [
      {
        "name": "normal",
        "id": 1,
        "generation_id": 1,
        "pokemonV2TypeefficaciesByTargetTypeId": [
          {
            "damage_factor": 100,
            "damage_type_id": 1,
            "target_type_id": 1,
            "pokemon_v2_type": {
              "name": "normal",
              "generation_id": 1
            }
          },
          ...
        ],
        "pokemon_v2_typeefficacypasts": [
          {
            "damage_factor": 200,
            "damage_type_id": 4,
            "target_type_id": 7,
            "generation_id": 1,
            "pokemon_v2_generation": {
              "name": "generation-i",
              "id": 1
            },
            "pokemon_v2_type": {
              "name": "poison",
              "generation_id": 1
            }
          }
        ]
      }
    }
  }
}
 */

type Efficacy = {
  pokemon_v2_type: {
    name: string;
    generation_id: number;
  };
  damage_factor: number;
  damage_type_id: number;
  target_type_id: number;
};

type EfficacyPast = {
  pokemon_v2_type: {
    name: string;
    generation_id: number;
  };
  damage_factor: number;
  damage_type_id: number;
  target_type_id: number;
  generation_id: number;
  pokemon_v2_generation: {
    name: string;
    id: number;
  };
};

type EfficacyData = {
  pokemon_v2_type: {
    name: string;
    id: number;
    generation_id: number;
    pokemonV2TypeefficaciesByTargetTypeId: Efficacy[];
    pokemon_v2_typeefficacypasts: EfficacyPast[];
  }[];
};

interface TypeEfficacyProps {
  typeIds: number[];
  genId: number;
}

export default function TypeEfficacy({ typeIds, genId }: TypeEfficacyProps) {
  // Get all type efficacies and cache them
  const { loading, error, data } = useQuery<EfficacyData>(GetEfficacies, {
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-only",
  });

  const pokemonTypeEfficacies = useMemo(() => {
    const multipliedEfficacies: {
      type: string;
      damage_factor: number;
    }[] = [];

    if (!data || !data.pokemon_v2_type) return [];

    const pokemonTypes = data.pokemon_v2_type.filter((type) =>
      typeIds.includes(type.id)
    );

    // Multiply the damage factor of the type efficacy of the first type by the damage factor of the type efficacy of the second type,
    // for each type in the pokemonV2TypeByTargetTypeId array
    // If there is only one type, return the damage factor of the type efficacy of the first type only
    // Store the result in the multipliedEfficacies array
    pokemonTypes.forEach((type) => {
      const efficacies = type.pokemonV2TypeefficaciesByTargetTypeId;
      const pastEfficacies = type.pokemon_v2_typeefficacypasts;

      // Use past efficacies if they exist for the generation of the pokemon
      const pastEfficacy = pastEfficacies.filter(
        (efficacy) => efficacy.generation_id <= genId
      );

      efficacies
        // only include type generations that are equal to or less than same generation as the pokemon
        .filter((efficacy) => efficacy.pokemon_v2_type.generation_id <= genId)
        .forEach((efficacy) => {
          const damageTypeId = efficacy.damage_type_id;

          // find the efficacy for the generation of the pokemon if the was an efficacy for the generation of the pokemon
          const pastEfficacyForDamageType = pastEfficacy.find(
            (e) => e.target_type_id === damageTypeId
          );

          const df = pastEfficacyForDamageType
            ? pastEfficacyForDamageType.damage_factor
            : efficacy.damage_factor;

          const existingEfficacy = multipliedEfficacies.find(
            (e) => e.type === efficacy.pokemon_v2_type.name
          );

          if (existingEfficacy) {
            existingEfficacy.damage_factor *= df / 100;
          } else {
            multipliedEfficacies.push({
              type: efficacy.pokemon_v2_type.name,
              damage_factor: df,
            });
          }
        });
    });

    return multipliedEfficacies;
  }, [data, typeIds]);

  console.log("pokemonTypeEfficacies", pokemonTypeEfficacies);

  if (loading) return null;
  if (error) return null;
  if (!data) return null;

  const mappedEfficacies = pokemonTypeEfficacies.map((e) => {
    const df = e.damage_factor;
    const fontColor =
      df === 0
        ? "color-no-effect"
        : df > 100
        ? "color-super-effective"
        : df < 50
        ? "color-min-damage"
        : df < 100
        ? "color-not-effective"
        : "";
    const dfFixed = df === 0 ? 0 : df < 50 ? 2 : 1;
    return (
      <div className="flex flex-col items-center justify-center">
        <PokemonTypeChip key={e.type} typeName={e.type} />
        <span className={`text-sm font-bold ${fontColor}`}>
          x{(df / 100).toFixed(dfFixed)}
        </span>
      </div>
    );
  });

  return (
    <Box headingText="Damage:">
      <article className="w-full grid grid-cols-3 gap-2">
        {mappedEfficacies}
      </article>
    </Box>
  );
}
