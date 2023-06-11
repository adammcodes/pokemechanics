import React from "react";
import { EvolutionContext, GameContext } from "../context/_context";
import { useContext } from "react";
import convertKebabCaseToTitleCase from "../utils/convertKebabCaseToTitleCase";
import { NamedAPIResource } from "pokenode-ts";
import usePokemonClient from "../hooks/usePokemonClient";
import { useQuery } from "react-query";
import findSpritesForVersion from "../utils/findSpritesForVersion";
import styles from "../../styles/Evolutions.module.css";
import useGameVersion from "../hooks/useGameVersion";
import { numOfPokemonByGen } from "../../constants/numOfPokemonByGen";

// Component that renders the pokemon sprite in the Evolution Chain for the current generation
const PokemonSprite = ({
  pokemonId,
  game,
}: {
  pokemonId: string | undefined;
  game: string;
}) => {
  if (!pokemonId) return <p>Sprite not available</p>;

  // If there is no sprite for the current generation, use the official artwork
  let sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

  // Use pokemonId to fetch the pokemon data for the pokemon using the PokemonClient
  // This will give us all the sprites for the pokemon
  const api = usePokemonClient();
  const fetchPokemon = (pokemonId: string) => {
    return api
      .getPokemonById(Number(pokemonId))
      .then((data) => data)
      .catch((err) => {
        throw err;
      });
  };

  // Use react-query to fetch the pokemon data
  const pokemonQuery = useQuery(
    ["pokemonEvolutionSprite", pokemonId],
    () => fetchPokemon(pokemonId),
    {
      enabled: Boolean(pokemonId),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  if (pokemonQuery.isLoading) return <div>Loading sprite...</div>;

  if (pokemonQuery.isError) return <div>Error loading sprite</div>;

  if (pokemonQuery.data) {
    // Render the pokemon sprite for the current generation
    const allSprites = pokemonQuery.data.sprites;
    // Use the sprite for the generation if it exists, otherwise use the default official artwork sprite
    sprite = findSpritesForVersion(allSprites, game).front_default ?? sprite;
  }

  const spriteSize = 80;
  const spriteAltText = `Pokemon sprite`;
  const spriteStyle = {
    width: `${spriteSize}px`,
    height: `${spriteSize}px`,
  };

  return (
    <img
      className="w-20 h-20"
      src={sprite}
      alt={spriteAltText}
      style={spriteStyle}
    />
  );
};

export default function Evolutions() {
  const { game } = useContext(GameContext);
  const version = useGameVersion(game);
  const generation = version?.data.generation.name;
  const e = useContext(EvolutionContext);
  const formatName = convertKebabCaseToTitleCase;

  type Evolution = {
    species: NamedAPIResource;
    evolution_details: any[];
  };

  // recursively flatten the evolution chain
  const flattenEvolutionChain = (chain: any) => {
    console.log(chain);
    const flattenedChain: Evolution[] = [];
    const recurse = (chain: any) => {
      // Push the species to the flattened chain
      // Also push the evolution_details to the flattened chain
      // This is so we can display the evolution details for each evolution
      // e.g. level, item, held item, etc.
      flattenedChain.push({
        species: chain.species,
        evolution_details:
          chain.evolves_to.length > 0
            ? chain.evolves_to[0].evolution_details
            : [],
      });
      if (chain.evolves_to.length > 0) {
        chain.evolves_to.forEach((evolution: any) => {
          recurse(evolution);
        });
      }
    };
    recurse(chain);
    return flattenedChain;
  };

  // Get evolution details
  const getEvolutionDetails = (evolutionDetails: any[]) => {
    const details = evolutionDetails.map((detail) => {
      // return only truthy values of detail while retaining their property names
      return Object.fromEntries(
        Object.entries(detail).filter(([_, value]) => value)
      );
    });
    return details;
  };

  if (e.isLoading) return <div>Loading...</div>;

  return (
    <div className={`${styles.evolutions}`}>
      <p className="py-5">Evolution Chain</p>
      {e.data && generation && (
        <div className="chain flex flex-row items-center justify-center">
          {flattenEvolutionChain(e.data.chain)
            .filter((evolution) => {
              // Filter out evolutions that are not in the current generation
              const pokemonId = Number(evolution.species.url.split("/").at(-2));
              return pokemonId < numOfPokemonByGen[generation];
            })
            .map((evolution, index, arr) => {
              const detailsArray: any = getEvolutionDetails(
                evolution.evolution_details
              );
              const evolveTrigger =
                detailsArray.length > 0 ? detailsArray[0].trigger.name : "";
              const evolveLevel =
                detailsArray.length > 0 ? detailsArray[0].min_level : "";
              const evolveItem =
                detailsArray.length > 0 ? detailsArray[0].item : "";
              return (
                <React.Fragment key={index}>
                  <div className="sprite flex flex-col justify-center items-center">
                    <PokemonSprite
                      pokemonId={evolution.species.url.split("/").at(-2)}
                      game={game}
                    />
                    <span>{formatName(evolution.species.name)}</span>
                  </div>
                  {index !== arr.length - 1 && (
                    <div className="flex flex-col justify-center items-center px-3 py-3">
                      {evolveLevel && <span>Lv. {evolveLevel}</span>}
                      {evolveItem && <span>{formatName(evolveItem.name)}</span>}
                      <span>{formatName(evolveTrigger)}</span>
                      <span>&rarr;</span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
        </div>
      )}
    </div>
  );
}
