"use client";
import Link from "next/link";
import { Sprite } from "./_components/sprites/Sprite";
import toTitleCase from "@/utils/toTitleCase";

type ForwardBackSpriteProps = {
  direction: "back" | "forward";
  pokemonId: string;
  regionalDexNum: string;
  pokemonEntry: any;
  game: string;
  gen: string;
  dexId: string;
};

export const ForwardBackSprite = ({
  direction,
  pokemonId,
  regionalDexNum,
  pokemonEntry,
  game,
  gen,
  dexId,
}: ForwardBackSpriteProps) => {
  return (
    <Link
      href={`/pokemon/${pokemonId}?dexId=${dexId}&game=${game}`}
      className="hover:underline cursor-pointer block"
    >
      {direction === "back" && <>&larr;</>} #{regionalDexNum}{" "}
      <Sprite game={game} gen={gen} id={pokemonId} size={50} />
      {toTitleCase(pokemonEntry.pokemon_species.name)}{" "}
      {direction === "forward" && <>&rarr;</>}
    </Link>
  );
};
