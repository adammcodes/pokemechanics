"use client";
import usePokemonClient from "../../hooks/usePokemonClient";
import { useQuery } from "react-query";
import findSpritesForVersion from "../../lib/findSpritesForVersion";
import { PokemonSprite } from "./PokemonSprite";
import splitKebabCase from "@/utils/splitKebabCase";
import toTitleCase from "@/utils/toTitleCase";

// Component that renders the pokemon sprite for the current generation
const PokemonSpriteVariety = ({
  pokemonId,
  pokemonVarietyId,
  game,
  dexId,
}: {
  pokemonId: string | number | undefined;
  pokemonVarietyId: number;
  game: string;
  dexId: number;
}) => {
  if (!pokemonId) return <p>Sprite not available</p>;
  const officialSpriteById = (id: number | string) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  // If there is no sprite for the current generation, use the official artwork
  let sprite = officialSpriteById(pokemonVarietyId);

  // Use pokemonId to fetch the pokemon data for the pokemon using the PokemonClient
  // This will give us all the sprites for the pokemon
  const api = usePokemonClient();
  const fetchPokemon = (pokemonId: number) => {
    return api
      .getPokemonById(Number(pokemonId))
      .then((data) => data)
      .catch((err) => {
        throw err;
      });
  };

  // Use react-query to fetch the pokemon data
  const pokemonQuery = useQuery(
    ["pokemonEvolutionSprite", pokemonVarietyId],
    () => fetchPokemon(Number(pokemonVarietyId)),
    {
      enabled: Boolean(pokemonVarietyId),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  // If the pokemon/species data is loading, return a loading message
  if (pokemonQuery.isLoading) return <div>Loading sprite...</div>;
  // If there is an error, return an error message
  if (pokemonQuery.isError) return <div>Error loading sprite</div>;

  if (pokemonQuery.data) {
    // Render the pokemon sprite for the current generation
    const allSprites = pokemonQuery.data.sprites;
    // Use the sprite for the generation if it exists, otherwise use the default official artwork sprite
    sprite = findSpritesForVersion(allSprites, game).front_default ?? sprite;
  }

  const [speciesName, regionName] = splitKebabCase(pokemonQuery.data?.name);
  const regionTitle = toTitleCase(regionName);

  return (
    <PokemonSprite
      pokemonId={pokemonId}
      dexId={dexId}
      game={game}
      speciesName={`${speciesName} (${regionTitle})`}
      sprite={sprite}
    />
  );
};

export default PokemonSpriteVariety;
