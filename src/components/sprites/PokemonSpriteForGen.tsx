"use client";

import { useRouter } from "next/navigation";

// Set the sprite size, alt text, and style
const spriteSize = 80;
const spriteAltText = `Pokemon sprite`;
const spriteStyle = {
  width: `${spriteSize}px`,
};

// Component that renders the pokemon sprite for the current generation
const PokemonSpriteForGen = ({
  sprite,
  dexId,
  game,
  pokemonId,
}: {
  sprite: string;
  dexId: number;
  game: string;
  pokemonId: number | string;
}) => {
  const router = useRouter();
  const onPokemonSelect = (pokemonId: number | string) => {
    // Navigate to the pokemon page
    router.push(`/pokemon/${pokemonId}?dexId=${dexId}&game=${game}`);
  };
  if (!sprite) return <p>Sprite not available</p>;

  // Otherwise, return the sprite
  return (
    <div onClick={() => onPokemonSelect(pokemonId)}>
      <img
        src={sprite}
        height={150}
        width={150}
        alt={spriteAltText}
        style={spriteStyle}
      />
    </div>
  );
};

export default PokemonSpriteForGen;
