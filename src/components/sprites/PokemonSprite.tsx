"use client";

import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import Link from "next/link";

// Set the sprite size, alt text, and style
// const spriteSize = 80;
const spriteAltText = `Pokemon sprite`;
// const spriteStyle = {
//   width: `${spriteSize}px`,
// };

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

  return (
    <Link
      href={`/pokemon/${pokemonId}?dexId=${dexId}&game=${game}`}
      className="mt-auto"
    >
      <figure className="flex flex-col items-center cursor-pointer">
        <img src={sprite} alt={spriteAltText} />
        <label className="cursor-pointer">{formatName(speciesName)}</label>
      </figure>
    </Link>
  );
};
