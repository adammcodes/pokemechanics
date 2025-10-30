"use client";
import Link from "next/link";
import { Sprite } from "./Sprite";
import toTitleCase from "@/utils/toTitleCase";

type ForwardBackSpriteProps = {
  direction: "back" | "forward";
  pokemonUrl: string;
  regionalDexNum: string;
  pokemonEntry: any;
  game: string;
  gen: string;
};

export const ForwardBackSprite = ({
  direction,
  pokemonUrl,
  regionalDexNum,
  pokemonEntry,
  gen,
  game,
}: ForwardBackSpriteProps) => {
  const id = pokemonEntry.pokemon_species.url.split("/").at(-2) || 0;

  return (
    <Link
      href={pokemonUrl}
      prefetch={false}
      className="hover:underline cursor-pointer block"
    >
      {direction === "back" && <>&larr;</>} #{regionalDexNum}{" "}
      <Sprite game={game} gen={gen} id={id} size={50} />
      {toTitleCase(pokemonEntry.pokemon_species.name)}{" "}
      {direction === "forward" && <>&rarr;</>}
    </Link>
  );
};
