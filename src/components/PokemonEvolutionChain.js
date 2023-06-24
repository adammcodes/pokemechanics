import convertKebabCaseToTitleCase from "../utils/convertKebabCaseToTitleCase";
import EvolutionTrigger from "./EvolutionTrigger";
import PokemonSpriteForGen from "./PokemonSpriteForGen";
import { numOfPokemonByGen } from "../../constants/numOfPokemonByGen";

// Filters out evolutions that are not in the given generation
function onlyEvolutionsForGen(evolution, generation) {
  const pokemonId = Number(evolution.species.url.split("/").at(-2));
  return pokemonId < numOfPokemonByGen[generation];
}

const renderEvolutionNode = (node, gameInfo, prevEvolutionInGen) => {
  const { species, evolves_to, evolution_details } = node;
  const { game, generation } = gameInfo;
  const formatName = convertKebabCaseToTitleCase;
  const isPokemonInGen = onlyEvolutionsForGen(node, generation);

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
            <EvolutionTrigger details={evolution_details} />
          )}
          <figure className="flex flex-col items-center">
            <PokemonSpriteForGen
              pokemonId={species.url.split("/").at(-2)}
              game={game}
            />
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

const PokemonEvolutionChain = (chain, gameInfo) => {
  return (
    <div className="flex justify-center">
      {renderEvolutionNode(chain, gameInfo, false)}
    </div>
  );
};

export default PokemonEvolutionChain;
