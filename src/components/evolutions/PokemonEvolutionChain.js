import EvolutionTrigger from "./EvolutionTrigger";
import PokemonSpriteForGen from "../sprites/PokemonSpriteForGen";
import { numOfPokemonByGen } from "@/constants/numOfPokemonByGen";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import findEvolutionDetailForGame from "@/lib/findEvolutionDetailForGame";

// Filters out evolutions that are not in the given generation
function onlyEvolutionsForGen(evolution, generation) {
  const pokemonDexNumber = Number(evolution.species.url.split("/").at(-2));
  return pokemonDexNumber < numOfPokemonByGen[generation];
}

const renderEvolutionNode = (node, gameInfo, prevEvolutionInGen) => {
  const { species, evolves_to, evolution_details } = node;
  const { game, generation } = gameInfo;
  const formatName = convertKebabCaseToTitleCase;
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
          <figure className="flex flex-col items-center">
            <a href={`/pokemon/${pokemonDexNumber}?dexId=${dexId}`}>
              <PokemonSpriteForGen pokemonId={pokemonDexNumber} game={game} />
            </a>
            <label>{formatName(species.name)}</label>
          </figure>
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

/* 
  gameInfo {
    game: string,
    generation: number,
    dexId: number
  }
*/
const PokemonEvolutionChain = (chain, gameInfo) => {
  return (
    <div className="flex justify-center">
      {renderEvolutionNode(chain, gameInfo, false)}
    </div>
  );
};

export default PokemonEvolutionChain;
