import Box from "@/components/common/Box";
import PokemonTypeChip from "@/components/common/PokemonTypeChip";
import { GraphQLPokemonType } from "@/types/graphql";
import "./TypeEfficacy.css";

type Efficacy = {
  type: {
    name: string;
    id: number;
    generation_id: number;
  };
  damage_factor: number;
  damage_type_id: number;
  target_type_id: number;
};

type EfficacyPast = {
  type: {
    name: string;
    id: number;
    generation_id: number;
  };
  damage_factor: number;
  damage_type_id: number;
  target_type_id: number;
  generation_id: number;
  generation: {
    name: string;
    id: number;
  };
};

interface TypeEfficacyProps {
  pokemonTypes: GraphQLPokemonType[];
  pokemonTypePasts: GraphQLPokemonType[];
  generationId: number;
  versionGroup: string;
  generationString: string;
}

export default async function TypeEfficacy({
  pokemonTypes,
  pokemonTypePasts,
  generationId,
  versionGroup,
  generationString,
}: TypeEfficacyProps) {
  const pokemonTypeEfficacies: {
    typeId: number;
    typeName: string;
    damage_factor: number;
  }[] = [];

  const validTypesForGeneration = pokemonTypes.filter(
    (t) => t.type.generation_id <= generationId
  );

  const typesWithPastEfficacies: GraphQLPokemonType[] =
    validTypesForGeneration.map((t) => {
      return {
        ...t,
        typeefficacypasts: pokemonTypePasts,
      };
    });
  // Determine which types to use based on the generation id and the pokemon type pasts
  let typesForGen: GraphQLPokemonType[] = [];
  if (pokemonTypePasts.length > 0 && validTypesForGeneration.length === 0) {
    typesForGen = pokemonTypePasts;
  } else {
    typesForGen = typesWithPastEfficacies;
  }
  // Multiply the damage factor of the type efficacy of the first type by the damage factor of the type efficacy of the second type,
  // for each type in the pokemonV2TypeByTargetTypeId array
  // If there is only one type, return the damage factor of the type efficacy of the first type only
  // Store the result in the multipliedEfficacies array
  typesForGen.forEach((t: GraphQLPokemonType) => {
    const efficacies = t.type.TypeefficaciesByTargetTypeId;
    const pastEfficacies = t.type.typeefficacypasts;

    // Use past efficacies if they exist for the generation of the pokemon
    const pastEfficacy = pastEfficacies.filter(
      (efficacy: EfficacyPast) => efficacy.generation_id <= generationId
    );

    efficacies
      // only include type generations that are equal to or less than same generation as the pokemon
      .filter(
        (efficacy: Efficacy) => efficacy.type.generation_id <= generationId
      )
      .forEach((efficacy: Efficacy) => {
        const damageTypeId = efficacy.damage_type_id;

        // find the efficacy for the generation of the pokemon if the was an efficacy for the generation of the pokemon
        const pastEfficacyForDamageType = pastEfficacy.find(
          (e: EfficacyPast) => e.target_type_id === damageTypeId
        );

        const df = pastEfficacyForDamageType
          ? pastEfficacyForDamageType.damage_factor
          : efficacy.damage_factor;

        const existingEfficacy = pokemonTypeEfficacies.find(
          (e) => e.typeId === efficacy.type.id
        );

        if (existingEfficacy) {
          existingEfficacy.damage_factor *= df / 100;
        } else {
          pokemonTypeEfficacies.push({
            typeName: efficacy.type.name,
            typeId: efficacy.type.id,
            damage_factor: df,
          });
        }
      });
  });

  const mappedEfficacies = pokemonTypeEfficacies.map((e, i, arr) => {
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
      <div
        key={e.typeId}
        className={`flex flex-col items-center justify-center`}
      >
        <PokemonTypeChip
          typeId={e.typeId}
          typeName={e.typeName}
          versionGroup={versionGroup}
          generationString={generationString}
        />
        <span className={`text-sm font-bold ${fontColor}`}>
          x{(df / 100).toFixed(dfFixed)}
        </span>
      </div>
    );
  });

  return (
    <Box headingText="Damage:">
      <article className="w-full grid grid-cols-3 gap-x-4">
        {mappedEfficacies}
      </article>
    </Box>
  );
}
