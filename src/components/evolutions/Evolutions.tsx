"use client";
import { EvolutionContext } from "@/context/_context";
import { useContext } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./Evolutions.module.css";
import useGameVersion from "@/hooks/useGameVersion";
import PokemonEvolutionChain from "./PokemonEvolutionChain";

export default function Evolutions() {
  const e = useContext(EvolutionContext);
  const searchParams = useSearchParams();
  const dexId = searchParams.get("dexId");
  const game = searchParams.get("game");
  const version = useGameVersion(game || "red-blue");
  const generation = version?.data?.generation?.name;
  // Access the dynamic route parameter value, which is the pokemon id and dexId

  if (e.isLoading) return <div className="p-5">Loading...</div>;

  if (!game || !generation || !dexId) return null;

  return (
    <div className={`${styles.evolutions} py-5`}>
      {e.data && generation && dexId && (
        <div className="flex justify-center">
          {PokemonEvolutionChain(e.data.chain, { game, generation, dexId })}
        </div>
      )}
    </div>
  );
}
