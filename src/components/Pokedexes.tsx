import { useContext } from "react";
import { numOfPokemonByGen } from "@/constants/numOfPokemonByGen";
import { GameContext } from "@/context/_context";
import { PokedexContextProvider } from "@/context/PokedexContextProvider";
import useGameVersion from "@/hooks/useGameVersion";
import Dex from "@/components/Dex";
import { DexNational } from "@/components/DexNational";
import styles from "@/styles/Pokedexes.module.css";

type Pokedex = {
  name: string;
  url: string;
};

// Pokedexes is a component that renders all the pokedexes for a given generation
// This component is rendered in pages/pokedex/index.tsx when there is no gen string in the path
export default function Pokedexes() {
  // Get currently selected game for it's version url
  const { game } = useContext(GameContext);
  // Get versionGroup data for the game
  const versionGroup = useGameVersion(game || "red-blue");
  const gen: string = versionGroup.data
    ? versionGroup.data.generation.name
    : "generation-i";
  // The version group may have more than one pokedex
  const pokedexes: Pokedex[] = versionGroup.data
    ? versionGroup.data.pokedexes
    : [];

  // Map each pokedex to it's own data request and context provider
  const mappedDexes: JSX.Element[] = pokedexes.length
    ? pokedexes.map((dex: Pokedex) => {
        const id: number | undefined = Number(dex.url.split("/").at(-2));
        return (
          <PokedexContextProvider key={dex.url} dexId={id}>
            <Dex />
          </PokedexContextProvider>
        );
      })
    : [];

  return (
    <div
      className={`${styles.pokedexes} flex flex-wrap w-full justify-around items-start px-5`}
    >
      {versionGroup.data && (
        <PokedexContextProvider
          key="https://pokeapi.co/api/v2/pokedex/1/"
          dexId={1}
        >
          <DexNational
            generation={gen}
            upperLimitNumber={numOfPokemonByGen[gen]}
          />
        </PokedexContextProvider>
      )}
      <div
        className={`${styles.pokedexes} flex flex-wrap w-full justify-around items-start px-5`}
      >
        {pokedexes.length > 0 && mappedDexes}
      </div>
    </div>
  );
}
