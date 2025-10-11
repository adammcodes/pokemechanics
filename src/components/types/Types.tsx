import PokemonTypes from "./PokemonTypes";
import { getTypesByPokemonId } from "@/app/helpers/graphql/getTypesByPokemonId";

type TypesProps = {
  generationId: number; // 1
  pokemonId: number; // 35 (clefairy)
};

/**
 * @param generationId = number e.g. if versionGroup is "red-blue", generationId is 1
 * @param pokemonId = number e.g. 35 (clefairy)
 * @returns Component displaying type chips for a pokemon
 */
const Types: React.FC<TypesProps> = async ({ generationId, pokemonId }) => {
  const typesData = await getTypesByPokemonId(pokemonId);

  if (!typesData) {
    return <span>Could not find types data.</span>;
  }

  const pokemonTypes = typesData.pokemontype;

  if (pokemonTypes.length === 0) {
    return <span>Could not find pokemon types.</span>;
  }

  const { pokemon } = pokemonTypes[0];

  // past and present types
  const pastTypes = pokemon.pokemontypepasts;
  const presentTypes = pokemon.pokemontypes;

  // Find the highest generation among past types
  const maxPastTypeGeneration =
    pastTypes.length > 0
      ? Math.max(...pastTypes.map((t) => t.type.generation_id))
      : 0;

  // Find the lowest generation among present types
  const minPresentTypeGeneration =
    presentTypes.length > 0
      ? Math.min(...presentTypes.map((t) => t.type.generation_id))
      : Infinity;

  // Use past types if current generation is greater than past types generation
  // AND less than present types generation
  const shouldUsePastTypes =
    generationId >= maxPastTypeGeneration &&
    generationId < minPresentTypeGeneration;

  let typesForGen;

  if (shouldUsePastTypes) {
    // Use past types when generation is between past and present
    typesForGen = pastTypes;
  } else {
    // Use present types for current generation and beyond
    const presentTypesForGen = presentTypes.filter(
      (t) => t.type.generation_id <= generationId
    );
    typesForGen =
      presentTypesForGen.length > 0 ? presentTypesForGen : presentTypes;
  }

  if (typesForGen.length === 0) {
    return (
      <span>Something went wrong: could not find types for generation.</span>
    );
  }

  return <PokemonTypes types={typesForGen} />;
};

export default Types;
