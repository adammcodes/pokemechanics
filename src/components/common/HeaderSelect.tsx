"use client";
import { useContext } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { GameContext } from "@/context/_context";
import HeaderSelectServer from "./HeaderSelectServer";

export default function HeaderSelect() {
  const { game, generationString } = useContext(GameContext);

  const searchParams = useSearchParams();
  const dexId: string | null = searchParams.get("dexId");

  const pathname = usePathname();
  const pokemonId: string | undefined = pathname.split("/")[2];

  return (
    <HeaderSelectServer
      game={game}
      generationString={generationString}
      dexId={dexId}
      pokemonId={pokemonId}
    />
  );
}
