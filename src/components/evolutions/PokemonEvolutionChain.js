import EvolutionTrigger from "./EvolutionTrigger";
import { numOfPokemonByGen } from "@/constants/numOfPokemonByGen";
import findEvolutionDetailForGame from "@/lib/findEvolutionDetailForGame";
import { EvolutionNode } from "./EvolutionNode";

// Filters out evolutions that are not in the given generation
function onlyEvolutionsForGen(evolution, generation) {
  const pokemonDexNumber = Number(evolution.species.url.split("/").at(-2));
  return pokemonDexNumber < numOfPokemonByGen[generation];
}

/**
 *
 * @param {*} node {
 *   species: {
 *     name: string,
 *     url: string
 *   },
 *   evolves_to: Chain[],
 *   evolution_details: EvolutionDetail[]
 * }
 * @param {*} gameInfo {
 *   game: string,
 *   generation: string,
 *   dexId: number,
 *   regionName: string
 * }
 * @param {*} prevEvolutionInGen {boolean}
 * @returns {React.ReactNode}
 */
const renderEvolutionNode = (node, gameInfo, prevEvolutionInGen) => {
  const { species, evolves_to, evolution_details } = node;
  const { game, generation, regionName } = gameInfo;

  const isPokemonInGen = onlyEvolutionsForGen(node, generation);
  const pokemonDexNumber = Number(species.url.split("/").at(-2));
  const dexId = gameInfo.dexId;

  const evolutionDetails = findEvolutionDetailForGame(
    species.name,
    evolution_details,
    generation
  );

  return (
    <section
      key={species.name}
      className={`flex flex-wrap flex-${
        evolves_to.length > 2 ? "col" : "row"
      } justify-center items-center px-3`}
    >
      {isPokemonInGen && (
        <>
          {evolution_details.length > 0 && prevEvolutionInGen && (
            <EvolutionTrigger details={evolutionDetails} />
          )}
          <EvolutionNode
            pokemonDexNumber={pokemonDexNumber}
            dexId={dexId}
            game={game}
            regionName={regionName}
            generation={generation}
            species={species}
          />
        </>
      )}
      {evolves_to.length > 0 && (
        <div
          className={`flex flex-wrap justify-center items-center flex-${
            evolves_to.length === 2 ? "col" : "row"
          }`}
        >
          {evolves_to
            .filter((evolution) => onlyEvolutionsForGen(evolution, generation))
            .map((evolution, index) => (
              <div key={index}>
                {renderEvolutionNode(evolution, gameInfo, isPokemonInGen)}
              </div>
            ))}
        </div>
      )}
    </section>
  );
};

/**
 *
 * @param {*} chain
 * @param {*} gameInfo {
 *   game: string,
 *   generation: string,
 *   dexId: number
 *   regionName: string
 * }
 * - gameInfo.game e.g. "red-blue", "yellow", etc.
 * - gameInfo.generation e.g. "generation-i", "generation-ii", etc.
 * - gameInfo.dexId e.g. 1, 2, etc.
 * - gameInfo.regionName e.g. "Alola", "Galar", etc.
 * @returns {React.ReactNode}
 */
const PokemonEvolutionChain = (chain, gameInfo) => {
  return (
    <div className="flex justify-center">
      {renderEvolutionNode(chain, gameInfo, false)}
    </div>
  );
};

export default PokemonEvolutionChain;
