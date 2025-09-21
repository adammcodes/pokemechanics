import Box from "@/components/common/Box";
import PokemonTypeChip from "@/components/common/PokemonTypeChip";
import "./TypeEfficacy.css";

// Server-side data fetching function
async function fetchTypeEfficacies() {
  const response = await fetch("https://beta.pokeapi.co/graphql/v1beta", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
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
      `,
    }),
  });

  if (!response.ok) {
    console.log(response);
    throw new Error(`Failed to fetch type efficacies: ${response.status}`);
  }

  return response.json();
}

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

interface TypeEfficacyServerProps {
  typeIds: number[];
  genId: number;
}

export default async function TypeEfficacyServer({
  typeIds,
  genId,
}: TypeEfficacyServerProps) {
  // Fetch type efficacies data
  const { data } = await fetchTypeEfficacies();

  if (!data || !data.pokemon_v2_type) return null;

  const pokemonTypeEfficacies: {
    type: string;
    damage_factor: number;
  }[] = [];

  const pokemonTypes = data.pokemon_v2_type.filter((type: any) =>
    typeIds.includes(type.id)
  );

  // Multiply the damage factor of the type efficacy of the first type by the damage factor of the type efficacy of the second type,
  // for each type in the pokemonV2TypeByTargetTypeId array
  // If there is only one type, return the damage factor of the type efficacy of the first type only
  // Store the result in the multipliedEfficacies array
  pokemonTypes.forEach((type: any) => {
    const efficacies = type.pokemonV2TypeefficaciesByTargetTypeId;
    const pastEfficacies = type.pokemon_v2_typeefficacypasts;

    // Use past efficacies if they exist for the generation of the pokemon
    const pastEfficacy = pastEfficacies.filter(
      (efficacy: any) => efficacy.generation_id <= genId
    );

    efficacies
      // only include type generations that are equal to or less than same generation as the pokemon
      .filter(
        (efficacy: any) => efficacy.pokemon_v2_type.generation_id <= genId
      )
      .forEach((efficacy: any) => {
        const damageTypeId = efficacy.damage_type_id;

        // find the efficacy for the generation of the pokemon if the was an efficacy for the generation of the pokemon
        const pastEfficacyForDamageType = pastEfficacy.find(
          (e: any) => e.target_type_id === damageTypeId
        );

        const df = pastEfficacyForDamageType
          ? pastEfficacyForDamageType.damage_factor
          : efficacy.damage_factor;

        const existingEfficacy = pokemonTypeEfficacies.find(
          (e) => e.type === efficacy.pokemon_v2_type.name
        );

        if (existingEfficacy) {
          existingEfficacy.damage_factor *= df / 100;
        } else {
          pokemonTypeEfficacies.push({
            type: efficacy.pokemon_v2_type.name,
            damage_factor: df,
          });
        }
      });
  });

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
      <div key={e.type} className="flex flex-col items-center justify-center">
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
