"use client";

import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
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
  speciesName,
}: {
  sprite: string;
  dexId: number;
  game: string;
  pokemonId: number | string;
  speciesName: string;
}) => {
  const formatName = convertKebabCaseToTitleCase;
  const router = useRouter();
  const onPokemonSelect = (pokemonId: number | string) => {
    // Navigate to the pokemon page
    router.push(`/pokemon/${pokemonId}?dexId=${dexId}&game=${game}`);
  };
  if (!sprite) return <p>Sprite not available</p>;

  // Otherwise, return the sprite
  return (
    <figure
      className="flex flex-col items-center cursor-pointer"
      onClick={() => onPokemonSelect(pokemonId)}
    >
      <img
        src={sprite}
        height={150}
        width={150}
        alt={spriteAltText}
        style={spriteStyle}
      />
      <label className="cursor-pointer">{formatName(speciesName)}</label>
    </figure>
  );
};

export default PokemonSpriteForGen;
