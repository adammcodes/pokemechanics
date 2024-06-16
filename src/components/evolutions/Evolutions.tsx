"use client";
import React from "react";
import { EvolutionContext, GameContext } from "@/context/_context";
import { useContext, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./Evolutions.module.css";
import useGameVersion from "@/hooks/useGameVersion";
import PokemonEvolutionChain from "./PokemonEvolutionChain";
import PokeballLoader from "../common/PokeballLoader";

export default function Evolutions() {
  const e = useContext(EvolutionContext);
  const { game } = useContext(GameContext);
  const version = useGameVersion(game);
  const searchParams = useSearchParams();
  // Access the dynamic route parameter value, which is the pokemon id and dexId
  const dexId = searchParams.get("dexId");
  const generation = version?.data.generation.name;

  if (e.isLoading) return <div className="p-5">Loading...</div>;

  return (
    <Suspense fallback={<PokeballLoader />}>
      <div className={`${styles.evolutions}`}>
        <p className="py-5 text-3xl">Evolution Chain</p>
        {e.data && generation && (
          <div className="flex justify-center">
            {PokemonEvolutionChain(e.data.chain, { game, generation, dexId })}
          </div>
        )}
      </div>
    </Suspense>
  );
}
