"use client";
import { useCallback } from "react";
import { Sprite } from "@/components/sprites/Sprite";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const onPokemonSelect = useCallback(
    (path: string) => {
      // Navigate to the pokemon page
      router.push(path);
    },
    [router]
  );

  return (
    <div
      className="hover:underline cursor-pointer"
      onClick={() =>
        onPokemonSelect(`/pokemon/${pokemonId}?dexId=${dexId}&game=${game}`)
      }
    >
      {direction === "back" && <>&larr;</>} #{regionalDexNum}{" "}
      <Sprite versionGroup={game} gen={gen} id={pokemonId} size={50} />
      {toTitleCase(pokemonEntry.pokemon_species.name)}{" "}
      {direction === "forward" && <>&rarr;</>}
    </div>
  );
};
