import React from "react";
import { EvolutionContext, GameContext } from "@/context/_context";
import { useContext } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Evolutions.module.css";
import useGameVersion from "@/hooks/useGameVersion";
import PokemonEvolutionChain from "./PokemonEvolutionChain";

export default function Evolutions() {
  const e = useContext(EvolutionContext);
  const { game } = useContext(GameContext);
  const version = useGameVersion(game);
  const router = useRouter();
  // Access the dynamic route parameter value, which is the pokemon id and dexId
  const { dexId } = router.query;
  const generation = version?.data.generation.name;

  if (e.isLoading) return <div className="p-5">Loading...</div>;

  return (
    <div className={`${styles.evolutions}`}>
      <p className="py-5 text-3xl">Evolution Chain</p>
      {e.data && generation && (
        <div className="flex justify-center">
          {PokemonEvolutionChain(e.data.chain, { game, generation, dexId })}
        </div>
      )}
    </div>
  );
}
