"use client";

import { PokemonSprite } from "./PokemonSprite";

// Component that renders the pokemon sprite for the current generation
const PokemonSpriteForGen = ({
  sprite,
  dexId,
  game,
  pokemonId,
  speciesName,
}: {
  sprite: string;
  dexId: number;
  game: string;
  pokemonId: number | string;
  speciesName: string;
}) => {
  if (!sprite) return <p>Sprite not available</p>;

  // Otherwise, return the sprite
  return (
    <PokemonSprite
      pokemonId={pokemonId}
      dexId={dexId}
      game={game}
      speciesName={speciesName}
      sprite={sprite}
    />
  );
};

export default PokemonSpriteForGen;
