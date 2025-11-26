import { GraphQLPokemonType } from "@/types/graphql";
import PokemonTypes, { PokemonType } from "./PokemonTypes";

type TypesProps = {
  types: GraphQLPokemonType["type"][];
  pokemontypepasts: GraphQLPokemonType["type"][];
  versionGroup: string; // e.g. "red-blue", "x-y", "omega-ruby-alpha-sapphire"
  generationString: string; // e.g. "generation-i", "generation-ii", "generation-iii", "generation-iv", "generation-v", "generation-vi", "generation-vii", "generation-viii"
  generationId: number;
};

/**
 * Determines which types to display based on GraphQL data and current generation
 * @param types - array of current types from GraphQL pokemontypes
 * @param pokemontypepasts - array of past types from GraphQL pokemontypepasts
 * @param versionGroup - string e.g. "red-blue", "x-y", "omega-ruby-alpha-sapphire"
 * @param generationString - string e.g. "generation-i", "generation-ii", etc.
 * @param generationId - numeric generation ID (1-9)
 * @returns Component displaying type chips for a pokemon
 */
const Types: React.FC<TypesProps> = ({
  types,
  pokemontypepasts,
  versionGroup,
  generationString,
  generationId,
}) => {
  // Convert GraphQL type data to PokemonTypes component format
  const formatTypes = (
    typeArray: GraphQLPokemonType["type"][]
  ): PokemonType[] => {
    return typeArray.map((t) => ({ type: t }));
  };

  // If no past types exist, use current types
  if (pokemontypepasts.length === 0) {
    return (
      <PokemonTypes
        types={formatTypes(types)}
        versionGroup={versionGroup}
        generationString={generationString}
      />
    );
  }

  // Find the highest generation among past types
  const maxPastTypeGeneration = Math.max(
    ...pokemontypepasts.map((t) => t.generation_id)
  );

  // Find the lowest generation among present types
  const minPresentTypeGeneration =
    types.length > 0
      ? Math.min(...types.map((t) => t.generation_id))
      : Infinity;

  // Use past types if current generation is in the range where past types were valid
  // (at or after past types were introduced, but before present types)
  const shouldUsePastTypes =
    generationId >= maxPastTypeGeneration &&
    generationId < minPresentTypeGeneration;

  const typesToDisplay = shouldUsePastTypes ? pokemontypepasts : types;

  if (typesToDisplay.length === 0) {
    return (
      <span>Something went wrong: could not find types for generation.</span>
    );
  }

  return (
    <PokemonTypes
      types={formatTypes(typesToDisplay)}
      versionGroup={versionGroup}
      generationString={generationString}
    />
  );
};

export default Types;
