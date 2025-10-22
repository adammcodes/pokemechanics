import { PokemonSprite } from "./PokemonSprite";

// Component that renders the pokemon sprite for the current generation
const PokemonSpriteForGen = async ({
  sprite,
  dexName,
  game,
  pokemonName,
  speciesName,
}: {
  sprite: string;
  dexName: string;
  game: string;
  pokemonName: string;
  speciesName: string;
}) => {
  if (!sprite) return <p>Sprite not available</p>;
  // Otherwise, return the sprite
  return (
    <PokemonSprite
      pokemonName={pokemonName}
      dexName={dexName}
      game={game}
      speciesName={speciesName}
      sprite={sprite}
    />
  );
};

export default PokemonSpriteForGen;
