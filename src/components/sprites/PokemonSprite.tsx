"use client";

import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import { useRouter } from "next/navigation";

// Set the sprite size, alt text, and style
const spriteSize = 80;
const spriteAltText = `Pokemon sprite`;
const spriteStyle = {
  width: `${spriteSize}px`,
};

export const PokemonSprite = ({
  pokemonId,
  dexId,
  game,
  speciesName,
  sprite,
}: {
  pokemonId: number | string;
  dexId: number;
  game: string;
  speciesName: string;
  sprite: string;
}) => {
  const formatName = convertKebabCaseToTitleCase;
  const router = useRouter();
  const onPokemonSelect = (pokemonId: number | string) => {
    // Navigate to the pokemon page
    router.push(`/pokemon/${pokemonId}?dexId=${dexId}&game=${game}`);
  };
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
