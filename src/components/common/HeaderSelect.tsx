"use client";
import { useContext } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import PokedexById from "@/app/pokedex/PokedexById";
import NationalDex from "@/app/pokedex/NationalDex";
import { GameContext } from "@/context/_context";

export default function HeaderSelect() {
  const { game, generationString } = useContext(GameContext);

  const searchParams = useSearchParams();
  // Get the dexId from the search params e.g. http://localhost:3000/pokemon/2?dexId=1
  const dexId: string | null = searchParams.get("dexId");

  const pathname = usePathname();
  // Get pokemon id from the pathname; e.g. http://localhost:3000/pokemon/2?dexId=1
  const pokemonId: string | undefined = pathname.split("/")[2];

  const isNationalDex = dexId === "1";
  const isPokemonPage = dexId && pokemonId && generationString;

  return (
    <>
      {isPokemonPage && !isNationalDex && (
        <PokedexById
          dexId={parseInt(dexId)}
          pokemonId={parseInt(pokemonId)}
          includeHeader={false}
          game={game}
          generationString={generationString}
        />
      )}

      {isPokemonPage && isNationalDex && (
        <NationalDex
          includeHeader={false}
          game={game}
          generationString={generationString}
        />
      )}
    </>
  );
}
