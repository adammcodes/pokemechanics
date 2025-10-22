"use client";

import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import Link from "next/link";

export const PokemonSprite = ({
  pokemonName,
  dexName,
  game,
  speciesName,
  sprite,
}: {
  pokemonName: string;
  dexName: string;
  game: string;
  speciesName: string;
  sprite: string;
}) => {
  const formatName = convertKebabCaseToTitleCase;

  return (
    <Link
      href={`/pokemon/${pokemonName}/${game}/${dexName}`}
      className="mt-auto"
    >
      <figure className="flex flex-col items-center cursor-pointer">
        <img
          src={sprite}
          alt={speciesName}
          data-testid={`${speciesName}-evolution-sprite`}
        />
        <label className="cursor-pointer">{formatName(speciesName)}</label>
      </figure>
    </Link>
  );
};
