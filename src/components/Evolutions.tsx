import React from "react";
import { EvolutionContext, GameContext } from "../context/_context";
import { useContext } from "react";
import styles from "../../styles/Evolutions.module.css";
import useGameVersion from "../hooks/useGameVersion";
import PokemonEvolutionChain from "./PokemonEvolutionChain";

export default function Evolutions() {
  const { game } = useContext(GameContext);
  const version = useGameVersion(game);
  const generation = version?.data.generation.name;
  const e = useContext(EvolutionContext);

  if (e.isLoading) return <div className="p-5">Loading...</div>;

  return (
    <div className={`${styles.evolutions}`}>
      <p className="py-5">Evolution Chain</p>
      {e.data && generation && (
        <div className="flex justify-center">
          {PokemonEvolutionChain(e.data.chain, { game, generation })}
        </div>
      )}
    </div>
  );
}
